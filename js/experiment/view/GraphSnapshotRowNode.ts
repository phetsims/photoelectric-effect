// Copyright 2026, University of Colorado Boulder

/**
 * One row in the snapshots dialog: snapshot number, plot, and model data text.
 * Rows are created once and reused so dialog open/close cycles avoid repeated node allocation and disposal.
 * Each row exposes small methods to show one snapshot, clear stale content, and sync zoom with dialog controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import type Range from '../../../../dot/js/Range.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import getMaterialLabelStringProperty from '../../common/view/getMaterialLabelStringProperty.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphSnapshot from '../model/GraphSnapshot.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';

export default class GraphSnapshotRowNode extends HBox {

  // Chart area for this snapshot row.
  private readonly plotNode: GraphPlotAreaNode;

  /**
   * @param xRange - Shared x-axis range for the embedded plot.
   * @param yZoomRanges - Per-zoom-level y-axis ranges used by the plot area.
   * @param snapshotNumber - 1-based visible index for this row, fixed for the lifetime of the row.
   * @param snapshot - The snapshot this row is tied to. When the snapshot updates the row will re-render accordingly.
   * @param plotOptions - Rendering options for the plot area.
   */
  public constructor(
    xRange: Range,
    yZoomRanges: Range[],
    snapshotNumber: number,
    snapshot: GraphSnapshot,
    plotOptions: GraphPlotAreaNodeOptions
  ) {

    // Resolves the displayed material label from the snapshot's material identity. All material string Properties
    // are listed as dependencies so locale changes propagate correctly.
    const materialLabelStringProperty = new DerivedProperty( [
        snapshot.metadata.materialTypeProperty,
        snapshot.metadata.materialLabelKeyProperty,
        PhotoelectricEffectFluent.materials.sodiumStringProperty,
        PhotoelectricEffectFluent.materials.copperStringProperty,
        PhotoelectricEffectFluent.materials.calciumStringProperty,
        PhotoelectricEffectFluent.materials.platinumStringProperty,
        PhotoelectricEffectFluent.materials.zincStringProperty,
        PhotoelectricEffectFluent.materials.customStringProperty,
        PhotoelectricEffectFluent.materials.mysteryStringProperty,
        PhotoelectricEffectFluent.materials.mystery1StringProperty,
        PhotoelectricEffectFluent.materials.mystery2StringProperty,
        PhotoelectricEffectFluent.materials.mystery3StringProperty,
        PhotoelectricEffectFluent.materials.mystery4StringProperty,
        PhotoelectricEffectFluent.materials.mystery5StringProperty
      ],
      ( materialType, materialLabelKey ) => getMaterialLabelStringProperty( materialType, materialLabelKey ).value
    );

    /**
     * Each row has metadata displayed to the right. The first metadata item is the material (this is consistent across
     * all snapshot graph types). The second and third rows depend on the snapshot type and are defined by the
     * snapshot's metadata.
     */
    const materialLegendStringProperty = GraphSnapshotRowNode.formatLabelValue(
      PhotoelectricEffectFluent.experiment.graph.materialLabelStringProperty,
      materialLabelStringProperty
    );
    const secondLegendStringProperty = new PatternStringProperty(
      PhotoelectricEffectFluent.experiment.graph.snapshotLabelValuePatternStringProperty,
      {
        label: snapshot.metadata.secondValueLabelProperty,
        value: snapshot.metadata.secondValueProperty
      },
      {
        maps: {
          value: value => snapshot.metadata.formatSecondValue( value )
        }
      }
    );
    const thirdLegendStringProperty = new PatternStringProperty(
      PhotoelectricEffectFluent.experiment.graph.snapshotLabelValuePatternStringProperty,
      {
        label: snapshot.metadata.thirdValueLabelProperty,
        value: snapshot.metadata.thirdValueProperty
      },
      {
        maps: {
          value: value => snapshot.metadata.formatThirdValue( value )
        }
      }
    );

    const snapshotNumberText = new Text( `${snapshotNumber}`, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const materialText = new Text( materialLegendStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const secondMetadataText = new Text( secondLegendStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const thirdMetadataText = new Text( thirdLegendStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    const legendNode = new VBox( {
      spacing: 2,
      align: 'left',
      children: [
        materialText,
        secondMetadataText,
        thirdMetadataText
      ]
    } );

    const plotNode = new GraphPlotAreaNode( xRange, yZoomRanges, plotOptions );

    super( {
      spacing: 10,
      align: 'top',
      isDisposable: false,
      children: [
        snapshotNumberText,
        plotNode,
        legendNode
      ]
    } );

    this.plotNode = plotNode;

    snapshot.pointsProperty.link( points => {
      this.plotNode.setLineDataSet( [ ...points ] );
    } );
  }

  /**
   * Displays this snapshot row.
   */
  public setSnapshot(): void {
    this.visible = true;
  }

  /**
   * Hides this snapshot row.
   */
  public clearSnapshot(): void {
    this.visible = false;
  }

  /**
   * Syncs this row's plot zoom level to dialog controls.
   *
   * @param zoomLevel - 1-based zoom level from the dialog control.
   */
  public setZoomLevel( zoomLevel: number ): void {
    this.plotNode.zoomLevelProperty.value = zoomLevel;
  }

  /**
   * Formats one legend line using the shared "label: value" string pattern.
   */
  private static formatLabelValue( label: TReadOnlyProperty<string>, value: TReadOnlyProperty<string> | string ): PatternStringProperty<{
    label: TReadOnlyProperty<string>;
    value: TReadOnlyProperty<string> | string;
  }> {
    return new PatternStringProperty(
      PhotoelectricEffectFluent.experiment.graph.snapshotLabelValuePatternStringProperty,
      {
        label: label,
        value: value
      }
    );
  }
}
