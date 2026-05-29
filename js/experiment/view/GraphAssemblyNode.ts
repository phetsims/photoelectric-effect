// Copyright 2026, University of Colorado Boulder

/**
 * GraphAssemblyNode composes GraphPlotAreaNode with experiment-specific controls and readouts.
 * It owns the expand/collapse state, snapshot count readout, and the right-side action buttons
 * for viewing snapshot history, capturing snapshots, and clearing snapshots.
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
import InfoButton, { type InfoButtonOptions } from '../../../../scenery-phet/js/buttons/InfoButton.js';
import TrashButton, { type TrashButtonOptions } from '../../../../scenery-phet/js/buttons/TrashButton.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import { type RectangularPushButtonOptions } from '../../../../sun/js/buttons/RectangularPushButton.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import GraphData from '../model/GraphData.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';
import GraphSnapshotSavedMessageNode from './GraphSnapshotSavedMessageNode.js';
import GraphSnapshotsDialog from './GraphSnapshotsDialog.js';

// Horizontal spacing between the chart content and the right-side button column.
const GRAPH_ASSEMBLY_BUTTON_COLUMN_SPACING = 10;

// Vertical spacing between action buttons in the right-side column.
const GRAPH_ASSEMBLY_BUTTON_SPACING = 8;

// Minimum dimensions used to normalize action-button sizing.
const GRAPH_ASSEMBLY_BUTTON_WIDTH = 28;
const GRAPH_ASSEMBLY_BUTTON_HEIGHT = 20;

// Padding from the chart border for the snapshot count readout.
const SNAPSHOT_READOUT_MARGIN = 4;

// Padding from the chart border for the "Saved!" message.
const SNAPSHOT_SAVED_MESSAGE_MARGIN = 4;

type SelfOptions = {

  // Nested options forwarded to GraphPlotAreaNode.
  graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions;

  // Accessible names for each button in the right-side column.
  expandCollapseButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  cameraButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  trashButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleHelpTextProperty: TReadOnlyProperty<string>;
};

export type GraphAssemblyNodeOptions = SelfOptions & NodeOptions & PickRequired<NodeOptions, 'tandem'>;

export default class GraphAssemblyNode extends Node {

  // Vertical spacing between stacked graph assemblies in the experiment screen layout.
  public static readonly GRAPH_ASSEMBLY_SPACING = 12;

  // Whether the graph accordion is expanded.
  private readonly expandedProperty: BooleanProperty;

  // Chart only (grid, plot, ticks, axis labels).
  private readonly graphPlotAreaNode: GraphPlotAreaNode;

  /**
   * @param graphData - Source of live samples, snapshots, and current operating-point state.
   * @param xRange - Shared x range used for all zoom levels in this plot.
   * @param yZoomRanges - Zoom presets for the y axis, from any order (sorted internally by span).
   * @param snapshotsDialogTitleStringProperty - Localized title shown in this graph's snapshots dialog.
   * @param providedOptions - Node options plus graph-plot-area configuration forwarded to child components.
   */
  public constructor(
    graphData: GraphData,
    xRange: Range,
    yZoomRanges: Range[],
    snapshotsDialogTitleStringProperty: TReadOnlyProperty<string>,
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

    // Uses a square size so mixed button implementations share a consistent visual footprint.
    const actionButtonSideLength = Math.max(
      GRAPH_ASSEMBLY_BUTTON_WIDTH,
      GRAPH_ASSEMBLY_BUTTON_HEIGHT
    );
    const actionButtonOptions: RectangularPushButtonOptions = {
      size: new Dimension2( actionButtonSideLength, actionButtonSideLength ),
      baseColor: PhotoelectricEffectColors.graphButtonBaseColorProperty,
      xMargin: 6,
      yMargin: 6
    };
    const infoButtonOptions: InfoButtonOptions = {
      radius: actionButtonSideLength / 2,
      baseColor: 'white',
      xMargin: 6,
      yMargin: 6
    };

    const snapshotsDialog = new GraphSnapshotsDialog(
      tandem.createTandem( 'snapshotsDialog' ),
      graphData,
      this.graphPlotAreaNode.zoomLevelProperty,
      xRange,
      yZoomRanges,
      snapshotsDialogTitleStringProperty,
      graphPlotAreaNodeOptions
    );

    const trashButton = new TrashButton( combineOptions<TrashButtonOptions>( {}, actionButtonOptions, {
      listener: () => graphData.clearSnapshots(),
      tandem: tandem.createTandem( 'trashButton' ),
      accessibleName: options.trashButtonAccessibleNameProperty
    } ) );

    const snapshotsGalleryButton = new InfoButton( combineOptions<InfoButtonOptions>( {}, infoButtonOptions, {
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
        new CameraButton( combineOptions<CameraButtonOptions>( {}, actionButtonOptions, {
          listener: () => graphData.captureSnapshot(),
          enabledProperty: new DerivedProperty( [ graphData.snapshotsCountProperty ], count => {
            return count < GraphData.MAX_SNAPSHOTS;
          } ),
          tandem: tandem.createTandem( 'cameraButton' ),
          accessibleName: options.cameraButtonAccessibleNameProperty
        } ) ),
        snapshotsGalleryButton,
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
    this.addChild( new AccordionBox( contentRow, {
      expandedProperty: this.expandedProperty,
      tandem: tandem.createTandem( 'accordionBox' ),
      accessibleName: options.expandCollapseButtonAccessibleNameProperty,

      // Options that make the AccordionBox background panel invisible, and align the expand/collapse
      // button with the content
      allowContentToOverlapTitle: true,
      titleBarExpandCollapse: false,
      focusHighlightTarget: 'expandCollapseButton',
      contentXMargin: 0,
      contentYMargin: 0,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      stroke: null
    } ) );

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
