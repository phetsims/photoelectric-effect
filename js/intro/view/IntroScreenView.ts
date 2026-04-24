// Copyright 2026, University of Colorado Boulder

/**
 * View for the Intro screen of the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import CircuitNode from '../../common/view/CircuitNode.js';
import PhotoelectricEffectScreenView from '../../common/view/PhotoelectricEffectScreenView.js';
import IntroModel from '../model/IntroModel.js';
import GroundedCircuitNode from './GroundedCircuitNode.js';
import SceneRadioButtonGroup from './SceneRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class IntroScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: IntroModel, providedOptions: IntroScreenViewOptions ) {
    const options = optionize<IntroScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( model, options );

    // Add circuit node as background.

    this.addChild( new CircuitNode( this.modelViewTransform, {
      visibleProperty: DerivedProperty.valueEqualsConstant( model.sceneProperty, 'circuit' )
    } ) );
    this.addChild( new GroundedCircuitNode( this.modelViewTransform, {
      visibleProperty: DerivedProperty.valueEqualsConstant( model.sceneProperty, 'grounded' )
    } ) );
    const sceneRadioButtonGroup = new SceneRadioButtonGroup( model.sceneProperty, {
      tandem: options.tandem.createTandem( 'sceneRadioButtonGroup' )
    } );
    this.addChild( sceneRadioButtonGroup );

    sceneRadioButtonGroup.centerBottom = this.layoutBounds.centerBottom.minusXY( 0, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN );

    // In the intro screen, electron visibility controls are only available in the circuit scene.
    model.sceneProperty.link( scene => {
      this.electronVisibilityControls.visible = scene === 'circuit';
      this.ammeterDisplayPanel.visible = scene === 'circuit';
    } );
  }
}
