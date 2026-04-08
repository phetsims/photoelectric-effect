// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import Material from '../common/model/Material.js';
import PhotoelectricEffectColors from '../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../PhotoelectricEffectFluent.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectScreen here
};

type PhotoelectricEffectScreenOptions = SelfOptions & ScreenOptions;

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectScreenOptions ) {

    const options = optionize<PhotoelectricEffectScreenOptions, SelfOptions, ScreenOptions>()( {
      name: PhotoelectricEffectFluent.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: PhotoelectricEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new IntroModel( mysteryMaterials, { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}
