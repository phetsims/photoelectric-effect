// Copyright 2026, University of Colorado Boulder

/**
 * ExperimentGraphNode renders a placeholder chart for the Experiment screen with an expandable frame
 * and a shared right-side button column. It owns the chart transform and a zoomLevelProperty so each
 * graph can predefine zoom presets even before any zoom UI is attached.
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
import optionize from '../../../../phet-core/js/optionize.js';
import Orientation from '../../../../phet-core/js/Orientation.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import photoelectricEffect from '../../photoelectricEffect.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type ZoomRangePair = {
  xRange: Range;
  yRange: Range;
};

type SelfOptions = {
  titleStringProperty?: TReadOnlyProperty<string> | null;
  dataSet?: ( Vector2 | null )[];
  zoomRangePairs?: ZoomRangePair[];
  gridXSpacing?: number;
  gridYSpacing?: number;
};

export type ExperimentGraphNodeOptions = SelfOptions & NodeOptions;

export default class ExperimentGraphNode extends Node {

  // Zoom level that controls the chart's model ranges.
  public readonly zoomLevelProperty: NumberProperty;

  private readonly expandedProperty: BooleanProperty;
  private readonly chartTransform: ChartTransform;
  private readonly linePlot: LinePlot;
  private readonly disposeExperimentGraphNode: () => void;

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
        new RectangularPushButton( {
          ...actionButtonOptions,
          tandem: options.tandem.createTandem( 'actionButton1' )
        } ),
        new RectangularPushButton( {
          ...actionButtonOptions,
          tandem: options.tandem.createTandem( 'actionButton2' )
        } ),
        new InfoButton( {
          tandem: options.tandem.createTandem( 'infoButton' )
        } ),
        new RectangularPushButton( {
          ...actionButtonOptions,
          tandem: options.tandem.createTandem( 'actionButton3' )
        } )
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
    titleText && this.addChild( titleText );
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
   */
  public setDataSet( dataSet: ( Vector2 | null )[] ): void {
    this.linePlot.setDataSet( dataSet );
  }

  public override dispose(): void {
    this.disposeExperimentGraphNode();
    super.dispose();
  }
}

photoelectricEffect.register( 'ExperimentGraphNode', ExperimentGraphNode );
