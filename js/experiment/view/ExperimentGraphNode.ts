// Copyright 2026, University of Colorado Boulder

/**
 * ExperimentGraphNode renders a shared chart layout for Experiment screen graphs, including the
 * expandable frame, grid lines, and the right-side action button column. It owns the chart transform
 * and zoom level state so subclasses can define model ranges even before any zoom UI is attached.
 * It also exposes a single entry point for updating the plotted data set.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyEmitter } from '../../../../axon/js/TEmitter.js';
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
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
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
import Tandem from '../../../../tandem/js/Tandem.js';

type ZoomRangePair = {
  xRange: Range;
  yRange: Range;
};

type SelfOptions = {

  // Initial data set for the line plot.
  dataSet?: Vector2[];

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

export type ExperimentGraphNodeOptions = SelfOptions & NodeOptions;

export default class ExperimentGraphNode extends Node {

  // Chart layout constants for Experiment graphs.
  public static readonly EXPERIMENT_GRAPH_CHART_WIDTH = 220;
  public static readonly EXPERIMENT_GRAPH_CHART_HEIGHT = 136;
  public static readonly EXPERIMENT_GRAPH_SPACING = 12;
  public static readonly EXPERIMENT_GRAPH_BUTTON_COLUMN_SPACING = 10;
  public static readonly EXPERIMENT_GRAPH_BUTTON_SPACING = 8;
  public static readonly EXPERIMENT_GRAPH_BUTTON_WIDTH = 28;
  public static readonly EXPERIMENT_GRAPH_BUTTON_HEIGHT = 20;
  public static readonly EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN = 3;
  public static readonly EXPERIMENT_GRAPH_EXPAND_BUTTON_LEFT_OFFSET = 6;

  // Zoom level that controls the chart's model ranges.
  public readonly zoomLevelProperty: NumberProperty;

  // Whether the chart content row is visible.
  private readonly expandedProperty: BooleanProperty;

  // Translates model coordinates to chart view coordinates.
  private readonly chartTransform: ChartTransform;

  // Plot rendering for the current data set.
  private readonly linePlot: LinePlot;

  // Disposes listeners and owned resources.
  private readonly disposeExperimentGraphNode: () => void;

  public constructor( resetEmitter: TReadOnlyEmitter, providedOptions?: ExperimentGraphNodeOptions ) {

    const options = optionize<ExperimentGraphNodeOptions, SelfOptions, NodeOptions>()( {
      dataSet: [],
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
      tandem: Tandem.REQUIRED
    }, providedOptions );

    affirm( options.tandem, 'Tandem is required for type checking.' );
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

    const chartWidth = ExperimentGraphNode.EXPERIMENT_GRAPH_CHART_WIDTH;
    const chartHeight = ExperimentGraphNode.EXPERIMENT_GRAPH_CHART_HEIGHT;

    const baseRangePaddingFraction = options.rangePaddingFraction;
    const rangePaddingFractionX = baseRangePaddingFraction * chartHeight / chartWidth;
    const rangePaddingFractionY = baseRangePaddingFraction;

    const getPaddedRange = ( range: Range, paddingFraction: number ): Range => {
      const padding = range.getLength() * paddingFraction;
      return new Range( range.min - padding, range.max + padding );
    };

    const chartTransform = new ChartTransform( {
      viewWidth: chartWidth,
      viewHeight: chartHeight,
      modelXRange: getPaddedRange( zoomRangePairs[ 0 ].xRange, rangePaddingFractionX ),
      modelYRange: getPaddedRange( zoomRangePairs[ 0 ].yRange, rangePaddingFractionY )
    } );
    this.chartTransform = chartTransform;

    const chartRectangle = new Rectangle( 0, 0, chartWidth, chartHeight, {
      stroke: 'black',
      cornerXRadius: 0,
      cornerYRadius: 0
    } );
    const tickMaskRectangle = new Rectangle( 0, 0, chartWidth, chartHeight, {
      fill: 'white'
    } );

    const gridLineOptions = {
      stroke: 'rgb( 220, 220, 220 )',
      lineDash: [ 4, 4 ]
    };
    const chartContentClipArea = chartRectangle.getShape();
    const gridLineSet = new Node( {
      clipArea: chartContentClipArea,
      children: [
        new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.gridYSpacing, gridLineOptions ),
        new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, options.gridXSpacing, gridLineOptions )
      ]
    } );

    this.linePlot = new LinePlot( this.chartTransform, options.dataSet, combineOptions<LinePlotOptions>( {
      stroke: 'black',
      lineWidth: 2
    }, options.linePlotOptions ) );

    const plotLayer = new Node( {
      clipArea: chartContentClipArea,
      children: [ this.linePlot ]
    } );

    const axisLabelFont = new PhetFont( 12 );
    const axisLabelMargin = 6;
    const tickLabelFont = new PhetFont( 10 );

    const createTickLabel = ( value: number, formatter: ( ( value: number ) => string ) | null ): Text => {
      const isInteger = Math.abs( value - roundSymmetric( value ) ) < 1e-6;
      const label = formatter ? formatter( value ) : toFixed( value, isInteger ? 0 : 2 );
      return new Text( label, {
        font: tickLabelFont
      } );
    };

    const xAxisLabelText = options.xAxisLabelStringProperty ? new RichText( options.xAxisLabelStringProperty, {
      font: axisLabelFont
    } ) : null;

    const yAxisLabelText = options.yAxisLabelStringProperty ? new RichText( options.yAxisLabelStringProperty, {
      font: axisLabelFont,
      rotation: -Math.PI / 2
    } ) : null;

    const createTickSpacing = ( range: Range ): number => {
      return range.getLength() / 10;
    };

    const createEdgeLabel = ( range: Range, formatter: ( ( value: number ) => string ) | null ) => {
      const min = range.min;
      const max = range.max;
      const mid = range.getCenter();
      const tolerance = Math.max( range.getLength() * 1e-6, 1e-9 );

      return ( value: number ): Text | null => {
        const isEdge = Math.abs( value - min ) <= tolerance ||
                       Math.abs( value - mid ) <= tolerance ||
                       Math.abs( value - max ) <= tolerance;
        return isEdge ? createTickLabel( value, formatter ) : null;
      };
    };

    const tickMarkExtent = 8;
    const tickMarkLineWidth = 3;

    type TickSetGroup = {
      xTickLabelSet: TickLabelSet;
      yTickLabelSet: TickLabelSet;
      xTickMarkSet: TickMarkSet;
      yTickMarkSet: TickMarkSet;
    };

    let tickSets: TickSetGroup;

    const createTickSets = ( rangePair: ZoomRangePair ): TickSetGroup => {
      const xSpacing = createTickSpacing( rangePair.xRange );
      const ySpacing = createTickSpacing( rangePair.yRange );

      const xTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.HORIZONTAL, xSpacing, {
        edge: 'min',
        origin: rangePair.xRange.min,
        createLabel: createEdgeLabel( rangePair.xRange, options.xTickLabelFormatter )
      } );

      const yTickLabelSet = new TickLabelSet( this.chartTransform, Orientation.VERTICAL, ySpacing, {
        edge: 'min',
        origin: rangePair.yRange.min,
        createLabel: createEdgeLabel( rangePair.yRange, options.yTickLabelFormatter )
      } );

      const xTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.HORIZONTAL, xSpacing, {
        edge: 'min',
        origin: rangePair.xRange.min,
        extent: tickMarkExtent,
        lineWidth: tickMarkLineWidth
      } );

      const yTickMarkSet = new TickMarkSet( this.chartTransform, Orientation.VERTICAL, ySpacing, {
        edge: 'min',
        origin: rangePair.yRange.min,
        extent: tickMarkExtent,
        lineWidth: tickMarkLineWidth
      } );

      return {
        xTickLabelSet: xTickLabelSet,
        yTickLabelSet: yTickLabelSet,
        xTickMarkSet: xTickMarkSet,
        yTickMarkSet: yTickMarkSet
      };
    };

    const updateAxisLabelPositions = ( activeTickSets: TickSetGroup ) => {
      const xTickLabelOffset = activeTickSets.xTickLabelSet.bounds.bottom - chartHeight;
      const yTickLabelOffset = -activeTickSets.yTickLabelSet.bounds.left;
      if ( xAxisLabelText ) {
        xAxisLabelText.centerTop = chartRectangle.centerBottom.plusXY( 0, axisLabelMargin + xTickLabelOffset );
      }
      if ( yAxisLabelText ) {
        yAxisLabelText.rightCenter = chartRectangle.leftCenter
          .minusXY( axisLabelMargin + yTickLabelOffset, 0 )
          .plusXY( 0, options.yAxisLabelYOffset );
      }
    };

    tickSets = createTickSets( zoomRangePairs[ 0 ] );
    updateAxisLabelPositions( tickSets );

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
            ExperimentGraphNode.EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN -
            ExperimentGraphNode.EXPERIMENT_GRAPH_EXPAND_BUTTON_LEFT_OFFSET,
      top: chartRectangle.top + ExperimentGraphNode.EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN,
      tandem: options.tandem.createTandem( 'expandCollapseButton' )
    } );

    const actionButtonSideLength = Math.max(
      ExperimentGraphNode.EXPERIMENT_GRAPH_BUTTON_WIDTH,
      ExperimentGraphNode.EXPERIMENT_GRAPH_BUTTON_HEIGHT
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
      listener: () => this.clearDataSet(),
      tandem: options.tandem.createTandem( 'actionButton3' )
    } ) );

    const buttonColumn = new VBox( {
      spacing: ExperimentGraphNode.EXPERIMENT_GRAPH_BUTTON_SPACING,
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
      spacing: ExperimentGraphNode.EXPERIMENT_GRAPH_BUTTON_COLUMN_SPACING,
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

    const zoomLevelObserver = ( zoomLevel: number ) => {
      const index = Math.min( Math.max( zoomLevel - 1, 0 ), zoomRangePairs.length - 1 );
      const rangePair = zoomRangePairs[ index ];
      this.chartTransform.setModelXRange( getPaddedRange( rangePair.xRange, rangePaddingFractionX ) );
      this.chartTransform.setModelYRange( getPaddedRange( rangePair.yRange, rangePaddingFractionY ) );

      const previousTickSets = tickSets;

      tickSets = createTickSets( rangePair );
      chartContentNode.children = [ gridLineSet, plotLayer ];
      tickMarkNode.children = [ tickSets.xTickMarkSet, tickSets.yTickMarkSet ];
      tickLabelNode.children = [ tickSets.xTickLabelSet, tickSets.yTickLabelSet ];
      updateAxisLabelPositions( tickSets );

      previousTickSets.xTickLabelSet.dispose();
      previousTickSets.yTickLabelSet.dispose();
      previousTickSets.xTickMarkSet.dispose();
      previousTickSets.yTickMarkSet.dispose();
    };
    this.zoomLevelProperty.link( zoomLevelObserver );

    const clearListener = this.clearDataSet.bind( this );
    resetEmitter.addListener( clearListener );

    this.disposeExperimentGraphNode = () => {
      this.expandedProperty.unlink( expandedObserver );
      this.zoomLevelProperty.unlink( zoomLevelObserver );
      this.zoomLevelProperty.dispose();
      this.expandedProperty.dispose();
      this.chartTransform.dispose();

      if ( resetEmitter ) {
        resetEmitter.removeListener( clearListener );
      }
    };
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
   * Clears the plotted data so the graph resets visually.
   */
  protected clearDataSet(): void {
    this.setDataSet( [] );
  }

  /**
   * Releases listeners and owned graph resources.
   */
  public override dispose(): void {
    this.disposeExperimentGraphNode();
    super.dispose();
  }
}