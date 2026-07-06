// Copyright 2026, University of Colorado Boulder

/**
 * GraphPlotAxesNode renders the non-data portions of an experiment graph plot area: grid lines, tick marks, tick
 * labels, axis labels, chart mask, and border. It recreates tick and grid sets when the active displayed ranges
 * change.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Range from '../../../../../dot/js/Range.js';
import Shape from '../../../../../kite/js/Shape.js';
import ManualConstraint from '../../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import GraphPlotAxisSets, { type GraphPlotGridLineSetGroup, type GraphPlotTickSetGroup, type TickLabelMode } from './GraphPlotAxisSets.js';

export type { TickLabelMode } from './GraphPlotAxisSets.js';

// Type to customize the border of the plot.
// rectangle - a full rectangle outlines the chart area
// line - a line along the bottom of the chart area
export type BorderStyle = 'rectangle' | 'line';

// Gap between the chart/ticks and axis labels.
const AXIS_LABEL_MARGIN = 6;

// Fixed gutters reserved for tick labels so axis-label placement stays stable across zoom levels.
// TODO: These are hardcoded estimates - if a graph ever produces tick labels wider/taller than these values,
//   axis labels will overlap the ticks. Consider deriving from actual tick label bounds if that happens.
const X_AXIS_TICK_LABEL_GUTTER = 12;
const Y_AXIS_TICK_LABEL_GUTTER = 35;

export type GraphPlotAxesNodeOptions = {

  // X-axis label centered beneath the chart.
  xAxisLabelStringProperty: TReadOnlyProperty<string>;

  // Y-axis label rotated along the left side of the chart.
  yAxisLabelStringProperty: TReadOnlyProperty<string>;

  // Additional vertical offset applied to the Y-axis label (view coordinates).
  yAxisLabelYOffset: number;

  // Optional formatter for x-axis tick labels.
  xTickLabelFormatter: null | ( ( value: number ) => string );

  // Optional formatter for y-axis tick labels.
  yTickLabelFormatter: null | ( ( value: number ) => string );

  // Controls which x-axis tick marks receive labels.
  xTickLabelMode: TickLabelMode;

  // Controls which y-axis tick marks receive labels.
  yTickLabelMode: TickLabelMode;

  // Number of major ticks (including min/max) along the x axis.
  xTickCount: number;

  // Number of major ticks (including min/max) along the y axis.
  yTickCount: number;

  // Set false to hide all x-axis labels and ticks.
  showXLabels: boolean;

  // Controls the outline style of the border, see type for more information.
  borderStyle: BorderStyle;
};

export default class GraphPlotAxesNode extends Node {

  // Translates model coordinates to chart view coordinates.
  private readonly chartTransform: ChartTransform;

  // Container whose children are replaced when grid line sets are regenerated.
  private readonly gridLineSetNode: Node;

  // Container whose child order keeps grid lines behind the plotted data.
  private readonly chartContentNode: Node;

  // Plot data layer owned by GraphPlotDataNode, inserted between grid lines and the chart border.
  private readonly plotLayerNode: Node;

  // Container for current tick marks; x ticks are included only when x-axis labels are shown.
  private readonly tickMarkNode: Node;

  // Container for current tick labels; x labels are included only when x-axis labels are shown.
  private readonly tickLabelNode: Node;

  // X-axis label centered beneath the chart.
  private readonly xAxisLabelText: RichText;

  // Tick/label groups for the active displayed range; replaced and disposed when ranges change.
  private tickSets: GraphPlotTickSetGroup;

  // Grid-line sets for the active displayed range; replaced and disposed when ranges change.
  private gridLineSets: GraphPlotGridLineSetGroup;

  // Whether x-axis tick marks, tick labels, and the axis label are visible.
  private showXLabels: boolean;

  // Visual configuration reused whenever tick and grid sets are recreated.
  private readonly options: GraphPlotAxesNodeOptions;

  /**
   * @param chartTransform - Translates model coordinates to chart view coordinates.
   * @param plotBounds - Bounds of the plot area in this node's local coordinate frame.
   * @param xRange - Active x-axis displayed range.
   * @param yRange - Active y-axis displayed range.
   * @param plotLayerNode - Plot data layer inserted above grid lines and below the border.
   * @param chartContentClipArea - Clip applied so grid lines and data stay inside the chart rectangle.
   * @param options
   */
  public constructor(
    chartTransform: ChartTransform,
    plotBounds: Bounds2,
    xRange: Range,
    yRange: Range,
    plotLayerNode: Node,
    chartContentClipArea: Shape,
    options: GraphPlotAxesNodeOptions
  ) {
    const tickSets = GraphPlotAxisSets.createTickSets(
      chartTransform,
      xRange,
      yRange,
      options.xTickCount,
      options.yTickCount,
      options.xTickLabelFormatter,
      options.yTickLabelFormatter,
      options.xTickLabelMode,
      options.yTickLabelMode
    );
    const gridLineSets = GraphPlotAxisSets.createGridLineSets(
      chartTransform,
      xRange,
      yRange,
      options.xTickCount,
      options.yTickCount
    );

    const gridLineSetNode = new Node( {
      clipArea: chartContentClipArea,
      children: [
        gridLineSets.verticalGridLineSet,
        gridLineSets.horizontalGridLineSet
      ]
    } );

    const chartContentNode = new Node( {
      clipArea: chartContentClipArea,
      children: [
        gridLineSetNode,
        plotLayerNode
      ]
    } );

    const borderNode = GraphPlotAxesNode.createBorderNode( plotBounds, options.borderStyle );

    // Masks the chart interior so ticks remain visible outside while plot layers render on a white background.
    const tickMaskRectangle = new Rectangle( 0, 0, plotBounds.width, plotBounds.height, {
      fill: PhotoelectricEffectColors.graphTickMaskColorProperty
    } );

    const xAxisLabelText = new RichText( options.xAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.LABEL_FONT,

      // Long strings scale down to the chart width rather than growing the layout.
      maxWidth: plotBounds.width
    } );

    const yAxisLabelText = new RichText( options.yAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.LABEL_FONT,
      rotation: -Math.PI / 2,

      // The label is rotated along the chart's left side, so the text length becomes vertical extent — limit it
      // to the chart height so long strings scale down rather than growing the layout.
      maxWidth: plotBounds.height
    } );

    const tickMarkNode = new Node();
    const tickLabelNode = new Node();

    super( {
      excludeInvisibleChildrenFromBounds: true,
      children: [
        tickMarkNode,
        tickMaskRectangle,
        chartContentNode,
        borderNode,
        tickLabelNode,
        xAxisLabelText,
        yAxisLabelText
      ]
    } );

    // Positions the axis labels outside the ticks, and keeps them anchored when dynamic strings resize them.
    ManualConstraint.create( this, [ xAxisLabelText, yAxisLabelText ], ( xAxisLabelProxy, yAxisLabelProxy ) => {
      xAxisLabelProxy.centerTop = plotBounds.centerBottom.plusXY( 0, AXIS_LABEL_MARGIN + X_AXIS_TICK_LABEL_GUTTER );
      yAxisLabelProxy.rightCenter = plotBounds.leftCenter
        .minusXY( AXIS_LABEL_MARGIN + Y_AXIS_TICK_LABEL_GUTTER, 0 )
        .plusXY( 0, options.yAxisLabelYOffset );
    } );

    this.chartTransform = chartTransform;
    this.gridLineSetNode = gridLineSetNode;
    this.chartContentNode = chartContentNode;
    this.plotLayerNode = plotLayerNode;
    this.tickMarkNode = tickMarkNode;
    this.tickLabelNode = tickLabelNode;
    this.xAxisLabelText = xAxisLabelText;
    this.tickSets = tickSets;
    this.gridLineSets = gridLineSets;
    this.showXLabels = options.showXLabels;
    this.options = options;

    this.updateXAxisVisibility();
  }

  /**
   * Recreates tick and grid sets for the active displayed ranges.
   */
  public setRanges( xRange: Range, yRange: Range ): void {

    // Dispose previous sets after swapping to avoid detached scenery/bamboo nodes lingering in memory.
    const previousTickSets = this.tickSets;
    const previousGridLineSets = this.gridLineSets;

    this.tickSets = GraphPlotAxisSets.createTickSets(
      this.chartTransform,
      xRange,
      yRange,
      this.options.xTickCount,
      this.options.yTickCount,
      this.options.xTickLabelFormatter,
      this.options.yTickLabelFormatter,
      this.options.xTickLabelMode,
      this.options.yTickLabelMode
    );
    this.gridLineSets = GraphPlotAxisSets.createGridLineSets(
      this.chartTransform,
      xRange,
      yRange,
      this.options.xTickCount,
      this.options.yTickCount
    );
    this.gridLineSetNode.children = [
      this.gridLineSets.verticalGridLineSet,
      this.gridLineSets.horizontalGridLineSet
    ];
    this.chartContentNode.children = [ this.gridLineSetNode, this.plotLayerNode ];
    this.updateXAxisVisibility();

    GraphPlotAxisSets.disposeTickSets( previousTickSets );
    GraphPlotAxisSets.disposeGridLineSets( previousGridLineSets );
  }

  /**
   * Shows or hides x-axis tick marks, tick labels, and the axis label.
   */
  public setShowXLabels( showXLabels: boolean ): void {
    if ( this.showXLabels !== showXLabels ) {
      this.showXLabels = showXLabels;
      this.updateXAxisVisibility();
    }
  }

  /**
   * Applies the current x-axis visibility to tick and label nodes.
   */
  private updateXAxisVisibility(): void {
    this.tickMarkNode.children = this.showXLabels ?
      [ this.tickSets.xTickMarkSet, this.tickSets.yTickMarkSet ] :
      [ this.tickSets.yTickMarkSet ];
    this.tickLabelNode.children = this.showXLabels ?
      [ this.tickSets.xTickLabelSet, this.tickSets.yTickLabelSet ] :
      [ this.tickSets.yTickLabelSet ];
    this.xAxisLabelText.visible = this.showXLabels;
  }

  /**
   * Creates the chart border for the requested style.
   */
  private static createBorderNode( plotBounds: Bounds2, borderStyle: BorderStyle ): Node {
    return borderStyle === 'rectangle' ? new Rectangle( plotBounds, {
                                         stroke: PhotoelectricEffectColors.graphBorderStrokeColorProperty,
                                         cornerXRadius: 0,
                                         cornerYRadius: 0
                                       } ) :
           borderStyle === 'line' ? new Line( 0, plotBounds.height, plotBounds.width, plotBounds.height, {
                                    stroke: PhotoelectricEffectColors.graphBorderStrokeColorProperty,
                                    lineWidth: 2
                                  } ) :
           ( () => { throw new Error( `Unrecognized borderStyle: ${borderStyle}` ); } )();
  }

}
