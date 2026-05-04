// Copyright 2026, University of Colorado Boulder

/**
 * One row in the snapshots dialog: snapshot number, plot, and model data text.
 * Rows are created once and reused so dialog open/close cycles avoid repeated node allocation and disposal.
 * Each row exposes small methods to show one snapshot, clear stale content, and sync zoom with dialog controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type Range from '../../../../dot/js/Range.js';
import type Vector2 from '../../../../dot/js/Vector2.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';

export default class GraphSnapshotRowNode extends HBox {

  // Left-side snapshot index shown for this row.
  private readonly snapshotNumberText: Text;

  // Placeholder legend entries; future model metadata will set these strings.
  private readonly materialText: Text;
  private readonly wavelengthText: Text;
  private readonly intensityText: Text;

  // Chart area for this snapshot row.
  private readonly plotNode: GraphPlotAreaNode;

  public constructor( xRange: Range, yZoomRanges: Range[], plotOptions: GraphPlotAreaNodeOptions ) {
    const snapshotNumberText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const materialText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const wavelengthText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const intensityText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    // Placeholder legend rows; these will be replaced with snapshot metadata from the model.
    const legendNode = new VBox( {
      spacing: 2,
      align: 'left',
      children: [
        materialText,
        wavelengthText,
        intensityText
      ]
    } );

    const plotNode = new GraphPlotAreaNode( xRange, yZoomRanges, plotOptions );

    super( {
      spacing: 10,
      align: 'top',
      children: [
        snapshotNumberText,
        plotNode,
        legendNode
      ]
    } );

    this.snapshotNumberText = snapshotNumberText;
    this.materialText = materialText;
    this.wavelengthText = wavelengthText;
    this.intensityText = intensityText;
    this.plotNode = plotNode;
  }

  /**
   * Displays one captured snapshot in this row.
   *
   * @param snapshotNumber - 1-based visible index for this snapshot.
   * @param dataSet - Immutable snapshot points to render.
   */
  public setSnapshot( snapshotNumber: number, dataSet: ReadonlyArray<Vector2> ): void {
    this.visible = true;
    this.plotNode.setLineDataSet( [ ...dataSet ] );
    this.snapshotNumberText.string = `${snapshotNumber}`;

    // Placeholder values for future snapshot metadata from the model.
    this.setLegendText( 'material...', 'wavelength...', 'intensity...' );
  }

  /**
   * Entry point for setting metadata legend values.
   *
   * @param materialString
   * @param wavelengthString
   * @param intensityString
   */
  public setLegendText( materialString: string, wavelengthString: string, intensityString: string ): void {
    this.materialText.string = materialString;
    this.wavelengthText.string = wavelengthString;
    this.intensityText.string = intensityString;
  }

  /**
   * Hides this row and removes all previously shown values.
   */
  public clearSnapshot(): void {
    this.visible = false;
    this.plotNode.setLineDataSet( [] );
    this.snapshotNumberText.string = '';
    this.setLegendText( '', '', '' );
  }

  /**
   * Syncs this row's plot zoom level to dialog controls.
   *
   * @param zoomLevel - 1-based zoom level from the dialog control.
   */
  public setZoomLevel( zoomLevel: number ): void {
    this.plotNode.zoomLevelProperty.value = zoomLevel;
  }
}
