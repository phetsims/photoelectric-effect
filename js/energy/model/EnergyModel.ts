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
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions, PhotoelectricEffectModelStateObject } from '../../common/model/PhotoelectricEffectModel.js';
import Photon from '../../common/model/Photon.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphData from './EnergyGraphData.js';
import EnergyGraphDisplayProperties from './EnergyGraphDisplayProperties.js';

type SelfOptions = EmptySelfOptions;
type EnergyModelOptions = SelfOptions & WithRequired<PhotoelectricEffectModelOptions, 'tandem'>;

// PhET-iO serialized state for the Energy model.
type EnergyModelStateObject = PhotoelectricEffectModelStateObject & {
  photonSampleIndices: ( number | null )[];
};

export default class EnergyModel extends PhotoelectricEffectModel {
  public readonly emitSinglePhotonProperty: Property<boolean>;

  // Whether photons fired from the Energy screen are still travelling toward the target.
  public readonly photonsTravellingProperty: BooleanProperty;

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

  public constructor( mysteryMaterials: Material[], providedOptions: WithRequired<PhotoelectricEffectModelOptions, 'tandem'> ) {

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

    this.photonsTravellingProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'photonsTravellingProperty' ),
      phetioReadOnly: true,
      phetioDocumentation: 'Whether photons fired from the Energy screen are still travelling toward the target'
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
      affirm( !this.photonsTravellingProperty.value, 'Cannot fire photons while previous photons are still travelling' );
      this.photonsTravellingProperty.value = true;

      if ( this.emitSinglePhotonProperty.value ) {
        const slotIndex = this.currentSlotIndexProperty.value;
        this.energyGraphData.samples[ slotIndex ].clear();
        this.firePhoton( slotIndex );

        this.currentSlotIndexProperty.value =
          ( slotIndex + 1 ) % EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES;
      }
      else {
        this.energyGraphData.clear();
        _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, slotIndex => this.firePhoton( slotIndex ) );
      }
    } );

    // Record sample data when a fired photon collides with the target.
    this.photonCollidedEmitter.addListener( ( photon, electron ) => {
      const slotIndex = this.photonToSampleIndexMap.get( photon );
      affirm( slotIndex !== undefined, 'Collided photon should have an associated sample slot index' );

      const potentialEnergy = -this.target.workFunctionProperty.value;
      const photonEnergy = photon.getEnergy();
      const kineticEnergy = electron ? electron.energy : 0;
      this.energyGraphData.setSampleData( slotIndex, potentialEnergy, photonEnergy, kineticEnergy );
      this.photonToSampleIndexMap.delete( photon );

      this.photonsTravellingProperty.value = false;
    } );
  }

  /**
   * Model animation for photons and electrons. This class does not create
   * photons during animation like the base class.
   * @param dt - time step, in seconds
   */
  protected override stepModel( dt: number ): void {
    if ( dt > 0 ) {
      this.stepPhotons( dt );
      this.stepElectrons( dt );
    }
  }

  /**
   * Fires a photon from the lens corresponding to the given sample slot index.
   *
   * TODO: Sequence multiple photons so that when multiple fire, they all hit the target at the same time.
   */
  private firePhoton( slotIndex: number ): void {
    const lensOffsets = [
      -PhotoelectricEffectConstants.PHOTON_SOURCE_LINE_HALF_LENGTH,
      0,
      PhotoelectricEffectConstants.PHOTON_SOURCE_LINE_HALF_LENGTH
    ];

    const position = PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.plus(
      Photon.TRAVEL_DIRECTION.timesScalar( lensOffsets[ slotIndex ] ) );
    const velocity = PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.timesScalar(
      PhotoelectricEffectConstants.PHOTON_SPEED );

    const photon = new Photon( position, velocity, new Vector2( 0, 0 ), this.photonSource.wavelengthProperty.value );
    this.photons.push( photon );
    this.photonToSampleIndexMap.set( photon, slotIndex );
  }

  /**
   * Resets Energy-specific state in addition to the inherited photoelectric effect state.
   */
  public override reset(): void {
    super.reset();

    this.photonsTravellingProperty.reset();
    this.energyGraphData.clear();
    this.energyGraphDisplayProperties.reset();
    this.currentSlotIndexProperty.reset();
  }

  /**
   * Serializes Energy-screen state that is not already handled by Properties or the base particle state.
   */
  protected override toStateObject(): EnergyModelStateObject {
    return Object.assign( super.toStateObject(), {
      photonSampleIndices: this.photons.map( photon => this.photonToSampleIndexMap.get( photon ) ?? null )
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
    } );
  }

  /**
   * PhET-iO state schema.
   */
  private static readonly ENERGY_MODEL_STATE_SCHEMA = Object.assign( {}, EnergyModel.PHOTOELECTRIC_EFFECT_MODEL_STATE_SCHEMA, {
    photonSampleIndices: ArrayIO( NullableIO( NumberIO ) )
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
