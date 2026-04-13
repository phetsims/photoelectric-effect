// Copyright 2026, University of Colorado Boulder

/**
 * ExperimentGraphNode renders a shared chart layout for Experiment screen graphs, including the
 * expandable frame, grid lines, and the right-side action button column. It owns the chart transform
 * and zoom level state so subclasses can define model ranges even before any zoom UI is attached.
 * It also exposes a single entry point for updating the plotted data set.
 *
 * Layering is intentionally split so the chart frame and ticks can render outside the plot region while a mask keeps
 * the plot interior white: tick marks render first, then a mask rectangle, then clipped plot content, then the
 * chart border and tick labels.
 *
 * This plot is not disposable, we expect it to live for the life of the simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LinePlot, { type LinePlotOptions } from '../../../../bamboo/js/LinePlot.js';
import TickLabelSet from '../../../../bamboo/js/TickLabelSet.js';
import TickMarkSet from '../../../../bamboo/js/TickMarkSet.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import CameraButton, { CameraButtonOptions } from '../../../../scenery-phet/js/buttons/CameraButton.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import TrashButton, { type TrashButtonOptions } from '../../../../scenery-phet/js/buttons/TrashButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import expandSolidShape from '../../../../sherpa/js/fontawesome-5/expandSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import type GraphData from '../model/GraphData.js';

// constants
type ZoomRangePair = {
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

// Chart layout constants for Experiment graphs.
const EXPERIMENT_GRAPH_CHART_WIDTH = 220;
const EXPERIMENT_GRAPH_CHART_HEIGHT = 136;
const EXPERIMENT_GRAPH_BUTTON_COLUMN_SPACING = 10;
const EXPERIMENT_GRAPH_BUTTON_SPACING = 8;
const EXPERIMENT_GRAPH_BUTTON_WIDTH = 28;
const EXPERIMENT_GRAPH_BUTTON_HEIGHT = 20;
const EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN = 3;
const EXPERIMENT_GRAPH_EXPAND_BUTTON_LEFT_OFFSET = 6;

type SelfOptions = {

  // Zoom presets mapped to the zoomLevelProperty (1-based).
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

export type ExperimentGraphNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class ExperimentGraphNode extends Node {

  public static readonly EXPERIMENT_GRAPH_SPACING = 12;

  // Zoom level that controls the chart's model ranges.
  // TODO: Zoom is not implemented yet, see https://github.com/phetsims/photoelectric-effect/issues/12
  public readonly zoomLevelProperty: NumberProperty;

  // Whether the chart content row is visible.
  private readonly expandedProperty: BooleanProperty;

  // Translates model coordinates to chart view coordinates.
  private readonly chartTransform: ChartTransform;

  // Plot rendering for the data set.
  private readonly linePlot: LinePlot;

  /**
   * @param graphData - Model-owned samples; this node redraws when dataChangedEmitter fires.
   * @param providedOptions - Configuration for axis ranges, labels, styling, and instrumentation.
   */
  public constructor( graphData: GraphData, providedOptions: ExperimentGraphNodeOptions ) {

    const options = optionize<ExperimentGraphNodeOptions, SelfOptions, NodeOptions>()( {
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

      // We expect these plots to exist for the life of the simulation.
      isDisposable: false
    }, providedOptions );

    const tandem = options.tandem;

    super( options );

    const zoomRangePairs = options.zoomRangePairs;
    this.expandedProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'expandedProperty' )
    } );
    this.zoomLevelProperty = new NumberProperty( 1, {
      range: new Range( 1, zoomRangePairs.length ),
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'zoomLevelProperty' )
    } );

    const baseRangePaddingFraction = options.rangePaddingFraction;
    const rangePaddingFractionX = baseRangePaddingFraction * EXPERIMENT_GRAPH_CHART_HEIGHT / EXPERIMENT_GRAPH_CHART_WIDTH;
    const rangePaddingFractionY = baseRangePaddingFraction;

    this.chartTransform = new ChartTransform( {
      viewWidth: EXPERIMENT_GRAPH_CHART_WIDTH,
      viewHeight: EXPERIMENT_GRAPH_CHART_HEIGHT,
      modelXRange: ExperimentGraphNode.getPaddedRange( zoomRangePairs[ 0 ].xRange, rangePaddingFractionX ),
      modelYRange: ExperimentGraphNode.getPaddedRange( zoomRangePairs[ 0 ].yRange, rangePaddingFractionY )
    } );

    const chartRectangle = new Rectangle( 0, 0, EXPERIMENT_GRAPH_CHART_WIDTH, EXPERIMENT_GRAPH_CHART_HEIGHT, {
      stroke: 'black',
      cornerXRadius: 0,
      cornerYRadius: 0
    } );
    // Masks the chart interior so ticks remain visible outside while plot layers render on a white background.
    const tickMaskRectangle = new Rectangle( 0, 0, EXPERIMENT_GRAPH_CHART_WIDTH, EXPERIMENT_GRAPH_CHART_HEIGHT, {
      fill: 'white'
    } );
    const chartContentClipArea = chartRectangle.getShape();
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

    let tickSets: TickSetGroup;

    tickSets = ExperimentGraphNode.createTickSets(
      this.chartTransform,
      zoomRangePairs[ 0 ],
      options.xTickLabelFormatter,
      options.yTickLabelFormatter
    );
    ExperimentGraphNode.updateAxisLabelPositions(
      chartRectangle,
      EXPERIMENT_GRAPH_CHART_HEIGHT,
      options.yAxisLabelYOffset,
      xAxisLabelText,
      yAxisLabelText,
      tickSets
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
        tickSets.xTickMarkSet,
        tickSets.yTickMarkSet
      ]
    } );

    const tickLabelNode = new Node( {
      children: [
        tickSets.xTickLabelSet,
        tickSets.yTickLabelSet
      ]
    } );

    const chartChildren = [
      tickMarkNode,
      tickMaskRectangle,
      chartContentNode,
      chartRectangle,
      tickLabelNode
    ];
    if ( xAxisLabelText ) {
      chartChildren.push( xAxisLabelText );
    }
    if ( yAxisLabelText ) {
      chartChildren.push( yAxisLabelText );
    }

    const chartNode = new Node( {
      children: chartChildren
    } );

    const expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 18,
      left: chartRectangle.left +
            EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN -
            EXPERIMENT_GRAPH_EXPAND_BUTTON_LEFT_OFFSET,
      top: chartRectangle.top + EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN,
      tandem: options.tandem.createTandem( 'expandCollapseButton' )
    } );

    const actionButtonSideLength = Math.max(
      EXPERIMENT_GRAPH_BUTTON_WIDTH,
      EXPERIMENT_GRAPH_BUTTON_HEIGHT
    );
    const actionButtonOptions: RectangularPushButtonOptions = {
      size: new Dimension2( actionButtonSideLength, actionButtonSideLength ),
      baseColor: 'white',
      xMargin: 6,
      yMargin: 6
    };

    const infoButton = new InfoButton( {
      radius: actionButtonSideLength / 2,
      baseColor: 'white',
      xMargin: actionButtonOptions.xMargin,
      yMargin: actionButtonOptions.yMargin,
      tandem: options.tandem.createTandem( 'infoButton' )
    } );

    const trashButton = new TrashButton( combineOptions<TrashButtonOptions>( {}, actionButtonOptions, {
      listener: () => graphData.clear(),
      tandem: options.tandem.createTandem( 'actionButton3' )
    } ) );

    const buttonColumn = new VBox( {
      spacing: EXPERIMENT_GRAPH_BUTTON_SPACING,
      align: 'center',
      children: [
        new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {}, actionButtonOptions, {
          content: new Path( expandSolidShape, {
            fill: 'black',
            scale: 0.7
          } ),
          tandem: options.tandem.createTandem( 'actionButton1' )
        } ) ),
        new CameraButton( combineOptions<CameraButtonOptions>( {}, actionButtonOptions, {
          tandem: tandem.createTandem( 'actionButton2' )
        } ) ),
        infoButton,
        trashButton
      ]
    } );

    const contentRow = new HBox( {
      spacing: EXPERIMENT_GRAPH_BUTTON_COLUMN_SPACING,
      align: 'top',
      children: [
        chartNode,
        buttonColumn
      ]
    } );
    this.addChild( contentRow );
    this.addChild( expandCollapseButton );

    const expandedObserver = ( expanded: boolean ) => {
      contentRow.visible = expanded;
    };
    this.expandedProperty.link( expandedObserver );

    // TODO: Untested, see https://github.com/phetsims/photoelectric-effect/issues/12
    const zoomLevelObserver = ( zoomLevel: number ) => {
      const index = Math.min( Math.max( zoomLevel - 1, 0 ), zoomRangePairs.length - 1 );
      const rangePair = zoomRangePairs[ index ];
      this.chartTransform.setModelXRange( ExperimentGraphNode.getPaddedRange( rangePair.xRange, rangePaddingFractionX ) );
      this.chartTransform.setModelYRange( ExperimentGraphNode.getPaddedRange( rangePair.yRange, rangePaddingFractionY ) );

      const previousTickSets = tickSets;

      tickSets = ExperimentGraphNode.createTickSets(
        this.chartTransform,
        rangePair,
        options.xTickLabelFormatter,
        options.yTickLabelFormatter
      );
      chartContentNode.children = [ gridLineSet, plotLayer ];
      tickMarkNode.children = [ tickSets.xTickMarkSet, tickSets.yTickMarkSet ];
      tickLabelNode.children = [ tickSets.xTickLabelSet, tickSets.yTickLabelSet ];
      ExperimentGraphNode.updateAxisLabelPositions(
        chartRectangle,
        EXPERIMENT_GRAPH_CHART_HEIGHT,
        options.yAxisLabelYOffset,
        xAxisLabelText,
        yAxisLabelText,
        tickSets
      );

      previousTickSets.xTickLabelSet.dispose();
      previousTickSets.yTickLabelSet.dispose();
      previousTickSets.xTickMarkSet.dispose();
      previousTickSets.yTickMarkSet.dispose();
    };
    this.zoomLevelProperty.link( zoomLevelObserver );

    const syncLinePlot = () => {
      this.setDataSet( [ ...graphData.getDataPoints() ] );
    };
    graphData.dataChangedEmitter.addListener( syncLinePlot );
    syncLinePlot();
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
   *
   * Uses integer formatting when the value is sufficiently close to an integer to avoid noisy labels
   * from floating-point arithmetic.
   *
   * @param value - Tick value in model units.
   * @param formatter - Optional custom label formatter. Null uses built-in numeric formatting.
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
   *
   * @param range - Displayed model range for an axis.
   * @returns Spacing in model units between adjacent ticks.
   */
  private static createTickSpacing( range: Range ): number {
    return range.getLength() / 10;
  }

  /**
   * Creates a label factory that only labels the min, midpoint, and max ticks of a range.
   *
   * This keeps the chart readable while still showing key reference values.
   *
   * @param range - Displayed model range for the axis being labeled.
   * @param formatter - Optional custom label formatter. Null uses built-in numeric formatting.
   * @returns Callback used by TickLabelSet to create labels or suppress intermediate ticks.
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
      return isEdge ? ExperimentGraphNode.createTickLabel( value, formatter ) : null;
    };
  }

  /**
   * Creates tick marks and labels for both chart axes for one zoom range pair.
   *
   * @param chartTransform - Shared chart transform mapping model/view coordinates.
   * @param rangePair - Active model ranges for x and y axes.
   * @param xTickLabelFormatter - Optional x-axis label formatter.
   * @param yTickLabelFormatter - Optional y-axis label formatter.
   * @returns Group containing all tick nodes for the active zoom level.
   */
  private static createTickSets(
    chartTransform: ChartTransform,
    rangePair: ZoomRangePair,
    xTickLabelFormatter: ( ( value: number ) => string ) | null,
    yTickLabelFormatter: ( ( value: number ) => string ) | null
  ): TickSetGroup {
    const xSpacing = ExperimentGraphNode.createTickSpacing( rangePair.xRange );
    const ySpacing = ExperimentGraphNode.createTickSpacing( rangePair.yRange );

    const xTickLabelSet = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, xSpacing, {
      edge: 'min',
      origin: rangePair.xRange.min,
      createLabel: ExperimentGraphNode.createEdgeLabel( rangePair.xRange, xTickLabelFormatter )
    } );

    const yTickLabelSet = new TickLabelSet( chartTransform, Orientation.VERTICAL, ySpacing, {
      edge: 'min',
      origin: rangePair.yRange.min,
      createLabel: ExperimentGraphNode.createEdgeLabel( rangePair.yRange, yTickLabelFormatter )
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
   *
   * @param chartRectangle - Chart border rectangle used as the anchoring reference.
   * @param chartHeight - Chart height in view coordinates.
   * @param yAxisLabelYOffset - Additional vertical offset for y-axis label fine tuning.
   * @param xAxisLabelText - Optional x-axis label node.
   * @param yAxisLabelText - Optional y-axis label node.
   * @param activeTickSets - Tick nodes for the active zoom level.
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