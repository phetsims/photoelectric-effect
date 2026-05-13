// Copyright 2026, University of Colorado Boulder

/**
 * One row in the snapshots dialog: snapshot number, plot, and model data text.
 * Rows are created once and reused so dialog open/close cycles avoid repeated node allocation and disposal.
 * Each row exposes small methods to show one snapshot, clear stale content, and sync zoom with dialog controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import type Range from '../../../../dot/js/Range.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import getMaterialLabelStringProperty from '../../common/view/getMaterialLabelStringProperty.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphSnapshot, { GraphSnapshotMetadata } from '../model/GraphSnapshot.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';

export default class GraphSnapshotRowNode extends HBox {

  // Left-side snapshot index shown for this row.
  private readonly snapshotNumberText: Text;

  // Chart area for this snapshot row.
  private readonly plotNode: GraphPlotAreaNode;

  // Row-local string Properties used by stable PatternStringProperties.
  private readonly materialValueStringProperty: StringProperty;

  // Snapshot and selected material label currently displayed by this row.
  private displayedSnapshot: GraphSnapshot | null = null;
  private materialLabelStringProperty: TReadOnlyProperty<string> | null = null;

  // Stable listeners used when this row is reassigned to a different reusable snapshot slot.
  private readonly updateValueStringsListener: () => void;
  private readonly updatePlotListener: () => void;

  /**
   * @param xRange - Shared x-axis range for the embedded plot.
   * @param yZoomRanges - Per-zoom-level y-axis ranges used by the plot area.
   * @param snapshotMetadata - Metadata properties and formatting functions used by the legend text.
   * @param plotOptions - Rendering options for the plot area.
   */
  public constructor(
    xRange: Range,
    yZoomRanges: Range[],
    snapshotMetadata: GraphSnapshotMetadata,
    plotOptions: GraphPlotAreaNodeOptions
  ) {

    // These strings hold the value for each row in the snapshot.
    const materialValueStringProperty = new StringProperty( '' );

    // These strings hold the full localized row string for the snapshot, combining label with value.
    const materialLegendStringProperty = GraphSnapshotRowNode.formatLabelValue(
      PhotoelectricEffectFluent.experiment.graph.materialLabelStringProperty,
      materialValueStringProperty
    );
    const secondLegendStringProperty = new PatternStringProperty(
      PhotoelectricEffectFluent.experiment.graph.snapshotLabelValuePatternStringProperty,
      {
        label: snapshotMetadata.secondValueLabelProperty,
        value: snapshotMetadata.secondValueProperty
      },
      {
        maps: {
          value: value => snapshotMetadata.formatSecondValue( value )
        }
      }
    );
    const thirdLegendStringProperty = new PatternStringProperty(
      PhotoelectricEffectFluent.experiment.graph.snapshotLabelValuePatternStringProperty,
      {
        label: snapshotMetadata.thirdValueLabelProperty,
        value: snapshotMetadata.thirdValueProperty
      },
      {
        maps: {
          value: value => snapshotMetadata.formatThirdValue( value )
        }
      }
    );

    // These Text nodes are created once. setDisplayedSnapshot updates the Properties that feed them when this row is
    // assigned to a different snapshot slot.
    const snapshotNumberText = new Text( '', {
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

    this.snapshotNumberText = snapshotNumberText;
    this.plotNode = plotNode;
    this.materialValueStringProperty = materialValueStringProperty;
    this.updateValueStringsListener = this.updateValueStrings.bind( this );
    this.updatePlotListener = this.updatePlot.bind( this );
  }

  /**
   * Displays one captured snapshot in this row.
   *
   * @param snapshotNumber - 1-based visible index for this snapshot.
   * @param snapshot - Reusable snapshot slot to render.
   */
  public setSnapshot( snapshotNumber: number, snapshot: GraphSnapshot ): void {
    this.visible = true;
    this.setDisplayedSnapshot( snapshot );
    this.snapshotNumberText.string = `${snapshotNumber}`;
  }

  /**
   * Hides this row and removes all previously shown values.
   */
  public clearSnapshot(): void {
    this.visible = false;
    this.setDisplayedSnapshot( null );
    this.snapshotNumberText.string = '';
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
   * Replaces the snapshot this row observes. This keeps row dependencies scoped to the one displayed snapshot and the
   * selected material label string Property.
   */
  private setDisplayedSnapshot( snapshot: GraphSnapshot | null ): void {
    if ( snapshot === this.displayedSnapshot ) {
      this.updateValueStrings();
      this.updatePlot();
      return;
    }

    this.unlinkDisplayedSnapshot();
    this.displayedSnapshot = snapshot;

    if ( snapshot ) {
      snapshot.metadata.materialTypeProperty.lazyLink( this.updateValueStringsListener );
      snapshot.metadata.materialLabelKeyProperty.lazyLink( this.updateValueStringsListener );
      snapshot.pointsProperty.lazyLink( this.updatePlotListener );
    }

    this.updateValueStrings();
    this.updatePlot();
  }

  /**
   * Unlinks listeners from the previously displayed snapshot and selected material label.
   */
  private unlinkDisplayedSnapshot(): void {
    const snapshot = this.displayedSnapshot;
    if ( snapshot ) {
      snapshot.metadata.materialTypeProperty.unlink( this.updateValueStringsListener );
      snapshot.metadata.materialLabelKeyProperty.unlink( this.updateValueStringsListener );
      snapshot.pointsProperty.unlink( this.updatePlotListener );
    }

    if ( this.materialLabelStringProperty ) {
      this.materialLabelStringProperty.unlink( this.updateValueStringsListener );
      this.materialLabelStringProperty = null;
    }
  }

  /**
   * Updates row-local value strings from the current snapshot.
   */
  private updateValueStrings(): void {
    const snapshot = this.displayedSnapshot;
    const materialLabelStringProperty = snapshot === null ? null : getMaterialLabelStringProperty(
      snapshot.metadata.materialTypeProperty.value,
      snapshot.metadata.materialLabelKeyProperty.value
    );

    if ( materialLabelStringProperty !== this.materialLabelStringProperty ) {
      if ( this.materialLabelStringProperty ) {
        this.materialLabelStringProperty.unlink( this.updateValueStringsListener );
      }
      this.materialLabelStringProperty = materialLabelStringProperty;
      if ( this.materialLabelStringProperty ) {
        this.materialLabelStringProperty.lazyLink( this.updateValueStringsListener );
      }
    }

    this.materialValueStringProperty.value = materialLabelStringProperty === null ? '' : materialLabelStringProperty.value;
  }

  /**
   * Updates the embedded plot from the current snapshot.
   */
  private updatePlot(): void {
    const snapshot = this.displayedSnapshot;
    this.plotNode.setLineDataSet( snapshot === null ? [] : [ ...snapshot.pointsProperty.value ] );
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
