// Copyright 2026, University of Colorado Boulder

/**
 * View for the Intro screen of the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import CircuitNode from '../../common/view/CircuitNode.js';
import LightSourceNode from '../../common/view/LightSourceNode.js';
import PhotonBeamScreenView, { PhotonBeamScreenViewOptions } from '../../common/view/PhotonBeamScreenView.js';
import PhotonSourceControl from '../../common/view/PhotonSourceControl.js';
import IntroModel from '../model/IntroModel.js';
import GroundedCircuitNode from './GroundedCircuitNode.js';
import RepresentationRadioButtonGroup from './RepresentationRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

type IntroScreenViewOptions = SelfOptions & PickRequired<PhotonBeamScreenViewOptions, 'tandem'>;

export default class IntroScreenView extends PhotonBeamScreenView {

  public constructor( model: IntroModel, providedOptions: IntroScreenViewOptions ) {
    const options = optionize<IntroScreenViewOptions, SelfOptions, PhotonBeamScreenViewOptions>()( {
      createLightSourceNode: beamStartCenter => new LightSourceNode( beamStartCenter,
        model.photonSource.wavelengthProperty, model.photonSource.photonRateProperty ),
      createPhotonSourcePanel: tandem => new PhotonSourceControl( model.photonSource, { tandem: tandem } ),
      screenSummaryContent: new ScreenSummaryContent( {
        playAreaContent: PhotoelectricEffectFluent.a11y.introScreen.screenSummary.playAreaStringProperty,
        controlAreaContent: PhotoelectricEffectFluent.a11y.introScreen.screenSummary.controlAreaStringProperty,
        currentDetailsContent: PhotoelectricEffectFluent.a11y.introScreen.screenSummary.currentDetails.leadingParagraphStringProperty,
        interactionHintContent: PhotoelectricEffectFluent.a11y.introScreen.screenSummary.interactionHintStringProperty
      } )
    }, providedOptions );
    super( model, options );

    //------------------------------------------------------------------------
    // Background circuit artwork — full circuit and grounded variant toggled by representation
    //------------------------------------------------------------------------

    this.backgroundNode.addChild( new CircuitNode( this.modelViewTransform, {
      visibleProperty: DerivedProperty.valueEqualsConstant( model.representationProperty, 'circuit' )
    } ) );
    this.backgroundNode.addChild( new GroundedCircuitNode( this.modelViewTransform, {
      visibleProperty: DerivedProperty.valueEqualsConstant( model.representationProperty, 'grounded' )
    } ) );

    //------------------------------------------------------------------------
    // Representation radio group (centered along the bottom)
    //------------------------------------------------------------------------

    const representationRadioButtonGroup = new RepresentationRadioButtonGroup( model.representationProperty, {
      tandem: options.tandem.createTandem( 'representationRadioButtonGroup' )
    } );
    representationRadioButtonGroup.centerBottom = this.layoutBounds.centerBottom.minusXY( 0, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN );
    this.addChild( representationRadioButtonGroup );

    // Electron visibility controls and ammeter are only meaningful when the full circuit is shown.
    model.representationProperty.link( representation => {
      this.electronVisibilityControls.visible = representation === 'circuit';
      this.ammeterDisplayPanel.visible = representation === 'circuit';
    } );

    this.pdomPlayAreaNode.pdomOrder = [
      this.photonSourcePanel,
      this.materialsComboBox,
      representationRadioButtonGroup
    ];
  }
}
