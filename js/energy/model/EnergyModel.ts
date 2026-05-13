// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Energy screen of the photoelectric effect simulation.
 * Currently mirrors the Intro model behavior but keeps a dedicated class for
 * future Energy-specific state and behavior.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';

export default class EnergyModel extends PhotoelectricEffectModel {

  public readonly emitSinglePhotonProperty: Property<boolean>;

  public constructor( mysteryMaterials: Material[], providedOptions: WithRequired<PhotoelectricEffectModelOptions, 'tandem'> ) {
    super(
      mysteryMaterials,
      tandem => [ new Material( MaterialType.CUSTOM, { tandem: tandem.createTandem( 'custom' ) } ) ],
      providedOptions );

    this.emitSinglePhotonProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'emitSinglePhotonProperty' )
    } );
  }
}
