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
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import Photon from '../../common/model/Photon.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphData from './EnergyGraphData.js';
import EnergyGraphDisplayProperties from './EnergyGraphDisplayProperties.js';

export default class EnergyModel extends PhotoelectricEffectModel {
  public readonly emitSinglePhotonProperty: Property<boolean>;

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
    super(
      mysteryMaterials,
      tandem => [ new Material( MaterialType.CUSTOM, { tandem: tandem.createTandem( 'custom' ) } ) ],
      providedOptions
    );

    this.energyGraphData = new EnergyGraphData( {
      tandem: providedOptions.tandem.createTandem( 'energyGraphData' ),
      phetioDocumentation: 'Recorded sample data shown by the Energy screen graph displays'
    } );

    this.emitSinglePhotonProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'emitSinglePhotonProperty' )
    } );

    this.energyGraphDisplayProperties = new EnergyGraphDisplayProperties(
      providedOptions.tandem.createTandem( 'energyGraphDisplayProperties' )
    );

    this.currentSlotIndexProperty = new NumberProperty( 0, {
      tandem: providedOptions.tandem.createTandem( 'currentSlotIndexProperty' ),
      numberType: 'Integer',
      range: new Range( 0, EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES - 1 ),
      phetioReadOnly: true,
      phetioDocumentation: 'Sample slot index a single-photon fire writes into; advances after each single-photon fire'
    } );

    this.firePhotonEmitter = new Emitter( {
      tandem: providedOptions.tandem.createTandem( 'firePhotonEmitter' )
    } );

    this.firePhotonEmitter.addListener( () => {
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

    this.energyGraphData.clear();
    this.energyGraphDisplayProperties.reset();
    this.currentSlotIndexProperty.reset();
  }
}
