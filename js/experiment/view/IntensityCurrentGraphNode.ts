// Copyright 2026, University of Colorado Boulder

/**
 * IntensityCurrentGraphNode configures an ExperimentGraphNode for an intensity/current plot with
 * placeholder data and zoom ranges. This establishes layout before real intensity/current data
 * are wired into the graph.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonSource from '../../common/model/PhotonSource.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type IntensityCurrentGraphNodeOptions = SelfOptions & NodeOptions;

export default class IntensityCurrentGraphNode extends ExperimentGraphNode {

  /**
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( providedOptions?: IntensityCurrentGraphNodeOptions ) {

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

    const options = optionize<IntensityCurrentGraphNodeOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const graphOptions: ExperimentGraphNodeOptions = {
      dataSet: createPlaceholderDataSet( zoomRangePairs[ 0 ] ),
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
      tandem: options.tandem
    };

    super( graphOptions );
  }
}

/**
 * Creates a simple two-point line that spans the provided ranges.
 *
 * @param rangePair - Model ranges used to define the line endpoints.
 */
const createPlaceholderDataSet = ( rangePair: { xRange: Range; yRange: Range } ): Vector2[] => {
  return [
    new Vector2( rangePair.xRange.min, rangePair.yRange.min ),
    new Vector2( rangePair.xRange.max, rangePair.yRange.max )
  ];
};