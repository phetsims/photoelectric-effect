// Copyright 2026, University of Colorado Boulder

/**
 * Bar graph display for the Energy screen. Each sample plot shows binding, photon, and kinetic energy bars in
 * that order, sharing a common y-axis scale and horizontal grid.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import ManualConstraint from '../../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Node, { type NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../PhotoelectricEffectFluent.js';
import EnergyGraphData from '../../model/EnergyGraphData.js';
import EnergyGraphDisplayProperties from '../../model/EnergyGraphDisplayProperties.js';
import EnergyGraphSample from '../../model/EnergyGraphSample.js';
import EnergyBarGraphDecorationsNode from './EnergyBarGraphDecorationsNode.js';
import EnergyGraphLayout from '../EnergyGraphLayout.js';
import EnergySampleBarPlotNode from './EnergySampleBarPlotNode.js';

type SelfOptions = EmptySelfOptions;
export type EnergyBarGraphNodeOptions = SelfOptions & NodeOptions;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 240;
const CHART_VIEW_HEIGHT = 270;

// Space around axis labels and sample labels.
const Y_AXIS_LABEL_MARGIN = 34;

export default class EnergyBarGraphNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  public constructor( samples: EnergyGraphSample[],
                      workFunctionProperty: TReadOnlyProperty<number>,
                      providedOptions: EnergyBarGraphNodeOptions ) {

    const options = optionize<EnergyBarGraphNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    super( options );

    this.chartTransform = new ChartTransform( {
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range( 0.5, EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES + 0.5 ),
      modelYRange: EnergyGraphDisplayProperties.MODEL_Y_RANGE
    } );

    const plotRectangle = new Rectangle( 0, 0, CHART_VIEW_WIDTH, CHART_VIEW_HEIGHT, {
      fill: 'white'
    } );

    const sampleBarPlotNodes = samples.map( ( sample, sampleIndex ) => {
      return new EnergySampleBarPlotNode( this.chartTransform, sample, sampleIndex );
    } );

    const plotLayer = new Node( {
      clipArea: plotRectangle.getShape(),
      children: sampleBarPlotNodes
    } );

    const decorationsNode = new EnergyBarGraphDecorationsNode( this.chartTransform, workFunctionProperty );

    const yAxisLabel = new Text( PhotoelectricEffectFluent.energy.graph.yAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      rotation: -Math.PI / 2,

      // The label is rotated along the chart's left side, so the text length becomes vertical extent — limit it
      // to the chart height so long strings scale down rather than growing the layout.
      maxWidth: CHART_VIEW_HEIGHT
    } );

    const xLabels = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      const label = new Text( `${sampleIndex + 1}`, {
        font: PhotoelectricEffectConstants.CONTENT_FONT
      } );
      label.centerTop = new Vector2(
        this.chartTransform.modelToViewX( EnergyGraphLayout.getSampleCenterX( sampleIndex ) ),
        CHART_VIEW_HEIGHT + EnergyGraphLayout.X_TICK_LABEL_MARGIN
      );
      return label;
    } );

    const chartNode = new Node( {
      children: [
        plotRectangle,
        decorationsNode,
        plotLayer,
        ...xLabels
      ]
    } );

    const graphNode = new Node( {
      children: [
        yAxisLabel,
        chartNode
      ]
    } );

    // dynamic locales - keep the y axis label in place when the language changes
    ManualConstraint.create( graphNode, [ yAxisLabel ], yAxisLabelProxy => {
      yAxisLabelProxy.rightCenter = plotRectangle.leftCenter.minusXY( Y_AXIS_LABEL_MARGIN, 0 );
    } );

    this.children = [ graphNode ];
  }
}
