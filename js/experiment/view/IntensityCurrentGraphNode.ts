// Copyright 2026, University of Colorado Boulder

/**
 * IntensityCurrentGraphNode configures an ExperimentGraphNode for an intensity/current plot and
 * appends data points whenever the photon source intensity changes. It starts with no plotted
 * data so the Experiment layout can be established before interaction.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotonSource from '../../common/model/PhotonSource.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type IntensityCurrentGraphNodeOptions = SelfOptions & NodeOptions;

export default class IntensityCurrentGraphNode extends ExperimentGraphNode {

  /**
   * @param model - Provides the photon source intensity and analytic current.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: PhotoelectricEffectModel, providedOptions?: IntensityCurrentGraphNodeOptions ) {

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
        stroke: '#4B853E'
      },
      tandem: options.tandem
    };

    super( model.resetEmitter, graphOptions );

    const intensityObserver = ( intensity: number ) => {
      this.addDataPoint( new Vector2( intensity, model.currentProperty.value ) );
    };
    const resetObserver = () => this.clearDataSet();
    Multilink.lazyMultilinkAny( [
      model.voltageProperty,
      model.wavelengthProperty,
      model.target.materialProperty,
      model.target.workFunctionProperty
    ], resetObserver );

    model.photonSource.intensityProperty.lazyLink( intensityObserver );
  }
}