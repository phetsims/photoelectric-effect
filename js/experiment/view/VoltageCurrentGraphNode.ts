// Copyright 2026, University of Colorado Boulder

/**
 * VoltageCurrentGraphNode configures an ExperimentGraphNode for a voltage/current plot with
 * placeholder data and zoom ranges. It uses bamboo line plotting with a simple diagonal line
 * to establish layout before wiring real data.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type VoltageCurrentGraphNodeOptions = SelfOptions & NodeOptions;

export default class VoltageCurrentGraphNode extends ExperimentGraphNode {

  public constructor( providedOptions?: VoltageCurrentGraphNodeOptions ) {

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
      titleStringProperty: PhotoelectricEffectFluent.experiment.graph.voltageCurrentTitleStringProperty,
      dataSet: createPlaceholderDataSet( zoomRangePairs[ 0 ] ),
      zoomRangePairs: zoomRangePairs,
      gridXSpacing: 2,
      gridYSpacing: PhotoelectricEffectConstants.MAX_CURRENT / 4,
      tandem: options.tandem
    };

    super( graphOptions );
  }
}

const createPlaceholderDataSet = ( rangePair: { xRange: Range; yRange: Range } ): Vector2[] => {
  return [
    new Vector2( rangePair.xRange.min, rangePair.yRange.min ),
    new Vector2( rangePair.xRange.max, rangePair.yRange.max )
  ];
};