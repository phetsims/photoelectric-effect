// Copyright 2026, University of Colorado Boulder

/**
 * View for the Experiment screen of the photoelectric effect simulation.
 * Includes graphs of model data and a battery to drive the circuit potential.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import CircuitNode from '../../common/view/CircuitNode.js';
import LightSourceNode from '../../common/view/LightSourceNode.js';
import PhotonBeamScreenView, { PhotonBeamScreenViewOptions } from '../../common/view/PhotonBeamScreenView.js';
import PhotonSourceControl from '../../common/view/PhotonSourceControl.js';
import ExperimentModel from '../model/ExperimentModel.js';
import FrequencyEnergyGraphAccordionBox from './FrequencyEnergyGraphAccordionBox.js';
import GraphAssemblyAccordionBox from './GraphAssemblyAccordionBox.js';
import IntensityCurrentGraphAccordionBox from './IntensityCurrentGraphAccordionBox.js';
import VoltageCurrentGraphAccordionBox from './VoltageCurrentGraphAccordionBox.js';
import VoltageNumberControl from './VoltageNumberControl.js';

type SelfOptions = EmptySelfOptions;

type ExperimentScreenViewOptions = SelfOptions & PickRequired<PhotonBeamScreenViewOptions, 'tandem'>;

export default class ExperimentScreenView extends PhotonBeamScreenView {

  public constructor( model: ExperimentModel, providedOptions: ExperimentScreenViewOptions ) {

    const options = optionize<ExperimentScreenViewOptions, SelfOptions, PhotonBeamScreenViewOptions>()( {
      createLightSourceNode: beamStartCenter => new LightSourceNode( beamStartCenter ),
      createPhotonSourcePanel: tandem => new PhotonSourceControl( model.photonSource, { tandem: tandem } ),
      screenSummaryContent: new ScreenSummaryContent( {
        playAreaContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.playAreaStringProperty,
        controlAreaContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.controlAreaStringProperty,
        currentDetailsContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.currentDetails.leadingParagraphStringProperty,
        interactionHintContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.interactionHintStringProperty
      } )
    }, providedOptions );

    super( model, options );

    //------------------------------------------------------------------------
    // Background circuit artwork
    //------------------------------------------------------------------------

    this.backgroundNode.addChild( new CircuitNode( this.modelViewTransform ) );

    //------------------------------------------------------------------------
    // Right-column graphs: intensity-current, frequency-energy, voltage-current
    //------------------------------------------------------------------------

    const graphsVBox = new VBox( {
      spacing: GraphAssemblyAccordionBox.GRAPH_ASSEMBLY_SPACING,
      align: 'right',
      children: [

        // TODO: Rename these to AccordionBox now
        new IntensityCurrentGraphAccordionBox( model, {
          tandem: options.tandem.createTandem( 'intensityCurrentGraphAccordionBox' )
        } ),
        new FrequencyEnergyGraphAccordionBox( model, {
          tandem: options.tandem.createTandem( 'frequencyEnergyGraphAccordionBox' )
        } ),
        new VoltageCurrentGraphAccordionBox( model, {
          tandem: options.tandem.createTandem( 'voltageCurrentGraphAccordionBox' )
        } )
      ],
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
    } );

    //------------------------------------------------------------------------
    // Battery / voltage control (centered between the plates, offset to make room for the ammeter)
    //------------------------------------------------------------------------

    // TODO: In the future, we will have the position of the battery, and this control will be positioned relative to that.
    const experimentViewCenterX = this.modelViewTransform.modelToViewX(
      PhotoelectricEffectConstants.TARGET_X + ( PhotoelectricEffectConstants.COLLECTOR_X - PhotoelectricEffectConstants.TARGET_X ) / 2
    );

    const voltageNumberControl = new VoltageNumberControl( model, {
      tandem: options.tandem.createTandem( 'voltageNumberControl' ),
      centerBottom: new Vector2( experimentViewCenterX - 20, this.layoutBounds.bottom - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN )
    } );

    this.addChild( graphsVBox );
    this.addChild( voltageNumberControl );

    this.pdomPlayAreaNode.pdomOrder = [
      this.photonSourcePanel,
      this.materialsComboBox,
      voltageNumberControl,
      graphsVBox
    ];
  }
}
