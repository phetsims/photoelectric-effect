// Copyright 2026, University of Colorado Boulder

/**
 * VoltageCurrentGraphNode configures an ExperimentGraphNode for a voltage/current plot and
 * appends data points whenever the plate voltage changes. It clears plotted data when other
 * inputs change so the curve stays consistent.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type VoltageCurrentGraphNodeOptions = SelfOptions & NodeOptions;

export default class VoltageCurrentGraphNode extends ExperimentGraphNode {

  // Disposes listeners for data updates.
  private readonly disposeVoltageCurrentGraphNode: () => void;

  // Stores the plotted voltage/current points in model coordinates.
  private readonly dataSet: Vector2[] = [];

  /**
   * @param model - Provides the voltage and analytic current inputs.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: PhotoelectricEffectModel, providedOptions?: VoltageCurrentGraphNodeOptions ) {

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
      dataSet: [],
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

    super( model.resetEmitter, graphOptions );

    const voltageObserver = ( voltage: number ) => {
      this.dataSet.push( new Vector2( voltage, model.currentProperty.value ) );
      this.setDataSet( this.dataSet );
    };
    const resetObserver = () => this.clearDataSet();
    const resetMultilink = Multilink.lazyMultilinkAny( [
      model.photonSource.intensityProperty,
      model.wavelengthProperty,
      model.target.materialProperty,
      model.target.workFunctionProperty
    ], resetObserver );

    model.voltageProperty.lazyLink( voltageObserver );

    this.disposeVoltageCurrentGraphNode = () => {
      model.voltageProperty.unlink( voltageObserver );
      Multilink.unmultilink( resetMultilink );
    };
  }

  /**
   * Releases listeners tied to the graph data set.
   */
  public override dispose(): void {
    this.disposeVoltageCurrentGraphNode();
    super.dispose();
  }

  /**
   * Clears the plotted voltage/current data.
   */
  protected override clearDataSet(): void {
    this.dataSet.length = 0;
    super.clearDataSet();
  }
}