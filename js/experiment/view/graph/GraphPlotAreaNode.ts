// Copyright 2026, University of Colorado Boulder

/**
 * GraphPlotAreaNode renders the reusable chart region for the experiment graph.
 * It owns the chart transform and zoom level, then delegates axis rendering and data rendering to smaller graph
 * components.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import type { LinePlotOptions } from '../../../../../bamboo/js/LinePlot.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Range from '../../../../../dot/js/Range.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import Node, { type NodeOptions } from '../../../../../scenery/js/nodes/Node.js';
import type TColor from '../../../../../scenery/js/util/TColor.js';
import GraphLayoutConstants from './GraphLayoutConstants.js';
import GraphPlotAxesNode, { type BorderStyle, type TickLabelMode } from './GraphPlotAxesNode.js';
import GraphPlotDataNode from './GraphPlotDataNode.js';
import { getPaddedRange, getZoomLevelForDataSetY, sortYZoomRanges } from './GraphPlotRangeUtils.js';

// Default major tick counts (including min/max endpoints).
const DEFAULT_X_TICK_COUNT = 5;
const DEFAULT_Y_TICK_COUNT = 5;

// Base fractional padding applied to model ranges to create visual inset.
const DEFAULT_RANGE_PADDING_FRACTION = 0.05;

type GraphPlotAreaSelfOptions = {

  // View size of the plot area in scenery coordinates.
  chartViewWidth?: number;
  chartViewHeight?: number;

  // X-axis label centered beneath the chart.
  xAxisLabelStringProperty: TReadOnlyProperty<string>;

  // Y-axis label rotated along the left side of the chart.
  yAxisLabelStringProperty: TReadOnlyProperty<string>;

  // Additional vertical offset applied to the Y-axis label (view coordinates).
  yAxisLabelYOffset?: number;

  // Optional formatter for x-axis tick labels.
  xTickLabelFormatter?: null | ( ( value: number ) => string );

  // Optional formatter for y-axis tick labels.
  yTickLabelFormatter?: null | ( ( value: number ) => string );

  // Controls which x-axis tick marks receive labels.
  xTickLabelMode?: TickLabelMode;

  // Controls which y-axis tick marks receive labels.
  yTickLabelMode?: TickLabelMode;

  // Number of major ticks (including min/max) along the x axis.
  xTickCount?: number;

  // Number of major ticks (including min/max) along the y axis.
  yTickCount?: number;

  // Base fractional padding applied to model ranges to create visual inset.
  rangePaddingFraction?: number;

  // Base color for the data line stroke and the latest-point marker fill (marker is darkened).
  fill?: TColor;

  // Line plot styling overrides (stroke comes from fill above).
  linePlotOptions?: StrictOmit<LinePlotOptions, 'stroke'>;

  // When true, a scatter plot marks the current operating point above the line; when false, no scatter layer is created.
  showCurrentPointMarker?: boolean;

  // Set false to hide all x-axis labels and ticks.
  showXLabels?: boolean;

  // Controls the outline style of the border, see type for more information.
  borderStyle?: BorderStyle;
};

export type GraphPlotAreaNodeOptions = GraphPlotAreaSelfOptions &
  StrictOmit<NodeOptions, 'isDisposable' | 'tandem'>;

export default class GraphPlotAreaNode extends Node {

  // Zoom level that controls the chart's model ranges.
  public readonly zoomLevelProperty: NumberProperty;

  // Exposed for outer layout, like for buttons or other plots.
  public readonly plotBounds: Bounds2;

  // Translates model coordinates to chart view coordinates.
  private readonly chartTransform: ChartTransform;

  // Plot rendering for line data and the current-point marker.
  private readonly graphPlotDataNode: GraphPlotDataNode;

  // Axis, tick, grid, label, and border rendering for the plot area.
  private readonly graphPlotAxesNode: GraphPlotAxesNode;

  // Zoom range presets sorted from most zoomed-in to most zoomed-out.
  private readonly yZoomRanges: Range[];

  /**
   * @param xRange - Shared x-axis domain used for every zoom level.
   * @param yZoomRanges - Y-axis zoom presets. Level 1 is treated as most zoomed-in after sorting by span.
   * @param providedOptions - Visual configuration for labels, grid spacing, line styling, and marker behavior.
   */
  public constructor(
    xRange: Range,
    yZoomRanges: Range[],
    providedOptions: GraphPlotAreaNodeOptions
  ) {

    const options = optionize<
      GraphPlotAreaNodeOptions,
      StrictOmit<GraphPlotAreaSelfOptions, 'xAxisLabelStringProperty' | 'yAxisLabelStringProperty'>,
      NodeOptions
    >()( {
      chartViewWidth: GraphLayoutConstants.PLOT_AREA_DEFAULT_VIEW_WIDTH,
      chartViewHeight: GraphLayoutConstants.PLOT_AREA_DEFAULT_VIEW_HEIGHT,
      yAxisLabelYOffset: 0,
      xTickLabelFormatter: null,
      yTickLabelFormatter: null,
      xTickLabelMode: 'edge',
      yTickLabelMode: 'edge',
      xTickCount: DEFAULT_X_TICK_COUNT,
      yTickCount: DEFAULT_Y_TICK_COUNT,
      rangePaddingFraction: DEFAULT_RANGE_PADDING_FRACTION,
      fill: 'black',
      linePlotOptions: {
        lineWidth: 6,
        lineCap: 'round',
        lineJoin: 'round'
      },
      showCurrentPointMarker: true,
      showXLabels: true,
      borderStyle: 'rectangle',

      isDisposable: false
    }, providedOptions );

    super( options );

    const chartViewWidth = options.chartViewWidth;
    const chartViewHeight = options.chartViewHeight;

    // Keep level 1 as the most zoomed-in preset by ordering ranges from smallest to largest y span.
    // Intentionally ignore x span because zoom behavior is defined only by vertical current range.
    this.yZoomRanges = sortYZoomRanges( yZoomRanges );
    const initialYRange = this.yZoomRanges[ 0 ];

    // Uses axis-specific padding to preserve visual margin with non-square chart aspect ratios.
    const baseRangePaddingFraction = options.rangePaddingFraction;
    const rangePaddingFractionX = baseRangePaddingFraction * chartViewHeight / chartViewWidth;
    const rangePaddingFractionY = baseRangePaddingFraction;

    this.chartTransform = new ChartTransform( {
      viewWidth: chartViewWidth,
      viewHeight: chartViewHeight,
      modelXRange: getPaddedRange( xRange, rangePaddingFractionX ),
      modelYRange: getPaddedRange( initialYRange, rangePaddingFractionY )
    } );

    this.plotBounds = new Bounds2( 0, 0, chartViewWidth, chartViewHeight );

    const chartContentClipArea = Shape.bounds( this.plotBounds );
    const graphPlotDataNode = new GraphPlotDataNode( this.chartTransform, chartContentClipArea, {
      fill: options.fill,
      linePlotOptions: options.linePlotOptions,
      showCurrentPointMarker: options.showCurrentPointMarker
    } );

    const graphPlotAxesNode = new GraphPlotAxesNode(
      this.chartTransform,
      this.plotBounds,
      xRange,
      initialYRange,
      graphPlotDataNode,
      chartContentClipArea,
      {
        xAxisLabelStringProperty: options.xAxisLabelStringProperty,
        yAxisLabelStringProperty: options.yAxisLabelStringProperty,
        yAxisLabelYOffset: options.yAxisLabelYOffset,
        xTickLabelFormatter: options.xTickLabelFormatter,
        yTickLabelFormatter: options.yTickLabelFormatter,
        xTickLabelMode: options.xTickLabelMode,
        yTickLabelMode: options.yTickLabelMode,
        xTickCount: options.xTickCount,
        yTickCount: options.yTickCount,
        showXLabels: options.showXLabels,
        borderStyle: options.borderStyle
      }
    );

    this.graphPlotDataNode = graphPlotDataNode;
    this.graphPlotAxesNode = graphPlotAxesNode;
    this.addChild( graphPlotAxesNode );

    this.zoomLevelProperty = new NumberProperty( 1, {
      range: new Range( 1, this.yZoomRanges.length ),
      numberType: 'Integer'
    } );

    this.zoomLevelProperty.lazyLink( zoomLevel => {
      const index = Math.min( Math.max( zoomLevel - 1, 0 ), this.yZoomRanges.length - 1 );
      const yRange = this.yZoomRanges[ index ];
      this.chartTransform.setModelXRange( getPaddedRange( xRange, rangePaddingFractionX ) );
      this.chartTransform.setModelYRange( getPaddedRange( yRange, rangePaddingFractionY ) );
      this.graphPlotAxesNode.setRanges( xRange, yRange );
    } );
  }

  /**
   * Updates the line plot data set only.
   *
   * @param dataSet - Model data points in chart coordinates.
   */
  public setLineDataSet( dataSet: Vector2[] ): void {
    this.graphPlotDataNode.setLineDataSet( dataSet );
  }

  /**
   * Updates the current-point scatter marker when showCurrentPointMarker is true; no-op otherwise.
   *
   * @param point - Model coordinates for the marker, or null to hide it.
   */
  public setCurrentPointMarker( point: Vector2 | null ): void {
    this.graphPlotDataNode.setCurrentPointMarker( point );
  }

  /**
   * Shows or hides x-axis tick marks, tick labels, and the axis label.
   */
  public setShowXLabels( showXLabels: boolean ): void {
    this.graphPlotAxesNode.setShowXLabels( showXLabels );
  }

  /**
   * Converts a model x value to the plot's local view coordinate.
   */
  public modelToViewX( x: number ): number {
    return this.chartTransform.modelToViewX( x );
  }

  /**
   * Converts a model x delta to a view-coordinate delta.
   */
  public modelToViewDeltaX( deltaX: number ): number {
    return this.chartTransform.modelToViewDeltaX( deltaX );
  }

  /**
   * Converts a view-coordinate x delta to a model delta.
   */
  public viewToModelDeltaX( deltaX: number ): number {
    return this.chartTransform.viewToModelDeltaX( deltaX );
  }

  /**
   * Chooses the most zoomed-in level that still contains all plotted y-values.
   * This supports both zooming in and out as data is added or cleared.
   *
   * @param dataSet - Revealed points currently shown by the line plot.
   * @param currentPoint - Optional latest-point marker to include in the fit.
   */
  public zoomToFitDataSetY( dataSet: ReadonlyArray<Vector2>, currentPoint: Vector2 | null ): void {
    this.zoomLevelProperty.value = getZoomLevelForDataSetY( this.yZoomRanges, dataSet, currentPoint );
  }
}
