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
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TModel from '../../../../joist/js/TModel.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import Battery from './Battery.js';
import Electron from './Electron.js';
import Material, { MaterialType } from './Material.js';
import { intensityToPhotonRate, wavelengthToEnergy } from './PhotoelectricEffectUtils.js';
import Photon from './Photon.js';
import PhotonSource from './PhotonSource.js';
import Collector from './Collector.js';
import Target from './Target.js';

type SelfOptions = {

  // TODO add options that are specific to PhotoelectricEffectModel here
};

export type PhotoelectricEffectModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotoelectricEffectModel implements TModel {

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
  // TODO: Should we move this into ExperimentModel?
  public readonly battery: Battery;

  // Photon source that emits toward the target.
  public readonly photonSource: PhotonSource;

  // Voltage across the plates in model units.
  // TODO: Should we move this into ExperimentModel?
  public readonly voltageProperty: NumberProperty;

  // Wavelength of emitted photons in nanometers.
  public readonly wavelengthProperty: NumberProperty;

  // Derived analytic current based on model settings.
  public readonly currentProperty: TReadOnlyProperty<number>;

  // When false, continuous time stepping is paused; the step-forward control advances the model.
  public readonly isPlayingProperty: BooleanProperty;

  // Controls whether emitted electrons are rendered in the particle canvas.
  public readonly showElectronsProperty: BooleanProperty;

  // When true, use Java-style simple mode so only highest-band collisions emit electrons.
  public readonly showHighestEnergyOnlyProperty: BooleanProperty;

  // Emits when the model has been reset to its default state.
  public readonly resetEmitter = new Emitter();

  // Accumulates fractional photon emissions between steps.
  // Physics-wise, the light intensity defines a continuous photon flux (photons/second), while the model
  // emits discrete photons each step. The accumulator carries the fractional remainder so the time-integrated
  // photon count matches the continuous flux and does not drift with the chosen time step.
  private photonEmissionAccumulator = 0;

  /**
   * Creates the model and configures materials, sources, and derived current.
   * @param mysteryMaterials - mystery materials owned by PhotoelectricEffectPreferencesModel and passed down.
   *   One entry for the user-configurable mystery material; additional entries can be added in the future
   *   for PhET-iO clients to manipulate.
   * @param providedOptions
   */
  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {

    const options = optionize<PhotoelectricEffectModelOptions, SelfOptions, PhetioObjectOptions>()( {}, providedOptions );

    const standardMaterials = [
      new Material( MaterialType.SODIUM, { tandem: options.tandem } ),
      new Material( MaterialType.COPPER, { tandem: options.tandem } ),
      new Material( MaterialType.CALCIUM, { tandem: options.tandem } ),
      new Material( MaterialType.MAGNESIUM, { tandem: options.tandem } ),
      new Material( MaterialType.PLATINUM, { tandem: options.tandem } ),
      new Material( MaterialType.ZINC, { tandem: options.tandem } ),
      new Material( MaterialType.CUSTOM, { tandem: options.tandem } )
    ];

    const allMaterials = [
      ...standardMaterials,
      ...mysteryMaterials
    ];

    this.target = new Target( allMaterials, providedOptions.tandem.createTandem( 'target' ) );
    this.photonSource = new PhotonSource( {
      tandem: providedOptions.tandem.createTandem( 'photonSource' )
    } );

    this.voltageProperty = new NumberProperty( 0, {
      range: new Range( PhotoelectricEffectConstants.MIN_VOLTAGE,
        PhotoelectricEffectConstants.MAX_VOLTAGE )
    } );
    this.wavelengthProperty = this.photonSource.wavelengthProperty;

    this.collector = new Collector( PhotoelectricEffectConstants.COLLECTOR_X, providedOptions.tandem.createTandem( 'collector' ) );
    this.battery = new Battery( providedOptions.tandem );

    this.currentProperty = new DerivedProperty(
      [
        this.voltageProperty,
        this.photonSource.intensityProperty,
        this.photonSource.wavelengthProperty,
        this.target.workFunctionProperty
      ],
      ( voltage, intensity, wavelength, workFunction ) => {
        return this.getCurrentForSystem( voltage, intensity, wavelength, workFunction );
      }
    );

    this.isPlayingProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'isPlayingProperty' ),
      phetioFeatured: true
    } );

    this.showElectronsProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'showElectronsProperty' )
    } );

    this.showHighestEnergyOnlyProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'showHighestEnergyOnlyProperty' )
    } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.target.reset();
    this.battery.reset();
    this.photonSource.reset();
    this.voltageProperty.reset();
    this.isPlayingProperty.reset();
    this.showElectronsProperty.reset();
    this.showHighestEnergyOnlyProperty.reset();

    this.photons.length = 0;
    this.electrons.length = 0;
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
  private stepModel( dt: number ): void {
    if ( dt > 0 ) {
      this.emitPhotons( dt );
      this.stepPhotons( dt );
      this.stepElectrons( dt );
    }
  }

  /**
   * Handles collisions between emitted electrons and the collector.
   * Returns true when the electron is absorbed by the collector.
   */
  protected handleElectronCollectorCollision( electron: Electron ): boolean {
    const absorbed = this.collector.isHitByElectron( electron );
    if ( absorbed ) {
      console.log( 'HIT DETECTED!' );
    }
    return absorbed;
  }

  /**
   * Emits new photons based on source intensity and elapsed time.
   */
  private emitPhotons( dt: number ): void {
    const photonRate = intensityToPhotonRate(
      this.photonSource.intensityProperty.value,
      this.photonSource.wavelengthProperty.value
    );
    const totalPhotons = this.photonEmissionAccumulator + photonRate * dt;
    const wholePhotons = Math.floor( totalPhotons );
    this.photonEmissionAccumulator = totalPhotons - wholePhotons;

    // We now have the number of photons from the intensity and rate, set up initial kinematic values and
    // create the photon.
    _.times( wholePhotons, () => {

      // Spread the origin randomly along the perpendicular line segment centered at PHOTON_SOURCE_POSITION.
      const offset = ( dotRandom.nextDouble() * 2 - 1 ) * PhotoelectricEffectConstants.PHOTON_SOURCE_LINE_HALF_LENGTH;

      // Calculate the initial position and velocity of the photon.
      const position = PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.plus( Photon.TRAVEL_DIRECTION.timesScalar( offset ) );
      const velocity = PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.timesScalar( PhotoelectricEffectConstants.PHOTON_SPEED );

      // Create an add photon to array.
      const photon = new Photon( position, velocity, new Vector2( 0, 0 ), this.photonSource.wavelengthProperty.value );
      this.photons.push( photon );
    } );
  }

  /**
   * Advances photons and handles collisions with the target.
   */
  private stepPhotons( dt: number ): void {
    const nextPhotons: Photon[] = [];

    this.photons.forEach( photon => {

      // Advance photon kinematics first so collision checks use updated positions.
      photon.step( dt );

      // Check for target collisions, which may emit an electron and removes the photon from the beam.
      const hitTarget = this.target.isHitByPhoton( photon );
      if ( hitTarget ) {
        const electron = this.target.handlePhotonCollision( photon, this.showHighestEnergyOnlyProperty.value );
        if ( electron ) {
          this.electrons.push( electron );
        }
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
  private stepElectrons( dt: number ): void {
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
    const accelerationMagnitude = ( this.voltageProperty.value *
                                    PhotoelectricEffectConstants.ELECTRON_ACCELERATION_SCALE ) /
                                  PhotoelectricEffectConstants.PLATE_SEPARATION;
    return new Vector2( accelerationMagnitude, 0 );
  }

  /**
   * Computes the analytic current for the voltage, with other variables from the current system.
   */
  public getCurrentForVoltage( voltage: number ): number {
    const intensity = this.photonSource.intensityProperty.value;
    const wavelength = this.photonSource.wavelengthProperty.value;
    const workFunction = this.target.workFunctionProperty.value;
    return this.getCurrentForSystem( voltage, intensity, wavelength, workFunction );
  }

  /**
   * Get the analytic current for the provided intensity, with other variables from the current system.
   * @param intensity
   */
  public getCurrentForIntensity( intensity: number ): number {
    const voltage = this.voltageProperty.value;
    const wavelength = this.photonSource.wavelengthProperty.value;
    const workFunction = this.target.workFunctionProperty.value;
    return this.getCurrentForSystem( voltage, intensity, wavelength, workFunction );
  }

  /**
   * Computes the analytic current expected for the given conditions.
   */
  private getCurrentForSystem( voltage: number, intensity: number, wavelength: number, workFunction: number ): number {
    const photonsPerSecond = intensityToPhotonRate( intensity, wavelength );

    // Compute how much photon energy exceeds the work function; this bounds emission likelihood.
    const photonEnergyBeyondWorkFunction = wavelengthToEnergy( wavelength ) - workFunction;

    // Convert excess energy into a fraction of photons that can liberate electrons (capped at 1).
    const electronRateAsFractionOfPhotonRate = Math.min(
      photonEnergyBeyondWorkFunction / Material.TOTAL_ENERGY_DEPTH,
      1
    );
    const electronsPerSecondFromTarget = electronRateAsFractionOfPhotonRate * photonsPerSecond;

    // Retarding voltage reduces the fraction of emitted electrons that reach the anode.
    const retardingVoltage = voltage < 0 ? -voltage : 0;

    // Only electrons with enough energy to overcome the retarding voltage contribute to current.
    const fractionMoreEnergeticThanRetardingVoltage = Math.max(
      0,
      Math.min( ( photonEnergyBeyondWorkFunction - retardingVoltage ) /
                Material.TOTAL_ENERGY_DEPTH, 1 )
    );

    let electronsPerSecondToAnode = electronsPerSecondFromTarget * fractionMoreEnergeticThanRetardingVoltage;

    // Implementation choice: treat sub-1 counts as zero to avoid tiny non-physical current readouts.
    if ( electronsPerSecondToAnode < 1 ) {
      electronsPerSecondToAnode = 0;
    }

    // "Jimmy factor" scales model output to match the sim's calibrated current display.
    return electronsPerSecondToAnode * PhotoelectricEffectConstants.CURRENT_JIMMY_FACTOR;
  }
}
