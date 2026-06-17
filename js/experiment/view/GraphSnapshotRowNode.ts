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
import type Bounds2 from '../../../../dot/js/Bounds2.js';
import type Range from '../../../../dot/js/Range.js';
import type Vector2 from '../../../../dot/js/Vector2.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import type Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import getMaterialLabelStringProperty from '../../common/view/getMaterialLabelStringProperty.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphSnapshot from '../model/GraphSnapshot.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';

export default class GraphSnapshotRowNode extends HBox {

  // Snapshot data displayed by this row.
  public readonly pointsProperty: TReadOnlyProperty<ReadonlyArray<Vector2>>;

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
    this.pointsProperty = snapshot.pointsProperty;

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
   * Shows or hides this row's x-axis tick marks, tick labels, and axis label.
   */
  public setShowXLabels( showXLabels: boolean ): void {
    this.plotNode.setShowXLabels( showXLabels );
  }

  /**
   * Bounds of the plot area in the coordinate frame of another node, typically the dialog overlay parent.
   */
  public getPlotBoundsInNode( node: Node ): Bounds2 {
    return node.globalToLocalBounds( this.plotNode.localToGlobalBounds( this.plotNode.plotBounds ) );
  }

  /**
   * Converts a model x value to the plot's local view coordinate.
   */
  public modelToViewX( x: number ): number {
    return this.plotNode.modelToViewX( x );
  }

  /**
   * Converts a model x delta to a view-coordinate delta.
   */
  public modelToViewDeltaX( deltaX: number ): number {
    return this.plotNode.modelToViewDeltaX( deltaX );
  }

  /**
   * Converts a view-coordinate x delta to a model delta.
   */
  public viewToModelDeltaX( deltaX: number ): number {
    return this.plotNode.viewToModelDeltaX( deltaX );
  }

  /**
   * Finds the nearest saved snapshot point to the provided x value and returns its y value.
   */
  public getClosestYValue( x: number ): number | null {
    const points = this.pointsProperty.value;
    if ( points.length === 0 ) {
      return null;
    }

    let closestPoint = points[ 0 ];
    let closestDistance = Math.abs( x - closestPoint.x );
    for ( let i = 1; i < points.length; i++ ) {
      const distance = Math.abs( x - points[ i ].x );
      if ( distance < closestDistance ) {
        closestPoint = points[ i ];
        closestDistance = distance;
      }
    }

    return closestPoint.y;
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
