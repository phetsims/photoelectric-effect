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
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LinePlot, { type LinePlotOptions } from '../../../../bamboo/js/LinePlot.js';
import ScatterPlot, { type ScatterPlotOptions } from '../../../../bamboo/js/ScatterPlot.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import type TColor from '../../../../scenery/js/util/TColor.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';

type TickSetGroup = {
  xTickLabelSet: TickLabelSet;
  yTickLabelSet: TickLabelSet;
  xTickMarkSet: TickMarkSet;
  yTickMarkSet: TickMarkSet;
};

// Shared visual style for chart grid lines.
const GRID_LINE_OPTIONS = {
  stroke: 'rgb( 220, 220, 220 )',
  lineDash: [ 4, 4 ]
};

// Gap between the chart/ticks and axis labels.
const AXIS_LABEL_MARGIN = 6;

// Tick mark length extending away from chart edges.
const TICK_MARK_EXTENT = 8;

// Tick mark stroke width.
const TICK_MARK_LINE_WIDTH = 3;

// Default chart size in view coordinates (experiment screen graphs).
export const EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_WIDTH = 220;
export const EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_HEIGHT = 136;

// Font for numeric tick labels on experiment graphs.
const EXPERIMENT_GRAPH_TICK_LABEL_FONT = new PhetFont( 10 );

type GraphPlotAreaSelfOptions = {

  // View size of the plot area in scenery coordinates.
  chartViewWidth?: number;
  chartViewHeight?: number;

  // Optional X-axis label centered beneath the chart. Null hides the label.
  xAxisLabelStringProperty?: TReadOnlyProperty<string> | null;

  // Optional Y-axis label rotated along the left side of the chart. Null hides the label.
  yAxisLabelStringProperty?: TReadOnlyProperty<string> | null;

  // Additional vertical offset applied to the Y-axis label (view coordinates).
  yAxisLabelYOffset?: number;

  // Horizontal grid spacing in model units.
  gridXSpacing?: number;

  // Vertical grid spacing in model units.
  gridYSpacing?: number;

  // Optional formatter for x-axis tick labels.
  xTickLabelFormatter?: null | ( ( value: number ) => string );

  // Optional formatter for y-axis tick labels.
  yTickLabelFormatter?: null | ( ( value: number ) => string );

  // Base fractional padding applied to model ranges to create visual inset.
  rangePaddingFraction?: number;

  // Base color for the data line stroke and the latest-point marker fill (marker is darkened).
  fill?: TColor;

  // Line plot styling overrides (stroke comes from fill above).
  linePlotOptions?: StrictOmit<LinePlotOptions, 'stroke'>;

  // When true, a scatter plot marks the current operating point above the line; when false, no scatter layer is created.
  showCurrentPointMarker?: boolean;
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

  // Chart border; exposed for outer layout (expand button alignment).
  public readonly plotRectangle: Rectangle;

  // Tick/label groups for the active zoom level; replaced and disposed when zoom changes.
  private tickSets: TickSetGroup;

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

    const options = optionize<GraphPlotAreaNodeOptions, GraphPlotAreaSelfOptions, NodeOptions>()( {
      chartViewWidth: EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_WIDTH,
      chartViewHeight: EXPERIMENT_GRAPH_PLOT_AREA_DEFAULT_VIEW_HEIGHT,
      xAxisLabelStringProperty: null,
      yAxisLabelStringProperty: null,
      yAxisLabelYOffset: 0,
      gridXSpacing: 0.2,
      gridYSpacing: 0.2,
      xTickLabelFormatter: null,
      yTickLabelFormatter: null,
      rangePaddingFraction: 0.05,
      fill: 'black',
      linePlotOptions: {
        lineWidth: 6,
        lineCap: 'round',
        lineJoin: 'round'
      },
      showCurrentPointMarker: true,
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

    this.plotRectangle = new Rectangle( 0, 0, chartViewWidth, chartViewHeight, {
      stroke: 'black',
      cornerXRadius: 0,
      cornerYRadius: 0
    } );

    // Masks the chart interior so ticks remain visible outside while plot layers render on a white background.
    const tickMaskRectangle = new Rectangle( 0, 0, chartViewWidth, chartViewHeight, {
      fill: 'white'
    } );
    const chartContentClipArea = this.plotRectangle.getShape();

    // TODO: @design, do we want to adjust the grid lines with zoom?
    const gridLineSet = new Node( {
      clipArea: chartContentClipArea,
      children: [
        new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.gridYSpacing, GRID_LINE_OPTIONS ),
        new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, options.gridXSpacing, GRID_LINE_OPTIONS )
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

    const xAxisLabelText = options.xAxisLabelStringProperty ? new RichText( options.xAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.READOUT_FONT
    } ) : null;

    const yAxisLabelText = options.yAxisLabelStringProperty ? new RichText( options.yAxisLabelStringProperty, {
      font: PhotoelectricEffectConstants.READOUT_FONT,
      rotation: -Math.PI / 2
    } ) : null;

    this.tickSets = GraphPlotAreaNode.createTickSets(
      this.chartTransform,
      xRange,
      initialYRange,
      options.xTickLabelFormatter,
      options.yTickLabelFormatter
    );
    GraphPlotAreaNode.updateAxisLabelPositions(
      this.plotRectangle,
      chartViewHeight,
      options.yAxisLabelYOffset,
      xAxisLabelText,
      yAxisLabelText,
      this.tickSets
    );

    const chartContentNode = new Node( {
      clipArea: chartContentClipArea,
      children: [
        gridLineSet,
        plotLayer
      ]
    } );

    const tickMarkNode = new Node( {
      children: [
        this.tickSets.xTickMarkSet,
        this.tickSets.yTickMarkSet
      ]
    } );

    const tickLabelNode = new Node( {
      children: [
        this.tickSets.xTickLabelSet,
        this.tickSets.yTickLabelSet
      ]
    } );

    // Layer order keeps ticks outside the clipped chart while data and grid stay within the plot rectangle.
    const chartChildren = [
      tickMarkNode,
      tickMaskRectangle,
      chartContentNode,
      this.plotRectangle,
      tickLabelNode
    ];
    if ( xAxisLabelText ) {
      chartChildren.push( xAxisLabelText );
    }
    if ( yAxisLabelText ) {
      chartChildren.push( yAxisLabelText );
    }

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

      this.tickSets = GraphPlotAreaNode.createTickSets(
        this.chartTransform,
        xRange,
        yRange,
        options.xTickLabelFormatter,
        options.yTickLabelFormatter
      );
      chartContentNode.children = [ gridLineSet, plotLayer ];
      tickMarkNode.children = [ this.tickSets.xTickMarkSet, this.tickSets.yTickMarkSet ];
      tickLabelNode.children = [ this.tickSets.xTickLabelSet, this.tickSets.yTickLabelSet ];
      GraphPlotAreaNode.updateAxisLabelPositions(
        this.plotRectangle,
        chartViewHeight,
        options.yAxisLabelYOffset,
        xAxisLabelText,
        yAxisLabelText,
        this.tickSets
      );

      previousTickSets.xTickLabelSet.dispose();
      previousTickSets.yTickLabelSet.dispose();
      previousTickSets.xTickMarkSet.dispose();
      previousTickSets.yTickMarkSet.dispose();
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
    let updatedZoomLevel = this.yZoomRanges.length;
    if ( minimumYValue === Number.POSITIVE_INFINITY ) {

      // No data shown yet, so restore the default zoomed-in view.
      updatedZoomLevel = 1;
    }
    else {

      // Loop starting at most zoomed in. If the zoom range fits both data bounds,
      // we can use that zoom range.
      for ( let i = 0; i < this.yZoomRanges.length; i++ ) {
        if ( this.yZoomRanges[ i ].contains( minimumYValue ) &&
             this.yZoomRanges[ i ].contains( maximumYValue ) ) {
          updatedZoomLevel = i + 1;
          break;
        }
      }
    }

    this.zoomLevelProperty.value = updatedZoomLevel;
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
   * Creates one tick label node for a numeric axis value.
   */
  private static createTickLabel( value: number, formatter: ( ( value: number ) => string ) | null ): Text {

    // Tolerate floating-point noise when deciding whether to display integer formatting.
    const isInteger = Math.abs( value - roundSymmetric( value ) ) < 1e-6;
    const label = formatter ? formatter( value ) : toFixed( value, isInteger ? 0 : 2 );
    return new Text( label, {
      font: EXPERIMENT_GRAPH_TICK_LABEL_FONT
    } );
  }

  /**
   * Creates evenly spaced major tick intervals for a displayed range.
   */
  private static createTickSpacing( range: Range ): number {
    return range.getLength() / 10;
  }

  /**
   * Creates a label factory that only labels the min, midpoint, and max ticks of a range.
   */
  private static createEdgeLabel( range: Range, formatter: ( ( value: number ) => string ) | null ): ( value: number ) => Text | null {
    const min = range.min;
    const max = range.max;
    const mid = range.getCenter();

    // Tolerance avoids missing edge/mid labels due to floating-point rounding in generated tick values.
    const tolerance = Math.max( range.getLength() * 1e-6, 1e-9 );

    return ( value: number ): Text | null => {
      const isEdge = Math.abs( value - min ) <= tolerance ||
                     Math.abs( value - mid ) <= tolerance ||
                     Math.abs( value - max ) <= tolerance;
      return isEdge ? GraphPlotAreaNode.createTickLabel( value, formatter ) : null;
    };
  }

  /**
   * Creates tick marks and labels for both chart axes for one zoom range preset.
   */
  private static createTickSets(
    chartTransform: ChartTransform,
    xRange: Range,
    yRange: Range,
    xTickLabelFormatter: ( ( value: number ) => string ) | null,
    yTickLabelFormatter: ( ( value: number ) => string ) | null
  ): TickSetGroup {
    const xSpacing = GraphPlotAreaNode.createTickSpacing( xRange );
    const ySpacing = GraphPlotAreaNode.createTickSpacing( yRange );

    const xTickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: xRange.min,
      createLabel: GraphPlotAreaNode.createEdgeLabel( xRange, xTickLabelFormatter )
    } );

    const yTickLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: yRange.min,
      createLabel: GraphPlotAreaNode.createEdgeLabel( yRange, yTickLabelFormatter )
    } );

    const xTickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: xRange.min,
      extent: TICK_MARK_EXTENT,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );

    const yTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: yRange.min,
      extent: TICK_MARK_EXTENT,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );

    return {
      xTickLabelSet: xTickLabelSet,
      yTickLabelSet: yTickLabelSet,
      xTickMarkSet: xTickMarkSet,
      yTickMarkSet: yTickMarkSet
    };
  }

  /**
   * Positions optional axis labels so they sit outside ticks and track the current tick label bounds.
   */
  private static updateAxisLabelPositions(
    chartRectangle: Rectangle,
    chartHeight: number,
    yAxisLabelYOffset: number,
    xAxisLabelText: RichText | null,
    yAxisLabelText: RichText | null,
    activeTickSets: TickSetGroup
  ): void {
    const xTickLabelOffset = activeTickSets.xTickLabelSet.bounds.bottom - chartHeight;
    const yTickLabelOffset = -activeTickSets.yTickLabelSet.bounds.left;
    if ( xAxisLabelText ) {
      xAxisLabelText.centerTop = chartRectangle.centerBottom.plusXY( 0, AXIS_LABEL_MARGIN + xTickLabelOffset );
    }
    if ( yAxisLabelText ) {
      yAxisLabelText.rightCenter = chartRectangle.leftCenter
        .minusXY( AXIS_LABEL_MARGIN + yTickLabelOffset, 0 )
        .plusXY( 0, yAxisLabelYOffset );
    }
  }
}
