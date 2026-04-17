// Copyright 2026, University of Colorado Boulder

/**
 * View for the Intro screen of the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhotoelectricEffectScreenView from '../../common/view/PhotoelectricEffectScreenView.js';
import IntroModel from '../model/IntroModel.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class IntroScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: IntroModel, providedOptions: IntroScreenViewOptions ) {
    const options = optionize<IntroScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

  }
}
