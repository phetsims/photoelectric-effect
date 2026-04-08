// Copyright 2026, University of Colorado Boulder

/**
 * Screen class for the Energy screen in the photoelectric effect simulation.
 * Currently reuses the Intro screen model and view while keeping a separate screen
 * entry for future Energy-specific features.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import Material from '../common/model/Material.js';
import PhotoelectricEffectColors from '../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../PhotoelectricEffectFluent.js';
import EnergyModel from './model/EnergyModel.js';
import EnergyScreenView from './view/EnergyScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to EnergyScreen here
};

type EnergyScreenOptions = SelfOptions & ScreenOptions;

export default class EnergyScreen extends Screen<EnergyModel, EnergyScreenView> {

  public constructor( mysteryMaterials: Material[], providedOptions: EnergyScreenOptions ) {

    const options = optionize<EnergyScreenOptions, SelfOptions, ScreenOptions>()( {
      name: PhotoelectricEffectFluent.screen.energyStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: PhotoelectricEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new EnergyModel( mysteryMaterials, { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new EnergyScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}
