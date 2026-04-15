// Copyright 2026, University of Colorado Boulder

/**
 * Renders the experiment chart only: grid, masked line plot, ticks, axis labels, and border. Used inside
 * ExperimentGraphNode and in snapshot dialogs. Owns ChartTransform and zoomLevelProperty for model range presets.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LinePlot, { type LinePlotOptions } from '../../../../bamboo/js/LinePlot.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export type ZoomRangePair = {
  xRange: Range;
  yRange: Range;
};

type TickSetGroup = {
  xTickLabelSet: TickLabelSet;
  yTickLabelSet: TickLabelSet;
  xTickMarkSet: TickMarkSet;
  yTickMarkSet: TickMarkSet;
};

const GRID_LINE_OPTIONS = {
  stroke: 'rgb( 220, 220, 220 )',
  lineDash: [ 4, 4 ]
};
const AXIS_LABEL_FONT = new PhetFont( 12 );
const AXIS_LABEL_MARGIN = 6;
const TICK_LABEL_FONT = new PhetFont( 10 );
const TICK_MARK_EXTENT = 8;
const TICK_MARK_LINE_WIDTH = 3;

// Default chart size in view coordinates (experiment screen graphs).
export const EXPERIMENT_CHART_DEFAULT_VIEW_WIDTH = 220;
export const EXPERIMENT_CHART_DEFAULT_VIEW_HEIGHT = 136;

type ExperimentChartPlotSelfOptions = {

  // View size of the plot area in scenery coordinates.
  chartViewWidth?: number;
  chartViewHeight?: number;

  // 1-based index into zoomRangePairs for the initial model ranges.
  initialZoomLevel?: number;

  // Zoom presets mapped to zoomLevelProperty (1-based).
  zoomRangePairs?: ZoomRangePair[];

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

  // Line plot styling overrides.
  linePlotOptions?: LinePlotOptions;
};

export type ExperimentChartPlotNodeOptions = ExperimentChartPlotSelfOptions & NodeOptions;

export default class ExperimentChartPlotNode extends Node {

  // Zoom level that controls the chart's model ranges.
  public readonly zoomLevelProperty: NumberProperty;

  // Translates model coordinates to chart view coordinates.
  private readonly chartTransform: ChartTransform;

  // Plot rendering for the data set.
  private readonly linePlot: LinePlot;

  // Chart border; exposed for outer layout (expand button alignment).
  public readonly chartRectangle: Rectangle;

  // Tick/label groups for the active zoom level; disposed when zoom changes or this node is disposed.
  private tickSets: TickSetGroup;

  // Unlinks zoomLevelProperty listener on dispose.
  private readonly zoomLevelObserver: ( zoomLevel: number ) => void;

  public constructor( providedOptions: ExperimentChartPlotNodeOptions ) {

    const options = optionize<ExperimentChartPlotNodeOptions, ExperimentChartPlotSelfOptions, NodeOptions>()( {
      chartViewWidth: EXPERIMENT_CHART_DEFAULT_VIEW_WIDTH,
      chartViewHeight: EXPERIMENT_CHART_DEFAULT_VIEW_HEIGHT,
      initialZoomLevel: 1,
      zoomRangePairs: [ {
        xRange: new Range( 0, 1 ),
        yRange: new Range( 0, 1 )
      } ],
      xAxisLabelStringProperty: null,
      yAxisLabelStringProperty: null,
      yAxisLabelYOffset: 0,
      gridXSpacing: 0.2,
      gridYSpacing: 0.2,
      xTickLabelFormatter: null,
      yTickLabelFormatter: null,
      rangePaddingFraction: 0.05,
      linePlotOptions: {
        lineWidth: 6,
        lineCap: 'round'
      },
      tandem: Tandem.OPT_OUT,
      isDisposable: false
    }, providedOptions );

    super( combineOptions<NodeOptions>( {}, options, {
      tandem: Tandem.OPT_OUT
    } ) );

    const chartViewWidth = options.chartViewWidth;
    const chartViewHeight = options.chartViewHeight;
    const zoomRangePairs = options.zoomRangePairs;
    const initialZoomLevel = options.initialZoomLevel;
    const initialRangeIndex = Math.min( Math.max( initialZoomLevel - 1, 0 ), zoomRangePairs.length - 1 );
    const initialRangePair = zoomRangePairs[ initialRangeIndex ];

    const baseRangePaddingFraction = options.rangePaddingFraction;
    const rangePaddingFractionX = baseRangePaddingFraction * chartViewHeight / chartViewWidth;
    const rangePaddingFractionY = baseRangePaddingFraction;

    this.chartTransform = new ChartTransform( {
      viewWidth: chartViewWidth,
      viewHeight: chartViewHeight,
      modelXRange: ExperimentChartPlotNode.getPaddedRange( initialRangePair.xRange, rangePaddingFractionX ),
      modelYRange: ExperimentChartPlotNode.getPaddedRange( initialRangePair.yRange, rangePaddingFractionY )
    } );

    this.chartRectangle = new Rectangle( 0, 0, chartViewWidth, chartViewHeight, {
      stroke: 'black',
      cornerXRadius: 0,
      cornerYRadius: 0
    } );

    // Masks the chart interior so ticks remain visible outside while plot layers render on a white background.
    const tickMaskRectangle = new Rectangle( 0, 0, chartViewWidth, chartViewHeight, {
      fill: 'white'
    } );
    const chartContentClipArea = this.chartRectangle.getShape();
    const gridLineSet = new Node( {
      clipArea: chartContentClipArea,
      children: [
        new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.gridYSpacing, GRID_LINE_OPTIONS ),
        new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, options.gridXSpacing, GRID_LINE_OPTIONS )
      ]
    } );

    this.linePlot = new LinePlot( this.chartTransform, [], combineOptions<LinePlotOptions>( {
      stroke: 'black',
      lineWidth: 2
    }, options.linePlotOptions ) );

    const plotLayer = new Node( {
      clipArea: chartContentClipArea,
      children: [ this.linePlot ]
    } );

    const xAxisLabelText = options.xAxisLabelStringProperty ? new RichText( options.xAxisLabelStringProperty, {
      font: AXIS_LABEL_FONT
    } ) : null;

    const yAxisLabelText = options.yAxisLabelStringProperty ? new RichText( options.yAxisLabelStringProperty, {
      font: AXIS_LABEL_FONT,
      rotation: -Math.PI / 2
    } ) : null;

    this.tickSets = ExperimentChartPlotNode.createTickSets(
      this.chartTransform,
      initialRangePair,
      options.xTickLabelFormatter,
      options.yTickLabelFormatter
    );
    ExperimentChartPlotNode.updateAxisLabelPositions(
      this.chartRectangle,
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

    const chartChildren = [
      tickMarkNode,
      tickMaskRectangle,
      chartContentNode,
      this.chartRectangle,
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

    this.zoomLevelProperty = new NumberProperty( initialZoomLevel, {
      range: new Range( 1, zoomRangePairs.length ),
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'zoomLevelProperty' )
    } );

    this.zoomLevelObserver = ( zoomLevel: number ) => {
      const index = Math.min( Math.max( zoomLevel - 1, 0 ), zoomRangePairs.length - 1 );
      const rangePair = zoomRangePairs[ index ];
      this.chartTransform.setModelXRange( ExperimentChartPlotNode.getPaddedRange( rangePair.xRange, rangePaddingFractionX ) );
      this.chartTransform.setModelYRange( ExperimentChartPlotNode.getPaddedRange( rangePair.yRange, rangePaddingFractionY ) );

      const previousTickSets = this.tickSets;

      this.tickSets = ExperimentChartPlotNode.createTickSets(
        this.chartTransform,
        rangePair,
        options.xTickLabelFormatter,
        options.yTickLabelFormatter
      );
      chartContentNode.children = [ gridLineSet, plotLayer ];
      tickMarkNode.children = [ this.tickSets.xTickMarkSet, this.tickSets.yTickMarkSet ];
      tickLabelNode.children = [ this.tickSets.xTickLabelSet, this.tickSets.yTickLabelSet ];
      ExperimentChartPlotNode.updateAxisLabelPositions(
        this.chartRectangle,
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
   * Updates the line plot data set.
   *
   * Sorting by x ensures line joins/caps render consistently even when the data is captured in
   * interaction order rather than model order.
   *
   * @param dataSet - Model data points in chart coordinates.
   */
  public setDataSet( dataSet: Vector2[] ): void {
    const sortedDataSet = dataSet.slice().sort( ( a, b ) => a.x - b.x );

    this.linePlot.setDataSet( sortedDataSet );
  }

  public override dispose(): void {
    if ( this.isDisposed ) {
      return;
    }

    this.zoomLevelProperty.unlink( this.zoomLevelObserver );
    this.zoomLevelProperty.dispose();

    // Detached below so bamboo/scenery nodes (LinePlot, tick sets, RichText, etc.) dispose fully.
    const detachedChildren = this.getChildren();

    super.dispose();

    for ( let i = 0; i < detachedChildren.length; i++ ) {
      detachedChildren[ i ].disposeSubtree();
    }
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
      font: TICK_LABEL_FONT
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
      return isEdge ? ExperimentChartPlotNode.createTickLabel( value, formatter ) : null;
    };
  }

  /**
   * Creates tick marks and labels for both chart axes for one zoom range pair.
   */
  private static createTickSets(
    chartTransform: ChartTransform,
    rangePair: ZoomRangePair,
    xTickLabelFormatter: ( ( value: number ) => string ) | null,
    yTickLabelFormatter: ( ( value: number ) => string ) | null
  ): TickSetGroup {
    const xSpacing = ExperimentChartPlotNode.createTickSpacing( rangePair.xRange );
    const ySpacing = ExperimentChartPlotNode.createTickSpacing( rangePair.yRange );

    const xTickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: rangePair.xRange.min,
      createLabel: ExperimentChartPlotNode.createEdgeLabel( rangePair.xRange, xTickLabelFormatter )
    } );

    const yTickLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: rangePair.yRange.min,
      createLabel: ExperimentChartPlotNode.createEdgeLabel( rangePair.yRange, yTickLabelFormatter )
    } );

    const xTickMarkSet = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: rangePair.xRange.min,
      extent: TICK_MARK_EXTENT,
      lineWidth: TICK_MARK_LINE_WIDTH
    } );

    const yTickMarkSet = new TickMarkSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: rangePair.yRange.min,
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
