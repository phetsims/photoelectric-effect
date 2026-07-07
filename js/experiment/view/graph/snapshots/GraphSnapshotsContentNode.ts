// Copyright 2026, University of Colorado Boulder

/**
 * GraphSnapshotsContentNode composes the body of the snapshots dialog: zoom controls, the stacked snapshot plots,
 * the draggable reference line overlay, and the reference-line visibility checkbox.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../../dot/js/Range.js';
import { combineOptions } from '../../../../../../phet-core/js/optionize.js';
import MagnifyingGlassZoomButtonGroup from '../../../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import HBox from '../../../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../../../scenery/js/nodes/Node.js';
import ColorConstants from '../../../../../../sun/js/ColorConstants.js';
import Tandem from '../../../../../../tandem/js/Tandem.js';
import GraphData from '../../../model/GraphData.js';
import GraphSnapshotsReferenceLineModel from '../../../model/GraphSnapshotsReferenceLineModel.js';
import GraphLayoutConstants from '../GraphLayoutConstants.js';
import type { GraphPlotAreaNodeOptions } from '../GraphPlotAreaNode.js';
import GraphSnapshotPlotStackNode from './GraphSnapshotPlotStackNode.js';
import GraphSnapshotsReferenceLineVisibilityControl from './GraphSnapshotsReferenceLineVisibilityControl.js';
import GraphSnapshotsReferenceLineNode, { type GraphSnapshotsReferenceLineValueDisplayOptions } from './referenceLine/GraphSnapshotsReferenceLineNode.js';

// Tick counts for the wider plots shown in snapshots dialogs.
const SNAPSHOT_PLOT_X_TICK_COUNT = 17;
const SNAPSHOT_PLOT_Y_TICK_COUNT = 5;

export default class GraphSnapshotsContentNode extends VBox {

  // Dialog zoom level, initialized from the parent plot whenever the dialog opens.
  private readonly zoomLevelProperty: NumberProperty;

  // Parent graph zoom level used as the dialog's initial zoom level on show.
  private readonly parentZoomLevelProperty: TReadOnlyProperty<number>;

  // Stack of reusable snapshot rows.
  private readonly snapshotPlotStackNode: GraphSnapshotPlotStackNode;

  // Draggable reference line overlay and readouts.
  private readonly referenceLineNode: GraphSnapshotsReferenceLineNode;

  /**
   * @param tandem
   * @param graphData - Model that owns live samples and reusable snapshot slots for this dialog.
   * @param parentZoomLevelProperty - Parent graph zoom level used to initialize this dialog when it opens.
   * @param xRange - Shared x range used by each snapshot plot.
   * @param yZoomRanges - Y zoom presets used by each snapshot plot.
   * @param graphPlotAreaNodeOptions - Options used for each snapshot chart's plot area.
   * @param referenceLineXDisplayOptions - Formatting and display range for the reference line x readout.
   * @param referenceLineYDisplayOptions - Formatting and display range for the per-snapshot y readouts.
   */
  public constructor(
    tandem: Tandem,
    graphData: GraphData,
    parentZoomLevelProperty: TReadOnlyProperty<number>,
    xRange: Range,
    yZoomRanges: Range[],
    graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions,
    referenceLineXDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions,
    referenceLineYDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions
  ) {
    const snapshotPlotOptions = combineOptions<GraphPlotAreaNodeOptions>( {}, graphPlotAreaNodeOptions, {

      // The current data point is not shown on snapshots.
      showCurrentPointMarker: false,

      // Plots in this dialog take up most of the screen, and do not have the full rectangular border so they appear
      // more joined.
      chartViewWidth: GraphLayoutConstants.SNAPSHOT_PLOT_VIEW_WIDTH,
      showXLabels: false,
      borderStyle: 'line',

      // TODO: Mockups are coming for this. The x tick count will likely be static, while y tick count changes
      //   with zoom. On hold until we refine teh snapshots accordion box content.
      xTickCount: SNAPSHOT_PLOT_X_TICK_COUNT,
      yTickCount: SNAPSHOT_PLOT_Y_TICK_COUNT,
      xTickLabelMode: 'edge',
      yTickLabelMode: 'edge'
    } );

    const snapshotPlotStackNode = new GraphSnapshotPlotStackNode(
      graphData,
      xRange,
      yZoomRanges,
      snapshotPlotOptions
    );

    const referenceLineModel = new GraphSnapshotsReferenceLineModel( xRange, {
      tandem: tandem.createTandem( 'referenceLineModel' )
    } );

    const referenceLineNode = new GraphSnapshotsReferenceLineNode(
      snapshotPlotStackNode.snapshotRows,
      referenceLineModel,
      {
        xDisplayOptions: referenceLineXDisplayOptions,
        yDisplayOptions: referenceLineYDisplayOptions,
        tandem: tandem.createTandem( 'referenceLineNode' )
      }
    );

    const plotsOverlayNode = new Node( {
      children: [
        snapshotPlotStackNode,
        referenceLineNode
      ]
    } );

    const zoomLevelProperty = new NumberProperty( parentZoomLevelProperty.value, {
      range: new Range( 1, yZoomRanges.length ),
      numberType: 'Integer',
      tandem: tandem.createTandem( 'zoomLevelProperty' )
    } );

    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      applyZoomIn: currentZoom => currentZoom - 1,
      applyZoomOut: currentZoom => currentZoom + 1,
      orientation: 'vertical',
      spacing: 5,
      magnifyingGlassNodeOptions: {
        glassRadius: 9
      },
      buttonOptions: {
        baseColor: ColorConstants.LIGHT_BLUE
      },
      tandem: tandem.createTandem( 'zoomButtonGroup' )
    } );

    const contentHBox = new HBox( {
      spacing: 10,
      align: 'center',
      children: [
        zoomButtonGroup,
        plotsOverlayNode
      ]
    } );

    super( {
      spacing: 8,
      align: 'right',
      children: [
        contentHBox,
        new GraphSnapshotsReferenceLineVisibilityControl(
          referenceLineModel.visibleProperty,
          tandem.createTandem( 'referenceLineCheckbox' )
        )
      ]
    } );

    this.zoomLevelProperty = zoomLevelProperty;
    this.parentZoomLevelProperty = parentZoomLevelProperty;
    this.snapshotPlotStackNode = snapshotPlotStackNode;
    this.referenceLineNode = referenceLineNode;

    zoomLevelProperty.link( zoomLevel => {
      snapshotPlotStackNode.setZoomLevel( zoomLevel );
      referenceLineNode.updateLayout();
    } );

    snapshotPlotStackNode.updateSnapshotPlots();
  }

  /**
   * Refreshes snapshot rows and zoom level whenever the dialog is shown.
   */
  public updateOnShow(): void {
    this.zoomLevelProperty.value = this.parentZoomLevelProperty.value;
    this.snapshotPlotStackNode.updateSnapshotPlots();
    this.referenceLineNode.updateLayout();
  }
}
