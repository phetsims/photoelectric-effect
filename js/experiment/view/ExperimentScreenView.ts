// Copyright 2026, University of Colorado Boulder

/**
 * View for the Experiment screen of the photoelectric effect simulation.
 * Extends the Intro screen view and adds a right-aligned column of graph placeholders
 * to establish layout for the Experiment-specific plotting features.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import IntroScreenView from '../../intro/view/IntroScreenView.js';
import ExperimentModel from '../model/ExperimentModel.js';
import ExperimentGraphNode from './ExperimentGraphNode.js';
import FrequencyEnergyGraphNode from './FrequencyEnergyGraphNode.js';
import IntensityCurrentGraphNode from './IntensityCurrentGraphNode.js';
import VoltageCurrentGraphNode from './VoltageCurrentGraphNode.js';

type SelfOptions = {
  //TODO add options that are specific to ExperimentScreenView here
};

type ExperimentScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class ExperimentScreenView extends IntroScreenView {

  public constructor( model: ExperimentModel, providedOptions: ExperimentScreenViewOptions ) {

    const options = optionize<ExperimentScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( model, options );

    const graphsVBox = new VBox( {
      spacing: ExperimentGraphNode.EXPERIMENT_GRAPH_SPACING,
      align: 'right',
      children: [
        new IntensityCurrentGraphNode( {
          tandem: options.tandem.createTandem( 'intensityCurrentGraphNode' )
        } ),
        new FrequencyEnergyGraphNode( {
          tandem: options.tandem.createTandem( 'frequencyEnergyGraphNode' )
        } ),
        new VoltageCurrentGraphNode( {
          tandem: options.tandem.createTandem( 'voltageCurrentGraphNode' )
        } )
      ]
    } );

    graphsVBox.right = this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN;
    graphsVBox.top = this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN;

    this.addChild( graphsVBox );
  }
}
