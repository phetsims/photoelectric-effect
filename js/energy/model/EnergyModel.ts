// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Energy screen of the photoelectric effect simulation.
 * Adds Energy-specific state to the shared photoelectric effect model.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Material from '../../common/model/Material.js';
import { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import IntroModel from '../../intro/model/IntroModel.js';
import EnergyGraphData from './EnergyGraphData.js';
import EnergyGraphDisplayProperties from './EnergyGraphDisplayProperties.js';

export default class EnergyModel extends IntroModel {
  public readonly emitSinglePhotonProperty: BooleanProperty;

  // Properties that control Energy screen graph mode and diagram visibility.
  public readonly energyGraphDisplayProperties: EnergyGraphDisplayProperties;

  // Recorded sample data shown by the Energy screen graph displays.
  public readonly energyGraphData: EnergyGraphData;

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
