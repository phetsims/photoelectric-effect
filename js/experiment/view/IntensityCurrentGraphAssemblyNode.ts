// Copyright 2026, University of Colorado Boulder

/**
 * IntensityCurrentGraphAssemblyNode configures a GraphAssemblyNode for an intensity/current plot.
 * Sample data is owned by ExperimentModel.intensityCurrentGraphData.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import PhotonSource from '../../common/model/PhotonSource.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import GraphAssemblyNode, { type GraphAssemblyNodeOptions } from './GraphAssemblyNode.js';

type SelfOptions = EmptySelfOptions;

export type IntensityCurrentGraphAssemblyNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class IntensityCurrentGraphAssemblyNode extends GraphAssemblyNode {

  /**
   * @param model - Provides graph data and axis ranges for this plot.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: ExperimentModel, providedOptions: IntensityCurrentGraphAssemblyNodeOptions ) {

    const zoomRangePairs = [
      {
        xRange: PhotonSource.INTENSITY_RANGE,
        yRange: new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT )
      },
      {
        xRange: PhotonSource.INTENSITY_RANGE,
        yRange: new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.6 )
      },
      {
        xRange: PhotonSource.INTENSITY_RANGE,
        yRange: new Range( 0, PhotoelectricEffectConstants.MAX_CURRENT * 0.3 )
      }
    ];

    const graphOptions: GraphAssemblyNodeOptions = {
      graphPlotAreaNodeOptions: {
        zoomRangePairs: zoomRangePairs,
        xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.intensityAxisLabelStringProperty,
        yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.currentAxisLabelStringProperty,
        gridXSpacing: 0.25,
        gridYSpacing: PhotoelectricEffectConstants.MAX_CURRENT / 4,
        xTickLabelFormatter: value => {
          const scaledValue = value * 100;
          const isInteger = Math.abs( scaledValue - roundSymmetric( scaledValue ) ) < 1e-6;
          return toFixed( scaledValue, isInteger ? 0 : 2 );
        },
        linePlotOptions: {

          // TODO: Move this to PhotoelectricEffectColors.ts
          stroke: '#4B853E'
        }
      },
      tandem: providedOptions.tandem
    };

    super( model.intensityCurrentGraphData, graphOptions );
  }
}
