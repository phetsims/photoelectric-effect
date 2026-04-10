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

  // Disposes listeners for data updates.
  private readonly disposeIntensityCurrentGraphNode: () => void;

  // Stores the plotted intensity/current points in model coordinates.
  private readonly dataSet: Vector2[] = [];

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
      dataSet: [],
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
      this.dataSet.push( new Vector2( intensity, model.currentProperty.value ) );
      this.setDataSet( this.dataSet );
    };
    const resetObserver = () => this.clearDataSet();
    const resetMultilink = Multilink.lazyMultilinkAny( [
      model.voltageProperty,
      model.wavelengthProperty,
      model.target.materialProperty,
      model.target.workFunctionProperty
    ], resetObserver );

    model.photonSource.intensityProperty.lazyLink( intensityObserver );

    this.disposeIntensityCurrentGraphNode = () => {
      model.photonSource.intensityProperty.unlink( intensityObserver );
      Multilink.unmultilink( resetMultilink );
    };
  }

  /**
   * Releases listeners tied to the graph data set.
   */
  public override dispose(): void {
    this.disposeIntensityCurrentGraphNode();
    super.dispose();
  }

  /**
   * Clears the plotted intensity/current data.
   */
  protected override clearDataSet(): void {
    this.dataSet.length = 0;
    super.clearDataSet();
  }
}