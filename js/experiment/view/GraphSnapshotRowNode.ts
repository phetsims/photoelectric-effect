// Copyright 2026, University of Colorado Boulder

/**
 * One row in the snapshots dialog: snapshot number, plot, and model data text.
 * Rows are created once and reused so dialog open/close cycles avoid repeated node allocation and disposal.
 * Each row exposes small methods to show one snapshot, clear stale content, and sync zoom with dialog controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import PatternStringProperty from '../../../../axon/js/PatternStringProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import type Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import getMaterialLabelStringProperty from '../../common/view/getMaterialLabelStringProperty.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphSnapshot, { type GraphSnapshotMetadataField, type GraphSnapshotMetadataFieldPair } from '../model/GraphSnapshot.js';
import GraphPlotAreaNode, { type GraphPlotAreaNodeOptions } from './GraphPlotAreaNode.js';

type DisposableStringProperty = TReadOnlyProperty<string> & { dispose: () => void };

export default class GraphSnapshotRowNode extends HBox {

  // Left-side snapshot index shown for this row.
  private readonly snapshotNumberText: Text;

  // Snapshot metadata entries shown in the legend area.
  private readonly materialText: Text;
  private readonly secondMetadataText: Text;
  private readonly thirdMetadataText: Text;

  // Field ordering for second and third metadata lines.
  private readonly metadataFields: GraphSnapshotMetadataFieldPair;

  // Chart area for this snapshot row.
  private readonly plotNode: GraphPlotAreaNode;

  // Disposable string properties created for the current row contents and disposed when content is replaced.
  private readonly legendPatternStringProperties: DisposableStringProperty[];

  /**
   * @param xRange - Shared x-axis range for the embedded plot.
   * @param yZoomRanges - Per-zoom-level y-axis ranges used by the plot area.
   * @param metadataFields - Ordered fields shown on the second and third legend lines.
   * @param plotOptions - Rendering options for the plot area.
   */
  public constructor(
    xRange: Range,
    yZoomRanges: Range[],
    metadataFields: GraphSnapshotMetadataFieldPair,
    plotOptions: GraphPlotAreaNodeOptions
  ) {
    const snapshotNumberText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const materialText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const secondMetadataText = new Text( '', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );
    const thirdMetadataText = new Text( '', {
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
      children: [
        snapshotNumberText,
        plotNode,
        legendNode
      ]
    } );

    this.snapshotNumberText = snapshotNumberText;
    this.materialText = materialText;
    this.secondMetadataText = secondMetadataText;
    this.thirdMetadataText = thirdMetadataText;
    this.plotNode = plotNode;
    this.metadataFields = metadataFields;
    this.legendPatternStringProperties = [];
  }

  /**
   * Displays one captured snapshot in this row.
   *
   * @param snapshotNumber - 1-based visible index for this snapshot.
   * @param snapshot - Immutable snapshot to render.
   */
  public setSnapshot( snapshotNumber: number, snapshot: GraphSnapshot ): void {
    this.materialText.setStringProperty( null );
    this.secondMetadataText.setStringProperty( null );
    this.thirdMetadataText.setStringProperty( null );
    this.disposeLegendPatternStringProperties();

    this.visible = true;
    this.plotNode.setLineDataSet( [ ...snapshot.points ] );
    this.snapshotNumberText.string = `${snapshotNumber}`;

    const materialValueProperty = getMaterialLabelStringProperty(
      snapshot.metadata.materialType,
      snapshot.metadata.materialLabelKey
    );
    const materialLabelProperty = PhotoelectricEffectFluent.experiment.graph.materialLabelStringProperty;
    const secondValueStringProperty = this.getMetadataValueString( this.metadataFields[ 0 ], snapshot );
    const thirdValueStringProperty = this.getMetadataValueString( this.metadataFields[ 1 ], snapshot );
    const materialLegendStringProperty = this.formatLabelValue( materialLabelProperty, materialValueProperty );
    const secondLegendStringProperty = this.formatLabelValue(
      this.getMetadataLabelStringProperty( this.metadataFields[ 0 ] ),
      secondValueStringProperty
    );
    const thirdLegendStringProperty = this.formatLabelValue(
      this.getMetadataLabelStringProperty( this.metadataFields[ 1 ] ),
      thirdValueStringProperty
    );

    this.legendPatternStringProperties.push(
      secondValueStringProperty,
      thirdValueStringProperty,
      materialLegendStringProperty,
      secondLegendStringProperty,
      thirdLegendStringProperty
    );

    this.setLegendText( materialLegendStringProperty, secondLegendStringProperty, thirdLegendStringProperty );
  }

  /**
   * Updates all legend lines for this row.
   *
   * @param materialStringProperty - Text shown on the first legend line (material).
   * @param secondMetadataStringProperty - Text shown on the second legend line.
   * @param thirdMetadataStringProperty - Text shown on the third legend line.
   */
  public setLegendText(
    materialStringProperty: TReadOnlyProperty<string>,
    secondMetadataStringProperty: TReadOnlyProperty<string>,
    thirdMetadataStringProperty: TReadOnlyProperty<string>
  ): void {
    this.materialText.setStringProperty( materialStringProperty );
    this.secondMetadataText.setStringProperty( secondMetadataStringProperty );
    this.thirdMetadataText.setStringProperty( thirdMetadataStringProperty );
  }

  /**
   * Hides this row and removes all previously shown values.
   */
  public clearSnapshot(): void {
    this.materialText.setStringProperty( null );
    this.secondMetadataText.setStringProperty( null );
    this.thirdMetadataText.setStringProperty( null );
    this.disposeLegendPatternStringProperties();

    this.visible = false;
    this.plotNode.setLineDataSet( [] );
    this.snapshotNumberText.string = '';
  }

  public override dispose(): void {
    this.clearSnapshot();
    super.dispose();
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
   * Gets formatted metadata value text for the requested field.
   */
  private getMetadataValueString( metadataField: GraphSnapshotMetadataField, snapshot: GraphSnapshot ): DisposableStringProperty {
    return metadataField === 'wavelength' ? this.formatWavelength( snapshot.metadata.wavelength ) :
           metadataField === 'intensity' ? this.formatIntensity( snapshot.metadata.intensity ) :
           metadataField === 'voltage' ? this.formatVoltage( snapshot.metadata.voltage ) :
           ( () => { throw new Error( `Unsupported metadata field: ${metadataField}` ); } )();
  }

  /**
   * Gets the localized label for a metadata field.
   */
  private getMetadataLabelStringProperty( metadataField: GraphSnapshotMetadataField ): TReadOnlyProperty<string> {
    return metadataField === 'wavelength' ? PhotoelectricEffectFluent.wavelength.labelStringProperty :
           metadataField === 'intensity' ? PhotoelectricEffectFluent.intensity.labelStringProperty :
           metadataField === 'voltage' ? PhotoelectricEffectFluent.voltage.labelStringProperty :
           ( () => { throw new Error( `Unsupported metadata field: ${metadataField}` ); } )();
  }

  /**
   * Formats one legend line using the shared "label: value" string pattern.
   */
  private formatLabelValue( label: TReadOnlyProperty<string>, value: TReadOnlyProperty<string> | string ): PatternStringProperty<{
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

  /**
   * Formats wavelength readouts for legend display. Returns a Property for a more consistent interface
   * with other values above.
   */
  private formatWavelength( wavelength: number ): DisposableStringProperty {
    return new TinyProperty( toFixed( wavelength, 2 ) );
  }

  /**
   * Formats intensity readouts with the localized percent pattern.
   */
  private formatIntensity( intensity: number ): PatternStringProperty<{ value: string }> {
    return new PatternStringProperty(
      PhotoelectricEffectFluent.intensity.percentReadoutPatternStringProperty,
      {
        value: toFixed( intensity, 0 )
      }
    );
  }

  /**
   * Formats voltage readouts with the localized voltage pattern.
   */
  private formatVoltage( voltage: number ): PatternStringProperty<{ value: string }> {
    return new PatternStringProperty(
      PhotoelectricEffectFluent.voltage.valueReadoutPatternStringProperty,
      {
        value: toFixed( voltage, 2 )
      }
    );
  }

  /**
   * Disposes and clears string properties created for current legend content.
   */
  private disposeLegendPatternStringProperties(): void {
    this.legendPatternStringProperties.forEach( patternStringProperty => {
      patternStringProperty.dispose();
    } );
    this.legendPatternStringProperties.length = 0;
  }
}
