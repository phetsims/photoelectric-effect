// Copyright 2026, University of Colorado Boulder

/**
 * View for the Experiment screen of the photoelectric effect simulation.
 * Includes graphs of model data and a battery to drive the circuit potential.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectScreenView from '../../common/view/PhotoelectricEffectScreenView.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyNode from './GraphAssemblyNode.js';
import FrequencyEnergyGraphAssemblyNode from './FrequencyEnergyGraphAssemblyNode.js';
import IntensityCurrentGraphAssemblyNode from './IntensityCurrentGraphAssemblyNode.js';
import VoltageCurrentGraphAssemblyNode from './VoltageCurrentGraphAssemblyNode.js';

type SelfOptions = {
  //TODO add options that are specific to ExperimentScreenView here
};

type ExperimentScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class ExperimentScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: ExperimentModel, providedOptions: ExperimentScreenViewOptions ) {

    const options = optionize<ExperimentScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );

    super( model, options );

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

    graphsVBox.right = this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN;
    graphsVBox.top = this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN;

    this.addChild( graphsVBox );
  }
}
