// Copyright 2026, University of Colorado Boulder

/**
 * Screen class for the Intro screen in the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Material from '../common/model/Material.js';
import PhotoelectricEffectColors from '../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../PhotoelectricEffectFluent.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

type SelfOptions = EmptySelfOptions;
type PhotoelectricEffectScreenOptions = SelfOptions & ScreenOptions;

export default class IntroScreen extends Screen<IntroModel, IntroScreenView> {

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectScreenOptions ) {

    const options = optionize<PhotoelectricEffectScreenOptions, SelfOptions, ScreenOptions>()( {
      name: PhotoelectricEffectFluent.screen.introStringProperty,
      backgroundColorProperty: PhotoelectricEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new IntroModel( mysteryMaterials, { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new IntroScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}
