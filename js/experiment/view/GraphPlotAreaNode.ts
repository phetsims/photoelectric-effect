// Copyright 2026, University of Colorado Boulder

/**
 * GraphPlotAreaNode renders the reusable chart region for the experiment graph.
 * It manages chart transform updates from zoom changes, including tick mark and tick label regeneration for each
 * configured y-zoom range.
 *
 * The node focuses on plotting concerns only (grid, masked line plot, optional latest-point scatter marker, ticks,
 * axis labels, and border) so parent components can layer controls and readouts around it.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import LinePlot, { type LinePlotOptions } from '../../../../bamboo/js/LinePlot.js';
import ScatterPlot, { type ScatterPlotOptions } from '../../../../bamboo/js/ScatterPlot.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Color from '../../../../scenery/js/util/Color.js';
import type TColor from '../../../../scenery/js/util/TColor.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import GraphPlotAxisSets, { type GraphPlotGridLineSetGroup, type GraphPlotTickSetGroup } from './GraphPlotAxisSets.js';

// Type to customize the border of the plot.
// rectangle - a full rectangle outlines the chart area
// line - a line along the bottom of the chart area
type BorderStyle = 'rectangle' | 'line';

// Gap between the chart/ticks and axis labels.
const AXIS_LABEL_MARGIN = 6;

// Fixed gutters reserved for tick labels so axis-label placement stays stable across zoom levels.
// TODO: These are hardcoded estimates — if a graph ever produces tick labels wider/taller than these values,
//   axis labels will overlap the ticks. Consider deriving from actual tick label bounds if that happens.
const X_AXIS_TICK_LABEL_GUTTER = 12;
const Y_AXIS_TICK_LABEL_GUTTER = 22;

// Default chart size in view coordinates (experiment screen graphs).
export const EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_WIDTH = 220;
export const EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_HEIGHT = 136;

// Default major tick counts (including min/max endpoints).
const DEFAULT_X_TICK_COUNT = 5;
const DEFAULT_Y_TICK_COUNT = 5;

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

  // Translates model coordinates to chart view coordinates.
  private readonly chartTransform: ChartTransform;

  // Plot rendering for the data set.
  private readonly linePlot: LinePlot;

  // Single-point scatter plot marking the current operating point; omitted when showCurrentPointMarker is false.
  private readonly currentPointPlot: ScatterPlot | null = null;

  // exposed for outer layout, like for buttons or other plots
  public readonly plotBounds: Bounds2;

  // Tick/label groups for the active zoom level; replaced and disposed when zoom changes.
  private tickSets: GraphPlotTickSetGroup;

  // Grid-line sets for the active zoom level; replaced and disposed when zoom changes.
  private gridLineSets: GraphPlotGridLineSetGroup;

  // Updates chart ranges and recreated tick sets when zoom level changes.
  private readonly zoomLevelObserver: ( zoomLevel: number ) => void;

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
      chartViewWidth: EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_WIDTH,
      chartViewHeight: EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_HEIGHT,
      yAxisLabelYOffset: 0,
      xTickLabelFormatter: null,
      yTickLabelFormatter: null,
      xTickCount: DEFAULT_X_TICK_COUNT,
      yTickCount: DEFAULT_Y_TICK_COUNT,
      rangePaddingFraction: 0.05,
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
    this.yZoomRanges = yZoomRanges.slice().sort( ( a, b ) => {
      return a.getLength() - b.getLength();
    } );
    const initialYRange = this.yZoomRanges[ 0 ];

    // Uses axis-specific padding to preserve visual margin with non-square chart aspect ratios.
    const baseRangePaddingFraction = options.rangePaddingFraction;
    const rangePaddingFractionX = baseRangePaddingFraction * chartViewHeight / chartViewWidth;
    const rangePaddingFractionY = baseRangePaddingFraction;

    this.chartTransform = new ChartTransform( {
      viewWidth: chartViewWidth,
      viewHeight: chartViewHeight,
      modelXRange: GraphPlotAreaNode.getPaddedRange( xRange, rangePaddingFractionX ),
      modelYRange: GraphPlotAreaNode.getPaddedRange( initialYRange, rangePaddingFractionY )
    } );

    this.plotBounds = new Bounds2( 0, 0, chartViewWidth, chartViewHeight );

    const borderNode = options.borderStyle === 'rectangle' ? new Rectangle( this.plotBounds, {
      stroke: PhotoelectricEffectColors.graphBorderStrokeColorProperty,
      cornerXRadius: 0,
      cornerYRadius: 0
    } ) : new Line( 0, chartViewHeight, chartViewWidth, chartViewHeight, {
      stroke: PhotoelectricEffectColors.graphBorderStrokeColorProperty,
      lineWidth: 2
    } );

    // Masks the chart interior so ticks remain visible outside while plot layers render on a white background.
    const tickMaskRectangle = new Rectangle( 0, 0, chartViewWidth, chartViewHeight, {
      fill: PhotoelectricEffectColors.graphTickMaskColorProperty
    } );
    const chartContentClipArea = Shape.bounds( this.plotBounds );

    this.gridLineSets = GraphPlotAxisSets.createGridLineSets(
      this.chartTransform,
      xRange,
      initialYRange,
      options.xTickCount,
      options.yTickCount
    );
    const gridLineSetNode = new Node( {
      clipArea: chartContentClipArea,
      children: [
        this.gridLineSets.verticalGridLineSet,
        this.gridLineSets.horizontalGridLineSet
      ]
    } );

    this.linePlot = new LinePlot( this.chartTransform, [], combineOptions<LinePlotOptions>( {}, options.linePlotOptions, {
      stroke: options.fill
    } ) );

    if ( options.showCurrentPointMarker ) {
      this.currentPointPlot = new ScatterPlot( this.chartTransform, [], combineOptions<ScatterPlotOptions>( {}, {
        radius: 4,
        fill: Color.toColor( options.fill ).darkerColor()
      } ) );
    }

    const plotLayer = new Node( {
      clipArea: chartContentClipArea,
      children: this.currentPointPlot ? [ this.linePlot, this.currentPointPlot ] : [ this.linePlot ]
    } );

    const xAxisLabelText = new RichText( options.xAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.READOUT_FONT
    } );

    const yAxisLabelText = new RichText( options.yAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.READOUT_FONT,
      rotation: -Math.PI / 2
    } );

    this.tickSets = GraphPlotAxisSets.createTickSets(
      this.chartTransform,
      xRange,
      initialYRange,
      options.xTickCount,
      options.yTickCount,
      options.xTickLabelFormatter,
      options.yTickLabelFormatter
    );
    GraphPlotAreaNode.updateAxisLabelPositions(
      this.plotBounds,
      options.yAxisLabelYOffset,
      xAxisLabelText,
      yAxisLabelText
    );

    const chartContentNode = new Node( {
      clipArea: chartContentClipArea,
      children: [
        gridLineSetNode,
        plotLayer
      ]
    } );

    const tickMarkNode = new Node( {
      children: options.showXLabels ?
        [ this.tickSets.xTickMarkSet, this.tickSets.yTickMarkSet ] :
        [ this.tickSets.yTickMarkSet ]
    } );

    const tickLabelNode = new Node( {
      children: options.showXLabels ?
        [ this.tickSets.xTickLabelSet, this.tickSets.yTickLabelSet ] :
        [ this.tickSets.yTickLabelSet ]
    } );

    // Layer order keeps ticks outside the clipped chart while data and grid stay within the plot rectangle.
    const chartChildren = [
      tickMarkNode,
      tickMaskRectangle,
      chartContentNode,
      borderNode,
      tickLabelNode
    ];
    if ( options.showXLabels ) {
      chartChildren.push( xAxisLabelText );
    }
    chartChildren.push( yAxisLabelText );

    this.addChild( new Node( {
      children: chartChildren
    } ) );

    this.zoomLevelProperty = new NumberProperty( 1, {
      range: new Range( 1, this.yZoomRanges.length ),
      numberType: 'Integer'
    } );

    this.zoomLevelObserver = ( zoomLevel: number ) => {
      const index = Math.min( Math.max( zoomLevel - 1, 0 ), this.yZoomRanges.length - 1 );
      const yRange = this.yZoomRanges[ index ];
      this.chartTransform.setModelXRange( GraphPlotAreaNode.getPaddedRange( xRange, rangePaddingFractionX ) );
      this.chartTransform.setModelYRange( GraphPlotAreaNode.getPaddedRange( yRange, rangePaddingFractionY ) );

      // Dispose previous sets after swapping to avoid detached scenery/bamboo nodes lingering in memory.
      const previousTickSets = this.tickSets;
      const previousGridLineSets = this.gridLineSets;

      this.tickSets = GraphPlotAxisSets.createTickSets(
        this.chartTransform,
        xRange,
        yRange,
        options.xTickCount,
        options.yTickCount,
        options.xTickLabelFormatter,
        options.yTickLabelFormatter
      );
      this.gridLineSets = GraphPlotAxisSets.createGridLineSets(
        this.chartTransform,
        xRange,
        yRange,
        options.xTickCount,
        options.yTickCount
      );
      gridLineSetNode.children = [ this.gridLineSets.verticalGridLineSet, this.gridLineSets.horizontalGridLineSet ];

      chartContentNode.children = [ gridLineSetNode, plotLayer ];
      tickMarkNode.children = options.showXLabels ?
        [ this.tickSets.xTickMarkSet, this.tickSets.yTickMarkSet ] :
        [ this.tickSets.yTickMarkSet ];
      tickLabelNode.children = options.showXLabels ?
        [ this.tickSets.xTickLabelSet, this.tickSets.yTickLabelSet ] :
        [ this.tickSets.yTickLabelSet ];

      GraphPlotAxisSets.disposeTickSets( previousTickSets );
      GraphPlotAxisSets.disposeGridLineSets( previousGridLineSets );
    };
    this.zoomLevelProperty.lazyLink( this.zoomLevelObserver );
  }

  /**
   * Updates the line plot data set only.
   *
   * Sorting by x ensures line joins/caps render consistently even when the data is captured in
   * interaction order rather than model order.
   *
   * @param dataSet - Model data points in chart coordinates.
   */
  public setLineDataSet( dataSet: Vector2[] ): void {
    const sortedDataSet = dataSet.slice().sort( ( a, b ) => a.x - b.x );
    this.linePlot.setDataSet( sortedDataSet );
  }

  /**
   * Updates the current-point scatter marker when showCurrentPointMarker is true; no-op otherwise.
   *
   * @param point - Model coordinates for the marker, or null to hide it.
   */
  public setCurrentPointMarker( point: Vector2 | null ): void {
    if ( this.currentPointPlot ) {
      this.currentPointPlot.setDataSet( point ? [ point ] : [] );
    }
  }

  /**
   * Chooses the most zoomed-in level that still contains all plotted y-values.
   * This supports both zooming in and out as data is added or cleared.
   *
   * @param dataSet - Revealed points currently shown by the line plot.
   * @param currentPoint - Optional latest-point marker to include in the fit.
   */
  public zoomToFitDataSetY( dataSet: ReadonlyArray<Vector2>, currentPoint: Vector2 | null ): void {
    this.zoomLevelProperty.value = GraphPlotAreaNode.getZoomLevelForDataSetY( this.yZoomRanges, dataSet, currentPoint );
  }

  /**
   * Returns the most zoomed-in level that still contains all plotted y-values.
   * Falls back to the default zoomed-in view when no point data is visible.
   */
  private static getZoomLevelForDataSetY(
    yZoomRanges: Range[],
    dataSet: ReadonlyArray<Vector2>,
    currentPoint: Vector2 | null
  ): number {

    // Track both bounds for forward compatibility.
    // Current experiment graphs are non-negative and use y ranges that start at zero, but checking
    // both min and max keeps this method correct if future graphs include negative values or shifted ranges.
    let minimumYValue = currentPoint ? currentPoint.y : Number.POSITIVE_INFINITY;
    let maximumYValue = currentPoint ? currentPoint.y : Number.NEGATIVE_INFINITY;
    for ( let i = 0; i < dataSet.length; i++ ) {
      minimumYValue = Math.min( minimumYValue, dataSet[ i ].y );
      maximumYValue = Math.max( maximumYValue, dataSet[ i ].y );
    }

    // Defaults to most zoomed-out until we find the tightest fitting preset.
    let updatedZoomLevel = yZoomRanges.length;
    if ( minimumYValue === Number.POSITIVE_INFINITY ) {

      // No data shown yet, so restore the default zoomed-in view.
      updatedZoomLevel = 1;
    }
    else {

      // Loop starting at most zoomed in. If the zoom range fits both data bounds,
      // we can use that zoom range.
      for ( let i = 0; i < yZoomRanges.length; i++ ) {
        if ( yZoomRanges[ i ].contains( minimumYValue ) &&
             yZoomRanges[ i ].contains( maximumYValue ) ) {
          updatedZoomLevel = i + 1;
          break;
        }
      }
    }

    return updatedZoomLevel;
  }

  /**
   * Applies proportional padding around a model range so plotted curves do not sit directly on the
   * chart edge. This adds visual breathing room and keeps line caps from appearing clipped.
   */
  private static getPaddedRange( range: Range, paddingFraction: number ): Range {
    const padding = range.getLength() * paddingFraction;
    return new Range( range.min - padding, range.max + padding );
  }

  /**
   * Positions optional axis labels so they sit outside ticks and track the current tick label bounds.
   */
  private static updateAxisLabelPositions(
    chartBounds: Bounds2,
    yAxisLabelYOffset: number,
    xAxisLabelText: RichText,
    yAxisLabelText: RichText
  ): void {
    xAxisLabelText.centerTop = chartBounds.centerBottom.plusXY( 0, AXIS_LABEL_MARGIN + X_AXIS_TICK_LABEL_GUTTER );
    yAxisLabelText.rightCenter = chartBounds.leftCenter
      .minusXY( AXIS_LABEL_MARGIN + Y_AXIS_TICK_LABEL_GUTTER, 0 )
      .plusXY( 0, yAxisLabelYOffset );
  }
}
