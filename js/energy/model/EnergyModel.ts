// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Energy screen of the photoelectric effect simulation.
 * Adds Energy-specific state to the shared photoelectric effect model.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions, type PhotoelectricEffectModelStateObject } from '../../common/model/PhotoelectricEffectModel.js';
import Photon from '../../common/model/Photon.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphData from './EnergyGraphData.js';
import EnergyGraphDisplayProperties from './EnergyGraphDisplayProperties.js';

type SelfOptions = EmptySelfOptions;
type EnergyModelOptions = SelfOptions & WithRequired<PhotoelectricEffectModelOptions, 'tandem'>;

type QueuedPhotonEmission = {
  slotIndex: number;
  remainingTime: number;
};

// PhET-iO serialized state for the Energy model.
type EnergyModelStateObject = PhotoelectricEffectModelStateObject & {
  photonSampleIndices: ( number | null )[];
  queuedPhotonEmissions: QueuedPhotonEmission[];
};

export default class EnergyModel extends PhotoelectricEffectModel {

  // Energy graph sample slot offsets along the photon source line.
  private static readonly LENS_OFFSETS = [
    -PhotoelectricEffectConstants.PHOTON_SOURCE_LINE_HALF_LENGTH,
    0,
    PhotoelectricEffectConstants.PHOTON_SOURCE_LINE_HALF_LENGTH
  ];

  /**
   * PhET-iO IOType for delayed burst-mode photon emissions.
   */
  private static readonly QUEUED_PHOTON_EMISSION_IO = new IOType<QueuedPhotonEmission, QueuedPhotonEmission>(
    'QueuedPhotonEmissionIO', {
      valueType: Object,
      stateSchema: {
        slotIndex: NumberIO,
        remainingTime: NumberIO
      },
      toStateObject: queuedPhotonEmission => ( {
        slotIndex: queuedPhotonEmission.slotIndex,
        remainingTime: queuedPhotonEmission.remainingTime
      } ),
      fromStateObject: stateObject => ( {
        slotIndex: stateObject.slotIndex,
        remainingTime: stateObject.remainingTime
      } )
    } );

  public readonly emitSinglePhotonProperty: Property<boolean>;

  // Whether photons fired from the Energy screen are still traveling toward the target.
  public readonly photonsTravelingProperty: BooleanProperty;

  // Properties that control Energy screen graph mode and diagram visibility.
  public readonly energyGraphDisplayProperties: EnergyGraphDisplayProperties;

  // Recorded sample data shown by the Energy screen graph displays.
  public readonly energyGraphData: EnergyGraphData;

  // Index of the sample slot a single-photon fire writes into; advances 0->1->2->0 on each single-photon fire.
  // In multi-photon mode the three lenses fire into slots 0, 1, and 2 directly, and this Property is unused.
  public readonly currentSlotIndexProperty: NumberProperty;

  // Emits an event when a photon should be created.
  public readonly firePhotonEmitter: Emitter;

  // Tracks which sample slot each in-flight fired photon corresponds to, so its collision can be recorded
  // into the matching slot. Uses a WeakMap so entries clear when photons are released by this.photons.
  private readonly photonToSampleIndexMap = new WeakMap<Photon, number>();

  // Delayed burst-mode photon emissions. Each entry counts down in model time until its photon should be fired.
  private readonly queuedPhotonEmissions: QueuedPhotonEmission[] = [];

  public constructor( mysteryMaterials: Material[], providedOptions: EnergyModelOptions ) {
    const options = optionize<EnergyModelOptions, SelfOptions, PhotoelectricEffectModelOptions>()( {
      phetioType: EnergyModel.EnergyModelIO
    }, providedOptions );

    super(
      mysteryMaterials,
      tandem => [ new Material( MaterialType.CUSTOM, { tandem: tandem.createTandem( 'custom' ) } ) ],
      options
    );

    this.energyGraphData = new EnergyGraphData( {
      tandem: options.tandem.createTandem( 'energyGraphData' ),
      phetioDocumentation: 'Recorded sample data shown by the Energy screen graph displays'
    } );

    this.emitSinglePhotonProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'emitSinglePhotonProperty' )
    } );

    this.photonsTravelingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'photonsTravelingProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Whether photons fired from the Energy screen are still traveling toward the target'
    } );

    this.energyGraphDisplayProperties = new EnergyGraphDisplayProperties(
      options.tandem.createTandem( 'energyGraphDisplayProperties' )
    );

    this.currentSlotIndexProperty = new NumberProperty( 0, {
      tandem: options.tandem.createTandem( 'currentSlotIndexProperty' ),
      numberType: 'Integer',
      range: new Range( 0, EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES - 1 ),
      phetioReadOnly: true,
      phetioDocumentation: 'Sample slot index a single-photon fire writes into; advances after each single-photon fire'
    } );

    this.firePhotonEmitter = new Emitter( {
      tandem: options.tandem.createTandem( 'firePhotonEmitter' )
    } );

    this.firePhotonEmitter.addListener( () => {
      affirm( !this.photonsTravelingProperty.value, 'Cannot fire photons while previous photons are still traveling' );

      if ( this.emitSinglePhotonProperty.value ) {
        const slotIndex = this.currentSlotIndexProperty.value;
        this.energyGraphData.samples[ slotIndex ].clear();
        this.firePhoton( slotIndex );

        this.currentSlotIndexProperty.value =
          ( slotIndex + 1 ) % EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES;
      }
      else {
        this.energyGraphData.clear();
        this.queueBurstPhotons();
      }

      this.updatePhotonsTravelingProperty();
    } );

    // Record sample data when a fired photon collides with the target.
    this.photonCollidedEmitter.addListener( ( photon, electron ) => {
      const slotIndex = this.photonToSampleIndexMap.get( photon );
      affirm( slotIndex !== undefined, 'Collided photon should have an associated sample slot index' );

// TODO (SESSION): There is something wrong with how e report potential energy for the diagrams on the energy screen. See https://github.com/phetsims/photoelectric-effect/issues/92
//
// ```
//       const potentialEnergy = -this.target.workFunctionProperty.value;
//       const photonEnergy = photon.getEnergy();
//       const kineticEnergy = electron ? electron.energy : 0;
// ```
//
// So we are reporting that the potential energy is always at the work function (fermi level). To support the energy graphs, we will need to change how we are reporting sampled energies from photon collisions.
//
// Here is a plan that I think will work:
//
// <details>
//
//
// 1. Refactor `Material` energy helpers so they sample/return binding energy instead of final kinetic energy.
//    - Full-band path samples from `[workFunction, workFunction + bandWidth]`.
//    - Guaranteed-emission path samples from `[workFunction, min(photonEnergy, workFunction + bandWidth)]`.
//
// 2. Add a `PhotonCollisionOutcome` type, likely:
//    - `electronEmitted`
//    - `photonEnergyInsufficient`
//    - `quantumMechanicallyForbidden`
//
// 3. Change `Target.handlePhotonCollision` to return a structured collision result instead of `Electron | null`:
//
// ```ts
// {
//   photonEnergy: number;
//   bindingEnergy: number | null;
//   potentialEnergy: number | null; // graph value, probably -bindingEnergy
//   kineticEnergy: number;
//   outcome: PhotonCollisionOutcome;
//   electron: Electron | null;
// }
// ```
//
// 4. Keep collision metadata off `Electron`.
//    - `Electron` should continue to represent the emitted moving particle.
//    - Collision outcome/binding energy belong to the photon-target interaction, including no-electron cases.
//
// 5. Update `Target.handlePhotonCollision` to classify outcomes explicitly.
//    - Quantum-efficiency rejection becomes `quantumMechanicallyForbidden`.
//    - Sampled/selected state with insufficient energy becomes `photonEnergyInsufficient`.
//    - Positive kinetic energy creates an `Electron` and becomes `electronEmitted`.
//
// 6. Update `PhotoelectricEffectModel.stepPhotons`.
//    - Add `collisionResult.electron` to `this.electrons` when present.
//    - Emit the full collision result through `photonCollidedEmitter`.
//
// 7. Update `EnergyModel` to record graph samples from the collision result.
//    - Stop hard-coding `potentialEnergy = -workFunction`.
//    - Use `collisionResult.potentialEnergy` when available.
//    - Record `outcome` with each sample.
//
// 8. Update `EnergyGraphSample` / `EnergyGraphData`.
//    - Store `outcome` in addition to existing energy values.
//    - Keep sample slots persistent as they are now.
//
// 9. Update the energy bar graph.
//    - Stop using `kineticEnergy === 0` to infer “no electron ejected.”
//    - Show the “photon energy insufficient” message only for the insufficient-energy absorbed outcome.
//    - Do not show that message for quantum-mechanically forbidden/no-interaction outcomes.
//
// 10. Update the energy diagram.
//    - Show photon/electron energy icons for emitted and insufficient-energy absorbed outcomes.
//    - Hide icons for quantum-mechanically forbidden/no-interaction outcomes.
//
// 11. Add focused tests or spot checks for the three outcomes.
//    - Emitted electron records sampled potential energy within the occupied band.
//    - Insufficient-energy event records an absorbed/no-ejection outcome and remains visible in the diagram.
//    - Quantum-forbidden event records no-interaction outcome and hides diagram icons.

      const potentialEnergy = -this.target.workFunctionProperty.value;
      const photonEnergy = photon.getEnergy();
      const kineticEnergy = electron ? electron.energy : 0;
      this.energyGraphData.setSampleData( slotIndex, potentialEnergy, photonEnergy, kineticEnergy );
      this.photonToSampleIndexMap.delete( photon );
    } );
  }

  /**
   * Model animation for photons and electrons. Instead of creating a stream of photons, this model
   * creates any photons that were requested by a "burst" fire from the user.
   * @param dt - time step, in seconds
   */
  protected override stepModel( dt: number ): void {
    if ( dt > 0 ) {
      this.stepQueuedPhotonEmissions( dt );
      this.stepPhotons( dt );
      this.updatePhotonsTravelingProperty();
      this.stepElectrons( dt );
    }
  }

  /**
   * Fires a photon from the lens corresponding to the given sample slot index.
   */
  private firePhoton( slotIndex: number ): void {
    const position = this.getPhotonInitialPosition( EnergyModel.LENS_OFFSETS[ slotIndex ] );
    const velocity = this.getPhotonInitialVelocity();

    const photon = new Photon( position, velocity, new Vector2( 0, 0 ), this.photonSource.wavelengthProperty.value );
    this.photons.push( photon );
    this.photonToSampleIndexMap.set( photon, slotIndex );
  }

  /**
   * Queues burst-mode photons so all slots reach the target at approximately the same time. The furthest photon has
   * no delay, and closer photons fire later by the difference in travel time.
   *
   * This intentionally emits queued photons only at frame boundaries. If we need tighter synchronization later, this
   * can be upgraded by splitting stepModel at each queued emission time so photons begin moving at the exact sub-frame
   * time instead of the next frame boundary.
   */
  private queueBurstPhotons(): void {
    const photonSchedules = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, slotIndex => ( {
      slotIndex: slotIndex,
      timeToTarget: this.getPhotonTimeToTarget(
        this.getPhotonInitialPosition( EnergyModel.LENS_OFFSETS[ slotIndex ] ),
        this.getPhotonInitialVelocity()
      )
    } ) );

    let maxTimeToTarget = 0;
    photonSchedules.forEach( photonSchedule => {
      maxTimeToTarget = Math.max( maxTimeToTarget, photonSchedule.timeToTarget );
    } );

    photonSchedules.forEach( photonSchedule => {
      this.queuedPhotonEmissions.push( {
        slotIndex: photonSchedule.slotIndex,
        remainingTime: maxTimeToTarget - photonSchedule.timeToTarget
      } );
    } );
  }

  /**
   * Advances delayed burst emissions by one frame. Photons are created before active photons step so they can
   * move during this frame, matching the simple frame-boundary scheduling described in queueBurstPhotons.
   */
  private stepQueuedPhotonEmissions( dt: number ): void {

    // Build the next queue instead of mutating queuedPhotonEmissions while iterating over it.
    const nextQueuedPhotonEmissions: QueuedPhotonEmission[] = [];

    this.queuedPhotonEmissions.forEach( queuedPhotonEmission => {
      const remainingTime = queuedPhotonEmission.remainingTime - dt;
      if ( remainingTime <= 0 ) {
        this.firePhoton( queuedPhotonEmission.slotIndex );
      }
      else {
        nextQueuedPhotonEmissions.push( {
          slotIndex: queuedPhotonEmission.slotIndex,
          remainingTime: remainingTime
        } );
      }
    } );

    this.queuedPhotonEmissions.length = 0;
    this.queuedPhotonEmissions.push( ...nextQueuedPhotonEmissions );
  }

  /**
   * Resets Energy-specific state in addition to the inherited photoelectric effect state.
   */
  public override reset(): void {
    super.reset();

    this.photonsTravelingProperty.reset();
    this.queuedPhotonEmissions.length = 0;
    this.energyGraphData.clear();
    this.energyGraphDisplayProperties.reset();
    this.currentSlotIndexProperty.reset();
  }

  /**
   * Serializes Energy-screen state that is not already handled by Properties or the base particle state.
   */
  protected override toStateObject(): EnergyModelStateObject {
    return Object.assign( super.toStateObject(), {
      photonSampleIndices: this.photons.map( photon => this.photonToSampleIndexMap.get( photon ) ?? null ),
      queuedPhotonEmissions: this.queuedPhotonEmissions.map( queuedPhotonEmission =>
        EnergyModel.QUEUED_PHOTON_EMISSION_IO.toStateObject( queuedPhotonEmission ) )
    } );
  }

  /**
   * Restores Energy-screen firing state, rebuilding the runtime WeakMap for photon -> sample index.
   */
  protected override applyState( stateObject: EnergyModelStateObject ): void {
    super.applyState( stateObject );

    stateObject.photonSampleIndices.forEach( ( sampleIndex, photonIndex ) => {
      if ( sampleIndex !== null ) {
        this.photonToSampleIndexMap.set( this.photons[ photonIndex ], sampleIndex );
      }
      else {
        this.photonToSampleIndexMap.delete( this.photons[ photonIndex ] );
      }
    } );

    this.queuedPhotonEmissions.length = 0;
    stateObject.queuedPhotonEmissions.forEach( stateObj =>
      this.queuedPhotonEmissions.push( EnergyModel.QUEUED_PHOTON_EMISSION_IO.fromStateObject( stateObj ) ) );

    this.updatePhotonsTravelingProperty();
  }

  /**
   * Updates whether a fired Energy sequence is still active. This must be called after stepPhotons, because
   * photonCollidedEmitter fires before the active photon array has been compacted for the frame.
   */
  private updatePhotonsTravelingProperty(): void {
    this.photonsTravelingProperty.value = this.photons.length > 0 || this.queuedPhotonEmissions.length > 0;
  }

  /**
   * PhET-iO state schema.
   */
  private static readonly ENERGY_MODEL_STATE_SCHEMA = Object.assign(
    {},
    EnergyModel.PHOTOELECTRIC_EFFECT_MODEL_STATE_SCHEMA, {
      photonSampleIndices: ArrayIO( NullableIO( NumberIO ) ),
      queuedPhotonEmissions: ArrayIO( EnergyModel.QUEUED_PHOTON_EMISSION_IO )
    } );

  /**
   * PhET-iO IOType for the Energy model.
   */
  public static readonly EnergyModelIO = new IOType<EnergyModel, EnergyModelStateObject>( 'EnergyModelIO', {
    valueType: EnergyModel,
    stateSchema: EnergyModel.ENERGY_MODEL_STATE_SCHEMA,
    toStateObject: model => model.toStateObject(),
    applyState: ( model, stateObject ) => model.applyState( stateObject )
  } );
}
