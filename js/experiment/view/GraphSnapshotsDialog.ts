// Copyright 2026, University of Colorado Boulder

/**
 * Dialog listing each stored GraphData snapshot as its own chart. Chart ranges are initialized from the parent
 * graph's active zoom level whenever the dialog is opened and can then be adjusted directly in the dialog.
 *
 * Snapshot rows are created once and reused so open/close cycles avoid repeated node allocation and disposal.
 * Each row contains a snapshot number, a legend area (material, wavelength, intensity), and a plot node.
 * The VBox keeps a fixed child order; the last row is the only one whose plot shows x-axis tick labels. Snapshots map
 * to rows so the last stored snapshot always uses that labeled bottom row, while earlier snapshots use rows above it.
 * Unused slots stay hidden via visibility. Snapshot charts share the same GraphPlotAreaNode options as the parent
 * graph (ranges, labels, grid, line styling) but omit the current-point scatter layer.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import GraphData from '../model/GraphData.js';
import type { GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';
import GraphSnapshotRowNode from './GraphSnapshotRowNode.js';

export default class GraphSnapshotsDialog extends Dialog {

  /**
   * @param tandem
   * @param graphData - Model that owns live samples and immutable snapshot copies for this dialog.
   * @param parentZoomLevelProperty - 1-based zoom index from the parent graph's chart; its current value whenever the
   *                                  dialog is shown sets the initial zoom level for charts in this dialog.
   * @param xRange - Shared x range used by each snapshot plot.
   * @param yZoomRanges - Y zoom presets used by each snapshot plot.
   * @param titleStringProperty - Localized title string shown in this dialog header.
   * @param graphPlotAreaNodeOptions - Options used for each snapshot chart's plot area.
   */
  public constructor(
    tandem: Tandem,
    graphData: GraphData,
    parentZoomLevelProperty: TReadOnlyProperty<number>,
    xRange: Range,
    yZoomRanges: Range[],
    titleStringProperty: TReadOnlyProperty<string>,
    graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions
  ) {

    const snapshotPlotOptions = combineOptions<GraphPlotAreaNodeOptions>( {}, graphPlotAreaNodeOptions, {

      // The current data point is not shown on snapshots.
      showCurrentPointMarker: false,

      // Plots in this dialog take up most of the screen, and do not
      // have the full rectangular border so they appear more joined.
      chartViewWidth: 600,
      showXLabels: false,
      borderStyle: 'line'
    } );

    // The bottom-most plot will have x labels, to label all stacked plots.
    const labeledSnapshotPlotOptions = combineOptions<GraphPlotAreaNodeOptions>( {}, snapshotPlotOptions, {
      showXLabels: true
    } );

    const snapshotRows: GraphSnapshotRowNode[] = [];
    _.times( GraphData.MAX_SNAPSHOTS, index => {

      // The final plot shows x labels (lining them up for all stacked plots).
      const plotOptions = index === GraphData.MAX_SNAPSHOTS - 1 ? labeledSnapshotPlotOptions : snapshotPlotOptions;
      snapshotRows.push( new GraphSnapshotRowNode( xRange, yZoomRanges, plotOptions ) );
    } );

    const plotsGridBox = new VBox( {
      spacing: 4,
      children: snapshotRows
    } );

    const zoomLevelProperty = new NumberProperty( parentZoomLevelProperty.value, {
      range: new Range( 1, yZoomRanges.length ),
      numberType: 'Integer',
      tandem: tandem.createTandem( 'zoomLevelProperty' )
    } );

    const zoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
      orientation: 'horizontal',
      spacing: 5,
      magnifyingGlassNodeOptions: {
        glassRadius: 10.5
      },
      buttonOptions: {
        baseColor: PhotoelectricEffectColors.screenBackgroundColorProperty
      },
      tandem: tandem.createTandem( 'zoomButtonGroup' )
    } );

    const contentVBox = new VBox( {
      spacing: 12,
      align: 'center',
      children: [
        plotsGridBox,
        zoomButtonGroup
      ]
    } );

    const titleText = new Text( titleStringProperty, {
      font: PhotoelectricEffectConstants.DIALOG_TITLE_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    /**
     * Redraw snapshot rows from model data. Rows remain in a fixed VBox order where the last row has the plot with
     * x-axis labels. Iterating backward assigns snapshots from newest to oldest, so the newest snapshot always lands
     * on the labeled bottom row.
     */
    const updateSnapshotPlots = () => {
      const snapshots = graphData.getSnapshots();
      let snapshotIndex = snapshots.length - 1;

      for ( let rowIndex = snapshotRows.length - 1; rowIndex >= 0; rowIndex-- ) {
        const snapshotRowNode = snapshotRows[ rowIndex ];

        // Fill rows bottom-to-top with available snapshots.
        if ( snapshotIndex >= 0 ) {
          snapshotRowNode.setSnapshot( snapshotIndex + 1, snapshots[ snapshotIndex ] );
          snapshotIndex--;
        }
        else {
          snapshotRowNode.clearSnapshot();
        }
      }
    };

    zoomLevelProperty.link( zoomLevel => {
      snapshotRows.forEach( snapshotRowNode => {
        snapshotRowNode.setZoomLevel( zoomLevel );
      } );
    } );

    const updateOnShow = () => {
      zoomLevelProperty.value = parentZoomLevelProperty.value;
      updateSnapshotPlots();
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
}
