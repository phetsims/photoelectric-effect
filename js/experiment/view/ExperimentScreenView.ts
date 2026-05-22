// Copyright 2026, University of Colorado Boulder

/**
 * View for the Experiment screen of the photoelectric effect simulation.
 * Includes graphs of model data and a battery to drive the circuit potential.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

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
import FrequencyEnergyGraphAssemblyNode from './FrequencyEnergyGraphAssemblyNode.js';
import GraphAssemblyNode from './GraphAssemblyNode.js';
import IntensityCurrentGraphAssemblyNode from './IntensityCurrentGraphAssemblyNode.js';
import VoltageCurrentGraphAssemblyNode from './VoltageCurrentGraphAssemblyNode.js';
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

    // Add circuit node as background.
    this.backgroundNode.addChild( new CircuitNode( this.modelViewTransform ) );

    const graphsVBox = new VBox( {
      spacing: GraphAssemblyNode.GRAPH_ASSEMBLY_SPACING,
      align: 'right',
      children: [
        new IntensityCurrentGraphAssemblyNode( model, {
          tandem: options.tandem.createTandem( 'intensityCurrentGraphNode' )
        } ),
        new FrequencyEnergyGraphAssemblyNode( model, {
          tandem: options.tandem.createTandem( 'frequencyEnergyGraphNode' )
        } ),
        new VoltageCurrentGraphAssemblyNode( model, {
          tandem: options.tandem.createTandem( 'voltageCurrentGraphNode' )
        } )
      ]
    } );

    const voltageNumberControl = new VoltageNumberControl( model, {
      tandem: options.tandem.createTandem( 'voltageNumberControl' )
    } );

    // layout
    graphsVBox.right = this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN;
    graphsVBox.top = this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN;

    // TODO: In the future, we will have the model position of the battery (probably), and this control should
    //   be positioned relative to that. And this control should be positioned relative to that.
    const experimentViewCenter = this.modelViewTransform.modelToViewXY(
      // center x between the plates
      PhotoelectricEffectConstants.TARGET_X + ( PhotoelectricEffectConstants.COLLECTOR_X - PhotoelectricEffectConstants.TARGET_X ) / 2,

      // view center y
      0
    );
    voltageNumberControl.center = experimentViewCenter.plusXY( 0, 150 );

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
