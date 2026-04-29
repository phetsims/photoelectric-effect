// Copyright 2026, University of Colorado Boulder

/**
 * Dialog listing each stored GraphData snapshot as its own chart. Chart ranges are initialized from the parent
 * graph's active zoom level whenever the dialog is opened and can then be adjusted directly in the dialog.
 *
 * Plot nodes are created once and reused so open/close cycles avoid repeated node allocation and disposal.
 * The GridBox always allocates all snapshot slots; unused slots stay hidden via visibility. Snapshot charts share the
 * same GraphPlotAreaNode options as the parent graph (ranges, labels, grid, line styling) but omit the current-point
 * scatter layer.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import MagnifyingGlassZoomButtonGroup from '../../../../scenery-phet/js/MagnifyingGlassZoomButtonGroup.js';
import GridBox from '../../../../scenery/js/layout/nodes/GridBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
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
   * @param xRange - Shared x range used by each snapshot plot.
   * @param yZoomRanges - Y zoom presets used by each snapshot plot.
   * @param graphPlotAreaNodeOptions - Options used for each snapshot chart's plot area.
   */
  public constructor(
    tandem: Tandem,
    graphData: GraphData,
    parentZoomLevelProperty: TReadOnlyProperty<number>,
    xRange: Range,
    yZoomRanges: Range[],
    graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions
  ) {

    const snapshotPlotOptions = combineOptions<GraphPlotAreaNodeOptions>( {}, graphPlotAreaNodeOptions, {
      showCurrentPointMarker: false
    } );

    const snapshotPlotNodes: GraphPlotAreaNode[] = [];
    _.times( GraphData.MAX_SNAPSHOTS, () => {
      snapshotPlotNodes.push( new GraphPlotAreaNode( xRange, yZoomRanges, snapshotPlotOptions ) );
    } );

    const plotsGridBox = new GridBox( {
      autoColumns: 2,
      xSpacing: 16,
      ySpacing: 16,
      xAlign: 'left',
      children: snapshotPlotNodes
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

    const titleText = new Text( PhotoelectricEffectFluent.experiment.graph.snapshotsDialogTitleStringProperty, {
      font: PhotoelectricEffectConstants.DIALOG_TITLE_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    // Redraw snapshots. Only plots with data are displayed.
    const updateSnapshotPlots = () => {
      const snapshots = graphData.getSnapshots();

      snapshotPlotNodes.forEach( ( plotNode, i ) => {
        const hasSnapshot = i < snapshots.length;
        plotNode.visible = hasSnapshot;

        if ( hasSnapshot ) {
          plotNode.setLineDataSet( [ ...snapshots[ i ] ] );
        }
        else {
          plotNode.setLineDataSet( [] );
        }
      } );
    };

    zoomLevelProperty.link( zoomLevel => {
      snapshotPlotNodes.forEach( plotNode => {
        plotNode.zoomLevelProperty.value = zoomLevel;
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
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true,
      showCallback: updateOnShow
    } );
  }
}
