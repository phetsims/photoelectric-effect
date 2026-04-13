// Copyright 2026, University of Colorado Boulder

/**
 * VoltageCurrentGraphNode configures an ExperimentGraphNode for a voltage/current plot.
 * Sample data is owned by ExperimentModel.voltageCurrentGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type VoltageCurrentGraphNodeOptions = SelfOptions & NodeOptions;

export default class VoltageCurrentGraphNode extends ExperimentGraphNode {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions?: VoltageCurrentGraphNodeOptions ) {

    const zoomRangePairs = [
      {
        xRange: new Range( PhotoelectricEffectConstants.MIN_VOLTAGE, PhotoelectricEffectConstants.MAX_VOLTAGE ),
        yRange: new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT )
      },
      {
        xRange: new Range( -4, 4 ),
        yRange: new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.6 )
      },
      {
        xRange: new Range( -2, 2 ),
        yRange: new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.3 )
      }
    ];

    const options = optionize<VoltageCurrentGraphNodeOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const graphOptions: ExperimentGraphNodeOptions = {
      zoomRangePairs: zoomRangePairs,
      xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.voltageAxisLabelStringProperty,
      yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.currentAxisLabelStringProperty,
      gridXSpacing: 2,
      gridYSpacing: PhotoelectricEffectConstants.MAX_CURRENT / 4,
      linePlotOptions: {
        stroke: '#E03722'
      },
      tandem: options.tandem
    };

    super( model.voltageCurrentGraphData, graphOptions );
  }
}