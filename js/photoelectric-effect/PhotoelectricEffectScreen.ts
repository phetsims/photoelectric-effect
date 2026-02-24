// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import PhotoelectricEffectColors from '../common/PhotoelectricEffectColors.js';
import photoelectricEffect from '../photoelectricEffect.js';
import PhotoelectricEffectFluent from '../PhotoelectricEffectFluent.js';
import PhotoelectricEffectModel from './model/PhotoelectricEffectModel.js';
import PhotoelectricEffectScreenView from './view/PhotoelectricEffectScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectScreen here
};

type PhotoelectricEffectScreenOptions = SelfOptions & ScreenOptions;

export default class PhotoelectricEffectScreen extends Screen<PhotoelectricEffectModel, PhotoelectricEffectScreenView> {

  public constructor( providedOptions: PhotoelectricEffectScreenOptions ) {

    const options = optionize<PhotoelectricEffectScreenOptions, SelfOptions, ScreenOptions>()( {
      name: PhotoelectricEffectFluent.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: PhotoelectricEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new PhotoelectricEffectModel( { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new PhotoelectricEffectScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}

photoelectricEffect.register( 'PhotoelectricEffectScreen', PhotoelectricEffectScreen );