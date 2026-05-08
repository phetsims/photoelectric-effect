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
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import CameraButton, { CameraButtonOptions } from '../../../../scenery-phet/js/buttons/CameraButton.js';
import InfoButton from '../../../../scenery-phet/js/buttons/InfoButton.js';
import TrashButton, { type TrashButtonOptions } from '../../../../scenery-phet/js/buttons/TrashButton.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import expandSolidShape from '../../../../sherpa/js/fontawesome-5/expandSolidShape.js';
import RectangularPushButton, { RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import GraphData from '../model/GraphData.js';
import type { GraphSnapshotMetadataFieldPair } from '../model/GraphSnapshot.js';
import GraphInfoDialog from './GraphInfoDialog.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';
import GraphSnapshotSavedMessageNode from './GraphSnapshotSavedMessageNode.js';
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

// Padding from the chart border for the "Saved!" message.
const SNAPSHOT_SAVED_MESSAGE_MARGIN = 4;

type SelfOptions = {

  // Nested options forwarded to GraphPlotAreaNode.
  graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions;

  // Accessible names for each button in the right-side column.
  expandCollapseButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  infoButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  cameraButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  trashButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleHelpTextProperty: TReadOnlyProperty<string>;
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
   * @param graphData - Source of live samples, snapshots, and current operating-point state.
   * @param xRange - Shared x range used for all zoom levels in this plot.
   * @param yZoomRanges - Zoom presets for the y axis, from any order (sorted internally by span).
   * @param snapshotsDialogTitleStringProperty - Localized title shown in this graph's snapshots dialog.
   * @param snapshotMetadataFields - Fields for the second and third snapshot legend lines in the snapshots dialog.
   * @param providedOptions - Node options plus graph-plot-area configuration forwarded to child components.
   */
  public constructor(
    graphData: GraphData,
    xRange: Range,
    yZoomRanges: Range[],
    snapshotsDialogTitleStringProperty: TReadOnlyProperty<string>,
    snapshotMetadataFields: GraphSnapshotMetadataFieldPair,
    providedOptions: GraphAssemblyNodeOptions
  ) {
    const options = optionize<GraphAssemblyNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    const tandem = options.tandem;
    const graphPlotAreaNodeOptions = options.graphPlotAreaNodeOptions;

    super( options );

    this.addLinkedElement( graphData );

    this.expandedProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'expandedProperty' )
    } );

    this.graphPlotAreaNode = new GraphPlotAreaNode( xRange, yZoomRanges, graphPlotAreaNodeOptions );

    // Layout for UI components will be relative to this chart rectangle area.
    const plotBounds = this.graphPlotAreaNode.plotBounds;

    // A readout for the number of snapshots taken and remaining.
    const snapshotCountReadoutText = new Text(
      new DerivedProperty( [ graphData.snapshotsCountProperty ], count => `${count}/${GraphData.MAX_SNAPSHOTS}` ),
      { font: PhotoelectricEffectConstants.CONTENT_FONT }
    );

    const snapshotSavedMessageNode = new GraphSnapshotSavedMessageNode();

    const plotContentNode = new Node( {
      children: [
        this.graphPlotAreaNode,
        snapshotSavedMessageNode,
        snapshotCountReadoutText
      ]
    } );

    // Manual constraints keep the labels in the same place as strings change.
    ManualConstraint.create( plotContentNode, [ snapshotCountReadoutText ], readout => {
      readout.right = plotBounds.right - SNAPSHOT_READOUT_MARGIN;
      readout.top = plotBounds.top + SNAPSHOT_READOUT_MARGIN;
    } );
    ManualConstraint.create( plotContentNode, [ snapshotSavedMessageNode ], savedMessageNode => {
      savedMessageNode.centerX = plotBounds.centerX;
      savedMessageNode.top = plotBounds.top + SNAPSHOT_SAVED_MESSAGE_MARGIN;
    } );

    const expandCollapseButton = new ExpandCollapseButton( this.expandedProperty, {
      sideLength: 18,
      left: plotBounds.left +
            GRAPH_ASSEMBLY_EXPAND_BUTTON_MARGIN -
            GRAPH_ASSEMBLY_EXPAND_BUTTON_LEFT_OFFSET,
      top: plotBounds.top + GRAPH_ASSEMBLY_EXPAND_BUTTON_MARGIN,
      tandem: tandem.createTandem( 'expandCollapseButton' ),
      accessibleName: options.expandCollapseButtonAccessibleNameProperty
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
      xRange,
      yZoomRanges,
      snapshotsDialogTitleStringProperty,
      snapshotMetadataFields,
      graphPlotAreaNodeOptions
    );

    const infoButton = new InfoButton( {
      radius: actionButtonSideLength / 2,
      baseColor: 'white',
      xMargin: actionButtonOptions.xMargin,
      yMargin: actionButtonOptions.yMargin,
      listener: () => infoDialog.show(),
      tandem: tandem.createTandem( 'infoButton' ),
      accessibleName: options.infoButtonAccessibleNameProperty
    } );

    const trashButton = new TrashButton( combineOptions<TrashButtonOptions>( {}, actionButtonOptions, {
      listener: () => graphData.clearSnapshots(),
      tandem: tandem.createTandem( 'trashButton' ),
      accessibleName: options.trashButtonAccessibleNameProperty
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
      accessibleName: options.snapshotsGalleryButtonAccessibleNameProperty,
      accessibleHelpText: options.snapshotsGalleryButtonAccessibleHelpTextProperty,
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
          tandem: tandem.createTandem( 'cameraButton' ),
          accessibleName: options.cameraButtonAccessibleNameProperty
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

    // When we get a new snapshot, indicate that data was saved.
    let previousSnapshotsCount = graphData.snapshotsCountProperty.value;
    graphData.snapshotsCountProperty.link( snapshotsCount => {
      if ( snapshotsCount > previousSnapshotsCount ) {
        snapshotSavedMessageNode.showMessage();
      }
      previousSnapshotsCount = snapshotsCount;
    } );

    const syncLinePlot = () => {

      // Revealed curve points currently shown in the line plot.
      const lineDataSet = [ ...graphData.getDataPoints() ];
      this.graphPlotAreaNode.setLineDataSet( lineDataSet );
      this.graphPlotAreaNode.zoomToFitDataSetY( lineDataSet, graphData.currentPointProperty.value );
    };
    graphData.dataChangedEmitter.addListener( syncLinePlot );
    syncLinePlot();

    graphData.currentPointProperty.link( currentPoint => {
      this.graphPlotAreaNode.setCurrentPointMarker( currentPoint );
    } );
  }
}
