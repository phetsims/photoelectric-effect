// Copyright 2026, University of Colorado Boulder

/**
 * Dialog listing each stored GraphData snapshot as its own chart.
 *
 * Snapshot rows are created once and reused so open/close cycles avoid repeated node allocation and disposal.
 * GraphSnapshotsContentNode owns the plot stack, zoom controls, and reference line overlay.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../../../dot/js/Range.js';
import Text from '../../../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../../../sun/js/Dialog.js';
import Tandem from '../../../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../../../../common/PhotoelectricEffectConstants.js';
import type GraphData from '../../../model/GraphData.js';
import type { GraphPlotAreaNodeOptions } from '../GraphPlotAreaNode.js';
import GraphSnapshotsContentNode from './GraphSnapshotsContentNode.js';
import { type GraphSnapshotsReferenceLineValueDisplayOptions } from './referenceLine/GraphSnapshotsReferenceLineNode.js';

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
   * @param referenceLineXDisplayOptions - Formatting and display range for the reference line x readout.
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
    const contentNode = new GraphSnapshotsContentNode(
      tandem,
      graphData,
      parentZoomLevelProperty,
      xRange,
      yZoomRanges,
      graphPlotAreaNodeOptions,
      referenceLineXDisplayOptions,
      referenceLineYDisplayOptions
    );

    const titleText = new Text( titleStringProperty, {
      font: PhotoelectricEffectConstants.DIALOG_TITLE_FONT,
      maxWidth: PhotoelectricEffectConstants.DIALOG_MAX_CONTENT_WIDTH
    } );

    super( contentNode, {
      title: titleText,
      xSpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      cornerRadius: PhotoelectricEffectConstants.DIALOG_CORNER_RADIUS,
      ySpacing: PhotoelectricEffectConstants.DIALOG_SPACING,
      titleAlign: 'left',
      isDisposable: false,
      tandem: tandem,
      phetioReadOnly: true,
      showCallback: () => {
        contentNode.updateOnShow();
      }
    } );
  }
}
