// Copyright 2026, University of Colorado Boulder

/**
 * Dialog listing each stored GraphData snapshot as its own chart. Chart ranges match the parent graph's active
 * zoom level at the time the dialog is opened (see showCallback).
 *
 * TODO: In the future, the zoom level for these will also be controllable.
 *
 * Plot nodes are created once and reused so open/close cycles avoid repeated node allocation and disposal.
 * The VBox always lists all snapshot slots; unused slots stay hidden via visibility. Snapshot charts share the
 * same GraphPlotAreaNode options as the parent graph (ranges, labels, grid, line styling).
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphData from '../model/GraphData.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';

export default class GraphSnapshotsDialog extends Dialog {

  /**
   * @param tandem
   * @param graphData - Model that owns live samples and immutable snapshot copies for this dialog.
   * @param parentZoomLevelProperty - 1-based zoom index from the parent graph's chart; its current value whenever the
   *                                  dialog is shown sets the initial zoom level for charts in this dialog.
   * @param graphPlotAreaNodeOptions - Options used for each snapshot chart's plot area.
   */
  public constructor(
    tandem: Tandem,
    graphData: GraphData,
    parentZoomLevelProperty: TReadOnlyProperty<number>,
    graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions
  ) {

    const snapshotPlotNodes: GraphPlotAreaNode[] = [];
    const initialZoomLevel = parentZoomLevelProperty.value;

    for ( let i = 0; i < GraphData.MAX_SNAPSHOTS; i++ ) {
      snapshotPlotNodes.push( new GraphPlotAreaNode( combineOptions<GraphPlotAreaNodeOptions>(
        {},
        graphPlotAreaNodeOptions,
        { initialZoomLevel: initialZoomLevel }
      ) ) );
    }

    const plotsVBox = new VBox( {
      spacing: 16,
      align: 'left',
      children: snapshotPlotNodes
    } );

    const titleText = new Text( PhotoelectricEffectFluent.experiment.graph.snapshotsDialogTitleStringProperty, {
      font: PhotoelectricEffectConstants.DIALOG_TITLE_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    // Redraw snapshots. Only plots with data are displayed.
    const updateSnapshotPlots = () => {
      const zoomLevel = parentZoomLevelProperty.value;
      const snapshots = graphData.getSnapshots();

      for ( let i = 0; i < snapshotPlotNodes.length; i++ ) {
        const plotNode = snapshotPlotNodes[ i ];
        plotNode.zoomLevelProperty.value = zoomLevel;

        const hasSnapshot = i < snapshots.length;
        plotNode.visible = hasSnapshot;

        if ( hasSnapshot ) {
          plotNode.setDataSet( [ ...snapshots[ i ] ] );
        }
        else {
          plotNode.setDataSet( [] );
        }
      }
    };

    updateSnapshotPlots();

    super( plotsVBox, {
      title: titleText,
      xSpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      cornerRadius: PhotoelectricEffectConstants.DIALOG_CORNER_RADIUS,
      ySpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true,
      showCallback: updateSnapshotPlots
    } );
  }
}
