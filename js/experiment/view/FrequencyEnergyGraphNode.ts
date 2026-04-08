// Copyright 2026, University of Colorado Boulder

/**
 * FrequencyEnergyGraphNode configures an ExperimentGraphNode for a frequency/energy plot with
 * placeholder data and zoom ranges. The graph is a simple line placeholder that can be replaced
 * with real computed data later.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type FrequencyEnergyGraphNodeOptions = SelfOptions & NodeOptions;

export default class FrequencyEnergyGraphNode extends ExperimentGraphNode {

  public constructor( providedOptions?: FrequencyEnergyGraphNodeOptions ) {

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

    const options = optionize<FrequencyEnergyGraphNodeOptions, SelfOptions, NodeOptions>()( {
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const graphOptions: ExperimentGraphNodeOptions = {
      titleStringProperty: PhotoelectricEffectFluent.experiment.graph.frequencyEnergyTitleStringProperty,
      dataSet: createPlaceholderDataSet( zoomRangePairs[ 0 ] ),
      zoomRangePairs: zoomRangePairs,
      gridXSpacing: 0.25,
      gridYSpacing: 0.25,
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