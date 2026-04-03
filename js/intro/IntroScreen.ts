// Copyright 2026, University of Colorado Boulder

/**
 * TODO Describe this class and its responsibilities.
 *
 * @author Marla A. Schulz
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize from '../../../phet-core/js/optionize.js';
import Material, { MaterialType } from '../common/model/Material.js';
import PhotoelectricEffectModel from '../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectColors from '../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../PhotoelectricEffectFluent.js';
import IntroScreenView from './view/IntroScreenView.js';

type SelfOptions = {
  //TODO add options that are specific to PhotoelectricEffectScreen here
};

type PhotoelectricEffectScreenOptions = SelfOptions & ScreenOptions;

const MYSTERY_MATERIALS = [

// A material that will be controllable by preferences. It cannot be reset in the simulation screen.
  new Material( MaterialType.MYSTERY ),

// A material that will ONLY be present in PhET-iO brand and controlled by the PhET-iO API. Work function
// for these cannot change and cannot be reset in the simulation screen.
// TODO: Consider a new name for "mystery". It seems like this is basically "NON_RESETTABLE".
  new Material( MaterialType.MYSTERY ),
  new Material( MaterialType.MYSTERY )
];

export default class IntroScreen extends Screen<PhotoelectricEffectModel, IntroScreenView> {

  public constructor( providedOptions: PhotoelectricEffectScreenOptions ) {

    const options = optionize<PhotoelectricEffectScreenOptions, SelfOptions, ScreenOptions>()( {
      name: PhotoelectricEffectFluent.screen.nameStringProperty,

      //TODO add default values for optional SelfOptions here

      //TODO add default values for optional ScreenOptions here
      backgroundColorProperty: PhotoelectricEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new PhotoelectricEffectModel( MYSTERY_MATERIALS, { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}
