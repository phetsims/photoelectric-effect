// Copyright 2026, University of Colorado Boulder

/**
 * View for the Intro screen of the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectScreenView from '../../common/view/PhotoelectricEffectScreenView.js';
import IntroModel from '../model/IntroModel.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class IntroScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: IntroModel, providedOptions: IntroScreenViewOptions ) {
    const options = optionize<IntroScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    const sceneRadioButtonGroup = new SceneRadioButtonGroup( model.sceneProperty, {
      tandem: options.tandem.createTandem( 'sceneRadioButtonGroup' )
    } );
    this.addChild( sceneRadioButtonGroup );

    sceneRadioButtonGroup.centerBottom = this.layoutBounds.centerBottom.minusXY( 0, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN );

    model.sceneProperty.lazyLink( () => {
      console.log( 'scene changed' );
    } );
  }
}
