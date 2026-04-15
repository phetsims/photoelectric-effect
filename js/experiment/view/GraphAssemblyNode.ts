// Copyright 2026, University of Colorado Boulder

/**
 * GraphAssemblyNode composes GraphPlotAreaNode with experiment-specific controls and readouts.
 * It owns the expand/collapse state, snapshot count readout, and the right-side action buttons
 * for opening graph info, viewing snapshot history, capturing snapshots, and clearing snapshots.
 * This wrapper keeps screen-level graph interactions coordinated with GraphData while leaving plot rendering to
 * GraphPlotAreaNode.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import CameraButton, { CameraButtonOptions } from '../../../../scenery-phet/js/buttons/CameraButton.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import TrashButton, { type TrashButtonOptions } from '../../../../scenery-phet/js/buttons/TrashButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import expandSolidShape from '../../../../sherpa/js/fontawesome-5/expandSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphData from '../model/GraphData.js';
import GraphInfoDialog from './GraphInfoDialog.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';
import GraphSnapshotsDialog from './GraphSnapshotsDialog.js';

// Horizontal spacing between the chart content and the right-side button column.
const GRAPH_ASSEMBLY_BUTTON_COLUMN_SPACING = 10;

// Vertical spacing between action buttons in the right-side column.
const GRAPH_ASSEMBLY_BUTTON_SPACING = 8;

// Minimum dimensions used to normalize action button sizing.
const GRAPH_ASSEMBLY_BUTTON_WIDTH = 28;
const GRAPH_ASSEMBLY_BUTTON_HEIGHT = 20;

// Insets and offset used to anchor the expand/collapse button near the chart corner.
const GRAPH_ASSEMBLY_EXPAND_BUTTON_MARGIN = 3;
const GRAPH_ASSEMBLY_EXPAND_BUTTON_LEFT_OFFSET = 6;

// Padding from the chart border for the snapshot count readout.
const SNAPSHOT_READOUT_MARGIN = 4;

type SelfOptions = {

  // Nested options forwarded to GraphPlotAreaNode.
  graphPlotAreaNodeOptions?: GraphPlotAreaNodeOptions;
};

export type GraphAssemblyNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class GraphAssemblyNode extends Node {

  // Vertical spacing between stacked graph assemblies in the experiment screen layout.
  public static readonly GRAPH_ASSEMBLY_SPACING = 12;

  // Whether the chart content row is visible.
  private readonly expandedProperty: BooleanProperty;

  // Chart only (grid, plot, ticks, axis labels).
  private readonly graphPlotAreaNode: GraphPlotAreaNode;

  /**
   * @param graphData - Model-owned samples; this node redraws when dataChangedEmitter fires.
   * @param providedOptions
   */
  public constructor( graphData: GraphData, providedOptions: GraphAssemblyNodeOptions ) {
    const options = optionize<GraphAssemblyNodeOptions, StrictOmit<SelfOptions, 'graphPlotAreaNodeOptions'>, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    const tandem = options.tandem;
    const graphPlotAreaNodeOptions = options.graphPlotAreaNodeOptions ?? {};

    super( options );

    this.expandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'expandedProperty' )
    } );

    this.graphPlotAreaNode = new GraphPlotAreaNode( graphPlotAreaNodeOptions );

    // Layout for UI components will be relative to this chart rectangle area.
    const plotRectangle = this.graphPlotAreaNode.plotRectangle;

    // A readout for the number of snapshots taken and remaining.
    const snapshotCountReadoutText = new Text(
      new DerivedProperty( [ graphData.snapshotsCountProperty ], count => `${count}/${GraphData.MAX_SNAPSHOTS}` ),
      { font: new PhetFont( { size: 18 } ) }
    );

    const plotContentNode = new Node( {
      children: [
        this.graphPlotAreaNode,
        snapshotCountReadoutText
      ]
    } );

    // A manual constraint keeps the readout text in the same place, as the string changes.
    ManualConstraint.create( plotContentNode, [ snapshotCountReadoutText, plotRectangle ], ( readout, rect ) => {
      readout.right = rect.right - SNAPSHOT_READOUT_MARGIN;
      readout.top = rect.top + SNAPSHOT_READOUT_MARGIN;
    } );

    const expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 18,
      left: plotRectangle.left +
            GRAPH_ASSEMBLY_EXPAND_BUTTON_MARGIN -
            GRAPH_ASSEMBLY_EXPAND_BUTTON_LEFT_OFFSET,
      top: plotRectangle.top + GRAPH_ASSEMBLY_EXPAND_BUTTON_MARGIN,
      tandem: tandem.createTandem( 'expandCollapseButton' )
    } );

    // Uses a square size so mixed button implementations share a consistent visual footprint.
    const actionButtonSideLength = Math.max(
      GRAPH_ASSEMBLY_BUTTON_WIDTH,
      GRAPH_ASSEMBLY_BUTTON_HEIGHT
    );
    const actionButtonOptions: RectangularPushButtonOptions = {
      size: new Dimension2( actionButtonSideLength, actionButtonSideLength ),
      baseColor: 'white',
      xMargin: 6,
      yMargin: 6
    };

    const infoDialog = new GraphInfoDialog( tandem.createTandem( 'infoDialog' ) );
    const snapshotsDialog = new GraphSnapshotsDialog(
      tandem.createTandem( 'snapshotsDialog' ),
      graphData,
      this.graphPlotAreaNode.zoomLevelProperty,
      graphPlotAreaNodeOptions
    );

    const infoButton = new InfoButton( {
      radius: actionButtonSideLength / 2,
      baseColor: 'white',
      xMargin: actionButtonOptions.xMargin,
      yMargin: actionButtonOptions.yMargin,
      listener: () => infoDialog.show(),
      tandem: tandem.createTandem( 'infoButton' )
    } );

    const trashButton = new TrashButton( combineOptions<TrashButtonOptions>( {}, actionButtonOptions, {
      listener: () => graphData.clearSnapshots(),
      tandem: tandem.createTandem( 'trashButton' )
    } ) );

    const snapshotsGalleryButton = new RectangularPushButton( combineOptions<RectangularPushButtonOptions>( {}, actionButtonOptions, {
      content: new Path( expandSolidShape, {
        fill: 'black',
        scale: 0.7
      } ),
      listener: () => { snapshotsDialog.show(); },
      enabledProperty: new DerivedProperty(
        [ graphData.snapshotsCountProperty ],
        count => count > 0
      ),
      accessibleName: PhotoelectricEffectFluent.experiment.graph.snapshotsGalleryButtonAccessibleNameStringProperty,
      accessibleHelpText: PhotoelectricEffectFluent.experiment.graph.snapshotsGalleryButtonAccessibleHelpTextStringProperty,
      tandem: tandem.createTandem( 'snapshotsGalleryButton' )
    } ) );

    const buttonColumn = new VBox( {
      spacing: GRAPH_ASSEMBLY_BUTTON_SPACING,
      align: 'center',
      children: [
        snapshotsGalleryButton,
        new CameraButton( combineOptions<CameraButtonOptions>( {}, actionButtonOptions, {
          listener: () => graphData.captureSnapshot(),
          enabledProperty: new DerivedProperty( [ graphData.snapshotsCountProperty ], count => {
            return count < GraphData.MAX_SNAPSHOTS;
          } ),
          tandem: tandem.createTandem( 'cameraButton' )
        } ) ),
        infoButton,
        trashButton
      ]
    } );

    const contentRow = new HBox( {
      spacing: GRAPH_ASSEMBLY_BUTTON_COLUMN_SPACING,
      align: 'top',
      children: [
        plotContentNode,
        buttonColumn
      ]
    } );
    this.addChild( contentRow );
    this.addChild( expandCollapseButton );

    this.expandedProperty.link( expanded => {
      contentRow.visible = expanded;
    } );

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
    this.graphPlotAreaNode.setDataSet( dataSet );
  }
}
