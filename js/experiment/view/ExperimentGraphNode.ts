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
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartRectangle from '../../../../bamboo/js/ChartRectangle.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import GridLineSet from '../../../../bamboo/js/GridLineSet.js';
import LinePlot from '../../../../bamboo/js/LinePlot.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type ZoomRangePair = {
  xRange: Range;
  yRange: Range;
};

type SelfOptions = {

  // Optional title displayed above the chart. Null hides the title node.
  titleStringProperty?: TReadOnlyProperty<string> | null;

  // Initial data set for the line plot. Use null entries to break segments.
  dataSet?: ( Vector2 | null )[];

  // Zoom presets mapped to the zoomLevelProperty (1-based).
  zoomRangePairs?: ZoomRangePair[];

  // Horizontal grid spacing in model units.
  gridXSpacing?: number;

  // Vertical grid spacing in model units.
  gridYSpacing?: number;
};

export type ExperimentGraphNodeOptions = SelfOptions & NodeOptions;

export default class ExperimentGraphNode extends Node {

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

  /**
   * @param providedOptions - Overrides for the graph layout, data, and instrumentation.
   */
  public constructor( providedOptions?: ExperimentGraphNodeOptions ) {

    const options = optionize<ExperimentGraphNodeOptions, SelfOptions, NodeOptions>()( {
      titleStringProperty: null,
      dataSet: [],
      zoomRangePairs: [ {
        xRange: new Range( 0, 1 ),
        yRange: new Range( 0, 1 )
      } ],
      gridXSpacing: 0.2,
      gridYSpacing: 0.2,
      tandem: Tandem.REQUIRED
    }, providedOptions );

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

    this.chartTransform = new ChartTransform( {
      viewWidth: PhotoelectricEffectConstants.EXPERIMENT_GRAPH_CHART_WIDTH,
      viewHeight: PhotoelectricEffectConstants.EXPERIMENT_GRAPH_CHART_HEIGHT,
      modelXRange: zoomRangePairs[ 0 ].xRange,
      modelYRange: zoomRangePairs[ 0 ].yRange
    } );

    const chartRectangle = new ChartRectangle( this.chartTransform, {
      fill: 'white',
      stroke: 'black',
      cornerXRadius: 4,
      cornerYRadius: 4
    } );

    const gridLineOptions = { stroke: 'rgb( 220, 220, 220 )' };
    const gridLineSet = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [
        new GridLineSet( this.chartTransform, Orientation.HORIZONTAL, options.gridYSpacing, gridLineOptions ),
        new GridLineSet( this.chartTransform, Orientation.VERTICAL, options.gridXSpacing, gridLineOptions )
      ]
    } );

    this.linePlot = new LinePlot( this.chartTransform, options.dataSet, {
      stroke: 'black',
      lineWidth: 2
    } );

    const plotLayer = new Node( {
      clipArea: chartRectangle.getShape(),
      children: [
        this.linePlot
      ]
    } );

    const chartNode = new Node( {
      children: [
        chartRectangle,
        gridLineSet,
        plotLayer
      ]
    } );

    const expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 18,
      left: chartRectangle.left + PhotoelectricEffectConstants.EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN,
      top: chartRectangle.top + PhotoelectricEffectConstants.EXPERIMENT_GRAPH_EXPAND_BUTTON_MARGIN,
      tandem: options.tandem.createTandem( 'expandCollapseButton' )
    } );

    const actionButtonOptions = {
      size: new Dimension2(
        PhotoelectricEffectConstants.EXPERIMENT_GRAPH_BUTTON_WIDTH,
        PhotoelectricEffectConstants.EXPERIMENT_GRAPH_BUTTON_HEIGHT
      ),
      accessibleName: PhotoelectricEffectFluent.experiment.graph.actionButtonStringProperty
    };

    const buttonColumn = new VBox( {
      spacing: PhotoelectricEffectConstants.EXPERIMENT_GRAPH_BUTTON_SPACING,
      align: 'center',
      children: [
        new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( actionButtonOptions, {
          tandem: options.tandem.createTandem( 'actionButton1' )
        } ) ),
        new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( actionButtonOptions, {
          tandem: options.tandem.createTandem( 'actionButton2' )
        } ) ),
        new InfoButton( {
          tandem: options.tandem.createTandem( 'infoButton' )
        } ),
        new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( actionButtonOptions, {
          tandem: options.tandem.createTandem( 'actionButton3' )
        } ) )
      ]
    } );

    const contentRow = new HBox( {
      spacing: PhotoelectricEffectConstants.EXPERIMENT_GRAPH_BUTTON_COLUMN_SPACING,
      align: 'top',
      children: [
        chartNode,
        buttonColumn
      ]
    } );
    const titleText = options.titleStringProperty ? new Text( options.titleStringProperty, {
      font: new PhetFont( 12 ),
      centerX: chartRectangle.centerX,
      bottom: chartRectangle.top - PhotoelectricEffectConstants.EXPERIMENT_GRAPH_TITLE_MARGIN
    } ) : null;

    this.addChild( contentRow );
    if ( titleText ) {
      this.addChild( titleText );
    }
    this.addChild( expandCollapseButton );

    const expandedObserver = ( expanded: boolean ) => {
      contentRow.visible = expanded;
    };
    this.expandedProperty.link( expandedObserver );

    const zoomLevelObserver = ( zoomLevel: number ) => {
      const index = Math.min( Math.max( zoomLevel - 1, 0 ), zoomRangePairs.length - 1 );
      const rangePair = zoomRangePairs[ index ];
      this.chartTransform.setModelXRange( rangePair.xRange );
      this.chartTransform.setModelYRange( rangePair.yRange );
    };
    this.zoomLevelProperty.link( zoomLevelObserver );

    this.disposeExperimentGraphNode = () => {
      this.expandedProperty.unlink( expandedObserver );
      this.zoomLevelProperty.unlink( zoomLevelObserver );
      this.zoomLevelProperty.dispose();
      this.expandedProperty.dispose();
      this.chartTransform.dispose();
    };
  }

  /**
   * Updates the line plot data set.
   *
   * @param dataSet - Model data points in chart coordinates. Use null entries to break segments.
   */
  public setDataSet( dataSet: ( Vector2 | null )[] ): void {
    this.linePlot.setDataSet( dataSet );
  }

  /**
   * Releases listeners and owned graph resources.
   */
  public override dispose(): void {
    this.disposeExperimentGraphNode();
    super.dispose();
  }
}