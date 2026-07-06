// Copyright 2026, University of Colorado Boulder

/**
 * GraphAssemblyAccordionBox composes GraphPlotAreaNode with experiment-specific snapshot controls and readouts.
 * It owns the expand/collapse state and coordinates GraphData with the reusable plot area.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../dot/js/Range.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import AccordionBox, { type AccordionBoxOptions } from '../../../../../sun/js/AccordionBox.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import GraphData from '../../model/GraphData.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';
import GraphSnapshotButtonColumnNode from './GraphSnapshotButtonColumnNode.js';
import GraphSnapshotStatusNode from './GraphSnapshotStatusNode.js';
import GraphSnapshotsDialog from './snapshots/GraphSnapshotsDialog.js';
import { type GraphSnapshotsReferenceLineValueDisplayOptions } from './snapshots/referenceLine/GraphSnapshotsReferenceLineNode.js';

// Horizontal spacing between the chart content and the right-side button column.
const GRAPH_ASSEMBLY_BUTTON_COLUMN_SPACING = 10;

type SelfOptions = {

  // Nested options forwarded to GraphPlotAreaNode.
  graphPlotAreaNodeOptions: GraphPlotAreaNodeOptions;

  // Format options for the reference line's x-value readout in the snapshots dialog.
  referenceLineXDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions;

  // Format options for the reference line's y-value readouts in the snapshots dialog.
  referenceLineYDisplayOptions: GraphSnapshotsReferenceLineValueDisplayOptions;

  // Accessible names for each button in the right-side column.
  cameraButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  trashButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleNameProperty: TReadOnlyProperty<string>;
  snapshotsGalleryButtonAccessibleHelpTextProperty: TReadOnlyProperty<string>;
};

export type GraphAssemblyAccordionBoxOptions =
  SelfOptions & AccordionBoxOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

export default class GraphAssemblyAccordionBox extends AccordionBox {

  /**
   * @param graphData - Source of live samples, snapshots, and current operating-point state.
   * @param xRange - Shared x range used for all zoom levels in this plot.
   * @param yZoomRanges - Zoom presets for the y axis, from any order (sorted internally by span).
   * @param snapshotsDialogTitleStringProperty - Localized title shown in this graph's snapshots dialog.
   * @param providedOptions - AccordionBox options plus graph-plot-area configuration forwarded to child components.
   */
  public constructor(
    graphData: GraphData,
    xRange: Range,
    yZoomRanges: Range[],
    snapshotsDialogTitleStringProperty: TReadOnlyProperty<string>,
    providedOptions: GraphAssemblyAccordionBoxOptions
  ) {
    const options = optionize<GraphAssemblyAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      allowContentToOverlapTitle: true,
      titleBarExpandCollapse: false,
      focusHighlightTarget: 'expandCollapseButton',
      contentXMargin: 0,
      contentYMargin: 0,

      // These graphs have no visible title, so pin the expand/collapse button to the top.
      titleAlignY: 'top',
      buttonYMargin: 0,
      titleYMargin: 0,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      stroke: null
    }, providedOptions );

    const tandem = options.tandem;

    const graphPlotAreaNode = new GraphPlotAreaNode( xRange, yZoomRanges, options.graphPlotAreaNodeOptions );

    const plotContentNode = new Node( {
      children: [
        graphPlotAreaNode,
        new GraphSnapshotStatusNode( graphData, graphPlotAreaNode.plotBounds )
      ]
    } );

    const snapshotsDialog = new GraphSnapshotsDialog(
      tandem.createTandem( 'snapshotsDialog' ),
      graphData,
      graphPlotAreaNode.zoomLevelProperty,
      xRange,
      yZoomRanges,
      snapshotsDialogTitleStringProperty,
      options.graphPlotAreaNodeOptions,
      options.referenceLineXDisplayOptions,
      options.referenceLineYDisplayOptions
    );

    const buttonColumn = new GraphSnapshotButtonColumnNode( graphData, () => {
      snapshotsDialog.show();
    }, {
      tandem: tandem,
      cameraButtonAccessibleNameProperty: options.cameraButtonAccessibleNameProperty,
      trashButtonAccessibleNameProperty: options.trashButtonAccessibleNameProperty,
      snapshotsGalleryButtonAccessibleNameProperty: options.snapshotsGalleryButtonAccessibleNameProperty,
      snapshotsGalleryButtonAccessibleHelpTextProperty: options.snapshotsGalleryButtonAccessibleHelpTextProperty
    } );

    const contentRow = new HBox( {
      spacing: GRAPH_ASSEMBLY_BUTTON_COLUMN_SPACING,
      align: 'top',
      children: [
        plotContentNode,
        buttonColumn
      ]
    } );

    super( contentRow, options );

    const syncLinePlot = () => {

      // Revealed curve points currently shown in the line plot.
      const lineDataSet = [ ...graphData.getDataPoints() ];

      graphPlotAreaNode.setLineDataSet( lineDataSet );
      graphPlotAreaNode.zoomToFitDataSetY( lineDataSet, graphData.currentPointProperty.value );
    };
    graphData.dataChangedEmitter.addListener( syncLinePlot );
    syncLinePlot();

    graphData.currentPointProperty.link( currentPoint => {
      graphPlotAreaNode.setCurrentPointMarker( currentPoint );
    } );
  }
}
