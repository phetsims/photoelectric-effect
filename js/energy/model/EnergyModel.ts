// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Energy screen of the photoelectric effect simulation.
 * Adds Energy-specific state to the shared photoelectric effect model.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import Property from '../../../../axon/js/Property.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Material from '../../common/model/Material.js';
import { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import Photon from '../../common/model/Photon.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import IntroModel from '../../intro/model/IntroModel.js';
import EnergyGraphData from './EnergyGraphData.js';
import EnergyGraphDisplayProperties from './EnergyGraphDisplayProperties.js';

export default class EnergyModel extends IntroModel {
  public readonly emitSinglePhotonProperty: Property<boolean>;

  // Properties that control Energy screen graph mode and diagram visibility.
  public readonly energyGraphDisplayProperties: EnergyGraphDisplayProperties;

  // Recorded sample data shown by the Energy screen graph displays.
  public readonly energyGraphData: EnergyGraphData;

  // Emits an event when a photon should be created.
  public readonly firePhotonEmitter: Emitter;

  public constructor( mysteryMaterials: Material[], providedOptions: WithRequired<PhotoelectricEffectModelOptions, 'tandem'> ) {
    super( mysteryMaterials, providedOptions );

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

    this.firePhotonEmitter = new Emitter( {
      tandem: providedOptions.tandem.createTandem( 'firePhotonEmitter' )
    } );

    this.firePhotonEmitter.addListener( () => {

      // TODO: Handle when emitSinglePhotonProperty is false.
      this.firePhoton();
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
   * Fires a single photon from the photon source.
   *
   * TODO: Handle multiple photons from different positions along the photon source.
   * TODO: Fire multiple photons at once
   * TODO: Sequence multiple photons so that when multiple fire, they all hit the target at the same time.
   */
  private firePhoton(): void {

    // Calculate the initial position and velocity of the photon.
    const position = PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.plus( Photon.TRAVEL_DIRECTION );
    const velocity = PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION.timesScalar( PhotoelectricEffectConstants.PHOTON_SPEED );

    // Create an add photon to array.
    const photon = new Photon( position, velocity, new Vector2( 0, 0 ), this.photonSource.wavelengthProperty.value );
    this.photons.push( photon );
  }

  /**
   * Resets Energy-specific state in addition to the inherited photoelectric effect state.
   */
  public override reset(): void {
    super.reset();

    this.energyGraphData.clear();
    this.energyGraphDisplayProperties.reset();
  }
}
