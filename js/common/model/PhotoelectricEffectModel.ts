// Copyright 2026, University of Colorado Boulder

/**
 * Particle-based photoelectric effect model.
 * Owns the photon and electron collections and computes analytic current.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { type PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import type Tandem from '../../../../tandem/js/Tandem.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import ReferenceArrayIO from '../../../../tandem/js/types/ReferenceArrayIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Battery from './Battery.js';
import Collector from './Collector.js';
import Electron, { type ElectronStateObject } from './Electron.js';
import Material, { MaterialType } from './Material.js';
import PhotoelectricEffectPreferences from './PhotoelectricEffectPreferences.js';
import { wavelengthToEnergy } from './PhotoelectricEffectUtils.js';
import Photon, { type PhotonStateObject } from './Photon.js';
import PhotonSource from './PhotonSource.js';
import Target from './Target.js';

type SelfOptions = EmptySelfOptions;
export type PhotoelectricEffectModelOptions = SelfOptions &
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioType'>;

type CustomMaterialsFactory = ( tandem: Tandem ) => Material[];

// PhET-iO serialized state for the photoelectric-effect model.
export type PhotoelectricEffectModelStateObject = {
  photons: PhotonStateObject[];
  electrons: ElectronStateObject[];
  photonEmissionAccumulator: number;
};

// Maximum integration step for particle emission and motion. Large browser resume steps are split into smaller chunks
// so photon/electron streams remain spatially continuous instead of jumping across the play area in one frame.
// TODO: Review this tuning value with the design team. Larger values will only tap into this fix for larger joist
//  steps. Smaller values improve particle continuity, but can increase per-frame work on slower platforms because
//  slow frames require more substeps. On my modern laptop, 1 / 60 still only ran 1 iteration per frame, except for
//  returning after minimizing. See https://github.com/phetsims/photoelectric-effect/issues/89
// TODO: NOTE I did not apply this to the energy screen because the "photon stream" doesn't apply in that sim.
const MAX_PARTICLE_DT = 1 / 60;

export default class PhotoelectricEffectModel extends PhetioObject implements TModel {

  // Active photons in the model.
  public readonly photons: Photon[] = [];

  // Active electrons in the model.
  public readonly electrons: Electron[] = [];

  // Target plate that emits electrons.
  public readonly target: Target;

  // Collector plate that receives emitted electrons.
  // Used to determine current flow in the intro screen.
  public readonly collector: Collector;

  // Battery that sets the potential difference between plates.
  // Controls the electric field that accelerates or decelerates electrons.
  public readonly battery: Battery;

  // Photon source that emits toward the target.
  public readonly photonSource: PhotonSource;

  // Wavelength of emitted photons in nanometers.
  public readonly wavelengthProperty: NumberProperty;

  // Derived analytic current based on model settings.
  public readonly currentProperty: ReadOnlyProperty<number>;

  // When false, continuous time stepping is paused; the step-forward control advances the model.
  public readonly isPlayingProperty: BooleanProperty;

  // Controls whether emitted electrons are rendered in the particle canvas.
  public readonly showElectronsProperty: BooleanProperty;

  // When true, use Java-style simple mode so only highest-band collisions emit electrons.
  public readonly showHighestEnergyOnlyProperty: BooleanProperty;

  // Emits when the model has been reset to its default state.
  public readonly resetEmitter = new Emitter();

  // Accumulates fractional photon emissions between steps.
  // Physics-wise, the photon source defines a continuous photon flux (photons/second), while the model
  // emits discrete photons each step. The accumulator carries the fractional remainder so the time-integrated
  // photon count matches the continuous flux and does not drift with the chosen time step.
  private photonEmissionAccumulator = 0;

  // Emits when a photon hits the target, carrying the colliding photon and any electron emitted by the collision
  // (null when no electron was produced). Subclasses subscribe to record per-collision data.
  public readonly photonCollidedEmitter: Emitter<[ Photon, Electron | null ]>;

  /**
   * @param mysteryMaterials - mystery materials owned by PhotoelectricEffectPreferencesModel and passed down.
   *   One entry for the user-configurable mystery material; additional entries can be added in the future
   *   for PhET-iO clients to manipulate.
   * @param createCustomMaterials - Creates custom materials that the student can play with. These have a controllable
   *                                work function. This is a factory callback (instead of pre-created instances) so
   *                                this model can create them with THIS model's tandem during construction.
   * @param providedOptions
   */
  public constructor(
    mysteryMaterials: Material[],
    createCustomMaterials: CustomMaterialsFactory | null,
    providedOptions: PhotoelectricEffectModelOptions
  ) {

    const options = optionize<PhotoelectricEffectModelOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: PhotoelectricEffectModel.PhotoelectricEffectModelIO,
      phetioState: true
    }, providedOptions );

    super( options );

    const tandem = options.tandem;
    const materialsTandem = tandem.createTandem( 'materials' );

    this.photonCollidedEmitter = new Emitter<[ Photon, Electron | null ]>( {
      tandem: tandem.createTandem( 'photonCollidedEmitter' ),
      parameters: [
        {
          name: 'photon',
          phetioType: Photon.PhotonIO,
          valueType: Photon
        },
        {
          name: 'electron',
          phetioType: NullableIO( Electron.ElectronIO ),
          valueType: [ Electron, null ]
        }
      ]
    } );

    const customMaterials = createCustomMaterials ? createCustomMaterials( materialsTandem ) : [];

    const standardMaterials = [
      new Material( MaterialType.SODIUM, { tandem: materialsTandem.createTandem( 'sodium' ) } ),
      new Material( MaterialType.COPPER, { tandem: materialsTandem.createTandem( 'copper' ) } ),
      new Material( MaterialType.CALCIUM, { tandem: materialsTandem.createTandem( 'calcium' ) } ),
      new Material( MaterialType.PLATINUM, { tandem: materialsTandem.createTandem( 'platinum' ) } ),
      new Material( MaterialType.ZINC, { tandem: materialsTandem.createTandem( 'zinc' ) } )
    ];

    // The order according to the design document - standard, mystery, then custom.
    const allMaterials = [
      ...standardMaterials,
      ...mysteryMaterials,
      ...customMaterials
    ];

    this.target = new Target( allMaterials, tandem.createTandem( 'target' ) );
    this.photonSource = new PhotonSource( {
      tandem: tandem.createTandem( 'photonSource' )
    } );
    this.wavelengthProperty = this.photonSource.wavelengthProperty;

    this.collector = new Collector( PhotoelectricEffectConstants.COLLECTOR_X );
    this.battery = new Battery( tandem.createTandem( 'battery' ) );

    this.currentProperty = new DerivedProperty(
      [
        this.battery.voltageProperty,
        this.photonSource.photonRateProperty,
        this.photonSource.wavelengthProperty,
        this.target.workFunctionProperty,
        this.target.bandDepthProperty
      ],
      ( voltage, photonsPerSecond, wavelength, workFunction, bandDepth ) => {
        return this.getCurrentForSystem( voltage, photonsPerSecond, wavelength, workFunction, bandDepth );
      },
      {
        tandem: tandem.createTandem( 'currentProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        units: 'A',
        phetioDocumentation: 'Analytic current in the circuit, in amps'
      }
    );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );

    this.showElectronsProperty = new BooleanProperty( true, {
      phetioFeatured: true,
      tandem: tandem.createTandem( 'showElectronsProperty' )
    } );

    this.showHighestEnergyOnlyProperty = new BooleanProperty( false, {
      phetioFeatured: true,
      tandem: tandem.createTandem( 'showHighestEnergyOnlyProperty' ),
      phetioDocumentation: 'Whether only highest-energy electron emissions are shown'
    } );

    // So that slow moving electrons from previous experiments do not persist and confuse the student.
    Multilink.lazyMultilinkAny( [
      this.showHighestEnergyOnlyProperty,
      this.target.materialProperty,
      this.target.workFunctionProperty,
      this.target.bandDepthProperty
    ], () => this.clearElectrons() );

    PhotoelectricEffectPreferences.photonModeProperty.lazyLink( () => {

      // The accumulator stores fractional photons in the previous emission mode's rate scale. Clear it so toggling
      // between intensity and photon-count modes starts the next discrete emission count from the new rate only.
      this.photonEmissionAccumulator = 0;
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.target.reset();
    this.battery.reset();
    this.photonSource.reset();
    this.isPlayingProperty.reset();
    this.showElectronsProperty.reset();
    this.showHighestEnergyOnlyProperty.reset();

    this.photons.length = 0;
    this.clearElectrons();
    this.photonEmissionAccumulator = 0;

    this.resetEmitter.emit();
  }

  /**
   * Steps the model during continuous play (animation frames). Does nothing when paused.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    if ( this.isPlayingProperty.value ) {
      this.stepModel( dt );
    }
  }

  /**
   * Advances the model by one time step, used by the step-forward button while paused.
   * @param dt - time step, in seconds
   */
  public stepForwardInTime( dt: number ): void {
    this.stepModel( dt );
  }

  /**
   * Single integration step for photon emission and particle motion.
   * @param dt - time step, in seconds
   */
  protected stepModel( dt: number ): void {
    let remainingDt = dt;

    while ( remainingDt > 0 ) {
      const subDt = Math.min( remainingDt, MAX_PARTICLE_DT );

      this.emitPhotons( subDt );
      this.stepPhotons( subDt );
      this.stepElectrons( subDt );

      remainingDt -= subDt;
    }
  }

  /**
   * Handles collisions between emitted electrons and the collector.
   * Returns true when the electron is absorbed by the collector.
   */
  protected handleElectronCollectorCollision( electron: Electron ): boolean {
    return this.collector.isHitByElectron( electron );
  }

  /**
   * Initial photon position for a point on the photon source line.
   *
   * @param offset - Signed distance, in model units, from PHOTON_SOURCE_POSITION along the source line. The source
   *   line is perpendicular to the beam direction, so offset = 0 emits from the center of the source, negative offsets
   *   emit from one side, and positive offsets emit from the other. Photon.TRAVEL_DIRECTION is the unit vector along
   *   that source line, so multiplying it by the scalar offset gives the displacement from PHOTON_SOURCE_POSITION.
   */
  protected getPhotonInitialPosition( offset: number ): Vector2 {
    return PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.plus(
      Photon.TRAVEL_DIRECTION.timesScalar( offset ) );
  }

  /**
   * Initial photon velocity for Energy screen fired photons.
   */
  protected getPhotonInitialVelocity(): Vector2 {
    return PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.timesScalar(
      PhotoelectricEffectConstants.PHOTON_SPEED );
  }

  /**
   * Emits new photons based on source intensity and elapsed time.
   */
  private emitPhotons( dt: number ): void {

    // photonRateProperty is the physical photon flux. Visible photons are a sampled subset: one drawn for
    // every PHYSICAL_PHOTONS_PER_VISIBLE_PHOTON physical photons.
    const physicalPhotonRate = this.photonSource.photonRateProperty.value;
    const visiblePhotonRate = physicalPhotonRate / PhotoelectricEffectConstants.PHYSICAL_PHOTONS_PER_VISIBLE_PHOTON;
    const totalPhotons = this.photonEmissionAccumulator + visiblePhotonRate * dt;
    const wholePhotons = Math.floor( totalPhotons );
    this.photonEmissionAccumulator = totalPhotons - wholePhotons;

    // We now have the number of photons from the intensity and rate, set up initial kinematic values and
    // create the photon.
    _.times( wholePhotons, () => {

      // Spread the origin randomly along the perpendicular line segment centered at PHOTON_SOURCE_POSITION.
      const offset = ( dotRandom.nextDouble() * 2 - 1 ) * PhotoelectricEffectConstants.PHOTON_SOURCE_LINE_HALF_LENGTH;

      // Calculate the initial position and velocity of the photon.
      let position = this.getPhotonInitialPosition( offset );
      const velocity = this.getPhotonInitialVelocity();

      // When photons are not shown (beam view), emit each photon right in front of the target so it collides on the
      // upcoming stepPhotons call. This removes the beam-travel delay so electron ejection responds immediately to
      // changes in wavelength or source output.
      if ( !PhotoelectricEffectPreferences.showPhotonsProperty.value ) {
        position = this.getBeamModeEmissionPosition( position, velocity, dt );
      }

      // Create an add photon to array.
      const photon = new Photon( position, velocity, new Vector2( 0, 0 ), this.photonSource.wavelengthProperty.value );
      this.photons.push( photon );
    } );
  }

  /**
   * Computes a beam-view emission position that places a photon one step before it crosses the target plate, so the
   * subsequent stepPhotons call lands it exactly on the target. Used when photons are not shown, so the target
   * responds to wavelength and source-output changes without the visible beam-travel delay.
   * @param position - the photon's source-line origin
   * @param velocity - the photon's velocity, in model units per second
   * @param dt - the time step that stepPhotons will use this frame, in seconds
   */
  private getBeamModeEmissionPosition( position: Vector2, velocity: Vector2, dt: number ): Vector2 {

    // Advance the photon to where its path crosses the target x.
    const targetCrossing = position.plus( velocity.timesScalar( this.getPhotonTimeToTarget( position, velocity ) ) );

    // Back up one step so the next stepPhotons advance lands the photon exactly on the target.
    return targetCrossing.minus( velocity.timesScalar( dt ) );
  }

  /**
   * Parametric time along the velocity at which a photon's path crosses the target x. Photon motion may be angled,
   * but target collision is defined by crossing the target's vertical x plane, so only the x displacement and x
   * velocity determine the collision time.
   * @param position - the photon's origin
   * @param velocity - the photon's velocity, in model units per second
   */
  protected getPhotonTimeToTarget( position: Vector2, velocity: Vector2 ): number {
    return ( this.target.x - position.x ) / velocity.x;
  }

  /**
   * Advances photons and handles collisions with the target.
   */
  protected stepPhotons( dt: number ): void {
    const nextPhotons: Photon[] = [];

    this.photons.forEach( photon => {

      // Advance photon kinematics first so collision checks use updated positions.
      photon.step( dt );

      // Check for target collisions, which may emit an electron and removes the photon from the beam.
      const hitTarget = this.target.isHitByPhoton( photon );
      if ( hitTarget ) {
        const electron = this.target.handlePhotonCollision(
          photon,
          this.showHighestEnergyOnlyProperty.value,
          PhotoelectricEffectPreferences.emitAllAbsorbedPhotonsProperty.value
        );
        if ( electron ) {
          this.electrons.push( electron );
        }
        this.photonCollidedEmitter.emit( photon, electron );
      }

      // Cull photons that have hit the target or passed it without a collision.
      const inBounds = photon.position.x > PhotoelectricEffectConstants.TARGET_X;
      if ( !hitTarget && inBounds ) {
        nextPhotons.push( photon );
      }
    } );

    // Replace the active list to reflect collisions and out-of-bounds pruning this step.
    // Note, if performance becomes an issue, consider in-place compaction.
    this.photons.length = 0;
    this.photons.push( ...nextPhotons );
  }

  /**
   * Advances electrons and handles collisions with the target or collector.
   */
  protected stepElectrons( dt: number ): void {
    const nextElectrons: Electron[] = [];
    const acceleration = this.getElectronAcceleration();

    this.electrons.forEach( electron => {

      // Update electron acceleration and advance kinematics for this time step.
      electron.setAcceleration( acceleration );
      electron.step( dt );

      // Check for target collisions; only electrons that avoid the target can reach the collector. If the electron
      // hits the target, we do not need to handle it because it is going to be removed.
      const hitTarget = this.target.isHitByElectron( electron );
      if ( !hitTarget ) {

        // Check whether the electron is absorbed by the collector (e.g. anode).
        const absorbed = this.handleElectronCollectorCollision( electron );

        // Cull electrons that leave the inter-plate region (bounced back past the target or past the collector).
        const inBounds = electron.position.x > PhotoelectricEffectConstants.TARGET_X &&
                         electron.position.x < PhotoelectricEffectConstants.COLLECTOR_X;

        // Keep only electrons that are neither absorbed nor out of bounds.
        if ( !absorbed && inBounds ) {
          nextElectrons.push( electron );
        }
      }
    } );

    // Replace the active list to reflect collisions, absorption, and bounds pruning this step.
    this.electrons.length = 0;
    this.electrons.push( ...nextElectrons );
  }

  /**
   * Computes the acceleration applied to electrons from the plate voltage.
   */
  private getElectronAcceleration(): Vector2 {
    const accelerationMagnitude = ( this.battery.voltageProperty.value *
                                    PhotoelectricEffectConstants.ELECTRON_ACCELERATION_SCALE ) /
                                  PhotoelectricEffectConstants.PLATE_SEPARATION;
    return new Vector2( accelerationMagnitude, 0 );
  }

  /**
   * Clears all electrons that have been created by the model.
   */
  private clearElectrons(): void {
    this.electrons.length = 0;
  }

  /**
   * Computes the analytic current for the voltage, with other variables from the current system.
   */
  public getCurrentForVoltage( voltage: number ): number {
    const photonsPerSecond = this.photonSource.photonRateProperty.value;
    const wavelength = this.photonSource.wavelengthProperty.value;
    const workFunction = this.target.workFunctionProperty.value;
    const bandDepth = this.target.bandDepthProperty.value;
    return this.getCurrentForSystem( voltage, photonsPerSecond, wavelength, workFunction, bandDepth );
  }

  /**
   * Get the analytic current for the provided normalized source output, with other variables from the current system.
   */
  public getCurrentForNormalizedOutput( normalizedOutput: number ): number {
    const voltage = this.battery.voltageProperty.value;
    const wavelength = this.photonSource.wavelengthProperty.value;
    const workFunction = this.target.workFunctionProperty.value;
    const bandDepth = this.target.bandDepthProperty.value;
    const photonsPerSecond = this.photonSource.getPhotonRateForNormalizedOutput( normalizedOutput );
    return this.getCurrentForSystem( voltage, photonsPerSecond, wavelength, workFunction, bandDepth );
  }

  /**
   * Computes the analytic current expected for the given conditions.
   */
  private getCurrentForSystem(
    voltage: number,
    photonsPerSecond: number,
    wavelength: number,
    workFunction: number,
    bandDepth: number
  ): number {

    // Compute how much photon energy exceeds the work function; this bounds emission likelihood.
    const photonEnergyBeyondWorkFunction = wavelengthToEnergy( wavelength ) - workFunction;

    // Convert excess energy into a fraction of photons that can liberate electrons (capped at 1).
    const electronRateAsFractionOfPhotonRate = Math.min(
      photonEnergyBeyondWorkFunction / bandDepth,
      1
    );
    const electronsPerSecondFromTarget = electronRateAsFractionOfPhotonRate * photonsPerSecond;

    // Retarding voltage reduces the fraction of emitted electrons that reach the anode.
    const retardingVoltage = voltage < 0 ? -voltage : 0;

    // The emitted (escaped) electrons have kinetic energies uniformly distributed over a band of depth
    // min( photonEnergyBeyondWorkFunction, bandDepth ): when the photon can access the whole band the spread is
    // bandDepth, and near threshold (photonEnergyBeyondWorkFunction < bandDepth) the spread is just the excess energy.
    // The retarding fraction must be normalized by THIS spread, not by bandDepth, otherwise the accessible-band
    // fraction (already applied in electronsPerSecondFromTarget) gets applied a second time.
    const emittedElectronEnergySpread = Math.min( photonEnergyBeyondWorkFunction, bandDepth );

    // Only electrons with enough energy to overcome the retarding voltage contribute to current.
    const fractionMoreEnergeticThanRetardingVoltage = emittedElectronEnergySpread > 0 ? Math.max(
      0,
      Math.min( ( photonEnergyBeyondWorkFunction - retardingVoltage ) /
                emittedElectronEnergySpread, 1 )
    ) : 0;

    const electronsPerSecondToAnode = electronsPerSecondFromTarget * fractionMoreEnergeticThanRetardingVoltage;

    // Quantum efficiency (η) scales the ejection probability uniformly; keeps the analytical current consistent
    // with the per-photon emission path, which applies the same factor.
    const physicalElectronsPerSecond =
      electronsPerSecondToAnode * PhotoelectricEffectConstants.QUANTUM_EFFICIENCY;

    // I = e · N_electrons_physical · η · accessibleBandFraction · fractionReachingCollector (spec §10.3). The
    // photon rate fed into this calculation is already the physical flux, so no further magnification is needed.
    return physicalElectronsPerSecond * PhotoelectricEffectConstants.ELEMENTARY_CHARGE;
  }

  // Aggregate state for transient particles. ReferenceArrayIO mutates the existing arrays during restore so views that
  // hold references to model.photons/model.electrons continue to observe the restored particles.
  private static readonly PHOTONS_IO = ReferenceArrayIO( Photon.PhotonIO );
  private static readonly ELECTRONS_IO = ReferenceArrayIO( Electron.ElectronIO );

  /**
   * PhET-iO state schema.
   */
  protected static readonly PHOTOELECTRIC_EFFECT_MODEL_STATE_SCHEMA = {
    photons: PhotoelectricEffectModel.PHOTONS_IO,
    electrons: PhotoelectricEffectModel.ELECTRONS_IO,
    photonEmissionAccumulator: NumberIO
  };

  /**
   * Serializes active photons, electrons, and fractional photon emission accumulator for PhET-iO.
   */
  protected toStateObject(): PhotoelectricEffectModelStateObject {
    return {
      photons: PhotoelectricEffectModel.PHOTONS_IO.toStateObject( this.photons ),
      electrons: PhotoelectricEffectModel.ELECTRONS_IO.toStateObject( this.electrons ),
      photonEmissionAccumulator: this.photonEmissionAccumulator
    };
  }

  /**
   * Restores transient particles and the photon emission accumulator from PhET-iO state.
   */
  protected applyState( stateObject: PhotoelectricEffectModelStateObject ): void {
    PhotoelectricEffectModel.PHOTONS_IO.applyState( this.photons, stateObject.photons );
    PhotoelectricEffectModel.ELECTRONS_IO.applyState( this.electrons, stateObject.electrons );
    this.photonEmissionAccumulator = stateObject.photonEmissionAccumulator;
  }

  /**
   * PhET-iO IOType for the photoelectric-effect model.
   */
  public static readonly PhotoelectricEffectModelIO = new IOType<PhotoelectricEffectModel, PhotoelectricEffectModelStateObject>(
    'PhotoelectricEffectModelIO', {
      valueType: PhotoelectricEffectModel,
      stateSchema: PhotoelectricEffectModel.PHOTOELECTRIC_EFFECT_MODEL_STATE_SCHEMA,
      toStateObject: model => model.toStateObject(),
      applyState: ( model, stateObject ) => model.applyState( stateObject )
    } );
}
