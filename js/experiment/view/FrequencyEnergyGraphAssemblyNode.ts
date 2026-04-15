// Copyright 2026, University of Colorado Boulder

/**
 * FrequencyEnergyGraphAssemblyNode configures a GraphAssemblyNode for a frequency/energy plot.
 * Sample data is owned by ExperimentModel.frequencyEnergyGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyNode, { type GraphAssemblyNodeOptions } from './GraphAssemblyNode.js';

type SelfOptions = EmptySelfOptions;

export type FrequencyEnergyGraphAssemblyNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class FrequencyEnergyGraphAssemblyNode extends GraphAssemblyNode {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: FrequencyEnergyGraphAssemblyNodeOptions ) {

    const zoomRangePairs = [
      {
        xRange: new Range( 0, 1 ),
        yRange: new Range( 0, 1 )
      },
      {
        xRange: new Range( 0, 0.5 ),
        yRange: new Range( 0, 0.5 )
      },
      {
        xRange: new Range( 0, 0.25 ),
        yRange: new Range( 0, 0.25 )
      }
    ];

    const options = optionize<FrequencyEnergyGraphAssemblyNodeOptions, SelfOptions, NodeOptions>()( {
    }, providedOptions );

    const graphOptions: GraphAssemblyNodeOptions = {
      graphPlotAreaNodeOptions: {
        zoomRangePairs: zoomRangePairs,
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.frequencyAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.energyAxisLabelStringProperty,

        // TODO: This option is a little strange. We needed it so that the label did not overlap with the
        //   ExpandCollapseButton. Check in with design to see how the layout should ideally be done.
        yAxisLabelYOffset: 10,
        gridXSpacing: 0.25,
        gridYSpacing: 0.25,
        linePlotOptions: {

          // TODO: Move this to PhotoelectricEffectColors.ts
          stroke: '#7090F5'
        }
      },
      tandem: options.tandem
    };

    super( model.frequencyEnergyGraphData, graphOptions );
  }
}
