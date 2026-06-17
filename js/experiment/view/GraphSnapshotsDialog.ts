// Copyright 2026, University of Colorado Boulder

/**
 * Dialog listing each stored GraphData snapshot as its own chart. Chart ranges are initialized from the parent
 * graph's active zoom level whenever the dialog is opened and can then be adjusted directly in the dialog.
 *
 * Snapshot rows are created once and reused so open/close cycles avoid repeated node allocation and disposal.
 * Each row contains a snapshot number, a plot node, and three metadata legend lines.
 * The VBox keeps a fixed child order; the last active row is the only one whose plot shows x-axis tick labels.
 * Unused slots stay hidden via visibility. Snapshot charts share the same GraphPlotAreaNode options as the parent
 * graph (ranges, labels, grid, line styling) but omit the current-point scatter layer.
 * A draggable reference line overlays the visible plots and reports the shared x value plus one nearest-point y value
 * per active snapshot row.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ColorConstants from '../../../../sun/js/ColorConstants.js';
import Checkbox, { type CheckboxOptions } from '../../../../sun/js/Checkbox.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type GraphData from '../model/GraphData.js';
import type { GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';
import GraphSnapshotRowNode from './GraphSnapshotRowNode.js';
import GraphSnapshotsReferenceLineNode, { type GraphSnapshotsReferenceLineValueDisplayOptions } from './GraphSnapshotsReferenceLineNode.js';

export default class GraphSnapshotsDialog extends Dialog {

  /**
   * @param tandem
   * @param graphData - Model that owns live samples and reusable snapshot slots for this dialog.
   * @param parentZoomLevelProperty - 1-based zoom index from the parent graph's chart; its current value whenever the
   *                                  dialog is shown sets the initial zoom level for charts in this dialog.
   * @param xRange - Shared x range used by each snapshot plot.
   * @param yZoomRanges - Y zoom presets used by each snapshot plot.
   * @param titleStringProperty - Localized title string shown in this dialog header.
   * @param graphPlotAreaNodeOptions - Options used for each snapshot chart's plot area.
   * @param referenceLineXDisplayOptions - Formatting and display range for the reference-line x readout.
   * @param referenceLineYDisplayOptions - Formatting and display range for the per-snapshot y readouts.
   */
  public constructor(
    tandem: Tandem,
    graphData: GraphData,
    parentZoomLevelProperty: TReadOnlyProperty<number>,
    xRange: Range,
    yZoomRanges: Range[],
    titleStringProperty: TReadOnlyProperty<string>,
    graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions,
    referenceLineXDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions,
    referenceLineYDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions
  ) {

    const snapshotPlotOptions = combineOptions<GraphPlotAreaNodeOptions>( {}, graphPlotAreaNodeOptions, {

      // The current data point is not shown on snapshots.
      showCurrentPointMarker: false,

      // Plots in this dialog take up most of the screen, and do not
      // have the full rectangular border so they appear more joined.
      chartViewWidth: 600,
      showXLabels: false,
      borderStyle: 'line',

      // TODO: @design What should these be, and do we need to customize it per plot?
      //   17 ticks creates nice divisions for the largest range (voltage)
      xTickCount: 17,
      yTickCount: 5,
      xTickLabelMode: 'edge',
      yTickLabelMode: 'edge'
    } );

    const snapshotRows = graphData.snapshots.map( ( snapshot, i ) => {
      return new GraphSnapshotRowNode( xRange, yZoomRanges, i + 1, snapshot, snapshotPlotOptions );
    } );

    const plotsGridBox = new VBox( {
      spacing: 4,
      children: snapshotRows
    } );

    const referenceLineVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'referenceLineVisibleProperty' ),
      phetioFeatured: true,
      phetioState: false
    } );

    const referenceLineXProperty = new NumberProperty( xRange.getCenter(), {
      range: xRange,
      tandem: tandem.createTandem( 'referenceLineXProperty' ),
      phetioFeatured: true,
      phetioState: false
    } );

    const referenceLineNode = new GraphSnapshotsReferenceLineNode(
      snapshotRows,
      referenceLineXProperty,
      referenceLineVisibleProperty,
      {
        xDisplayOptions: referenceLineXDisplayOptions,
        yDisplayOptions: referenceLineYDisplayOptions,
        tandem: tandem.createTandem( 'referenceLineNode' )
      }
    );

    const plotsOverlayNode = new Node( {
      children: [
        plotsGridBox,
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

    const referenceLineCheckbox = new Checkbox(
      referenceLineVisibleProperty,
      new HBox( {
        spacing: 8,
        children: [
          new Text( PhotoelectricEffectFluent.experiment.graph.referenceLineStringProperty, {
            font: PhotoelectricEffectConstants.CONTENT_FONT
          } ),
          GraphSnapshotsDialog.createReferenceLineCheckboxIcon()
        ]
      } ),
      combineOptions<CheckboxOptions>( {}, {
        isDisposable: false,
        tandem: tandem.createTandem( 'referenceLineCheckbox' )
      } )
    );

    const contentVBox = new VBox( {
      spacing: 8,
      align: 'right',
      children: [
        contentHBox,
        referenceLineCheckbox
      ]
    } );

    const titleText = new Text( titleStringProperty, {
      font: PhotoelectricEffectConstants.DIALOG_TITLE_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    /**
     * Redraw snapshot rows from model data. Rows remain in a fixed VBox order, and the last active row shows the
     * x-axis labels for the visible snapshot stack.
     */
    const updateSnapshotPlots = () => {
      const count = graphData.snapshotsCountProperty.value;
      snapshotRows.forEach( ( snapshotRowNode, i ) => {
        i < count ? snapshotRowNode.setSnapshot() : snapshotRowNode.clearSnapshot();
        snapshotRowNode.setShowXLabels( i === count - 1 );
      } );
      referenceLineNode.updateLayout();
    };

    zoomLevelProperty.link( zoomLevel => {
      snapshotRows.forEach( snapshotRowNode => {
        snapshotRowNode.setZoomLevel( zoomLevel );
      } );
      referenceLineNode.updateLayout();
    } );

    const updateOnShow = () => {
      zoomLevelProperty.value = parentZoomLevelProperty.value;
      updateSnapshotPlots();
      referenceLineNode.updateLayout();
    };

    updateSnapshotPlots();

    super( contentVBox, {
      title: titleText,
      xSpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      cornerRadius: PhotoelectricEffectConstants.DIALOG_CORNER_RADIUS,
      ySpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      titleAlign: 'left',
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true,
      showCallback: updateOnShow
    } );
  }

  /**
   * Creates the icon shown in the Reference Line checkbox.
   */
  private static createReferenceLineCheckboxIcon(): Node {
    return new VBox( {
      align: 'center',
      spacing: -1,
      children: [
        new Line( 0, 0, 0, 22, {
          stroke: PhotoelectricEffectColors.referenceLineStrokeColorProperty,
          lineWidth: 3
        } ),
        new ShadedSphereNode( 14, {
          mainColor: PhotoelectricEffectColors.referenceLineHandleColorProperty
        } )
      ]
    } );
  }
}
