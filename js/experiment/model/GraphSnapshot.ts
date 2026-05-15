// Copyright 2026, University of Colorado Boulder

/**
 * Shared snapshot domain types and reusable model slot for experiment graph history. GraphData owns a fixed number
 * of these slots and rewrites their Property values when users save or restore snapshots.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import Material, { MaterialType } from '../../common/model/Material.js';

/**
 * Metadata captured with each GraphSnapshot. It is tightly coupled with GraphSnapshot so it seems best to keep here
 * instead of in its own file. These values are represented as Properties so reused view rows can stay linked to one
 * metadata instance while PhET-iO state or user actions update that instance in place.
 */
export class GraphSnapshotMetadata {

  // Canonical material identity for physics/state restoration and generic labeling.
  public readonly materialTypeProperty: EnumerationProperty<MaterialType>;

  // Optional instance-level label override key (for example mystery1/mystery2) used to preserve the exact
  // displayed material label in snapshot rows when multiple materials share one MaterialType.
  public readonly materialLabelKeyProperty: Property<string | null>;

  // Operating conditions captured when this metadata is saved.
  public readonly secondValueProperty: NumberProperty;
  public readonly thirdValueProperty: NumberProperty;

  /**
   * Creates metadata with explicit initial values. These values are required because metadata is part of each serialized
   * snapshot, and callers should make the initial material identity and operating conditions visible at construction.
   *
   * @param materialType - Canonical material identity.
   * @param materialLabelKey - Optional instance-level label override key for the material.
   * @param secondValueLabelProperty
   * @param secondValue - Captured second value.
   * @param formatSecondValue - Formatter for the second value shown in snapshot legends.
   * @param thirdValueLabelProperty
   * @param thirdValue - Captured third value.
   * @param formatThirdValue - Formatter for the third value shown in snapshot legends.
   * @param tandem - Used to instrument the metadata Properties.
   */
  public constructor(
    materialType: MaterialType,
    materialLabelKey: string | null,
    public readonly secondValueLabelProperty: TReadOnlyProperty<string>,
    secondValue: number,
    public readonly formatSecondValue: ( value: number ) => string,
    public readonly thirdValueLabelProperty: TReadOnlyProperty<string>,
    thirdValue: number,
    public readonly formatThirdValue: ( value: number ) => string,
    tandem: Tandem
  ) {
    this.materialTypeProperty = new EnumerationProperty( MaterialType.SODIUM, {
      tandem: tandem.createTandem( 'materialTypeProperty' ),
      phetioReadOnly: true
    } );
    this.materialLabelKeyProperty = new Property<string | null>( null, {
      tandem: tandem.createTandem( 'materialLabelKeyProperty' ),
      phetioValueType: NullableIO( StringIO ),
      phetioReadOnly: true
    } );
    this.secondValueProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'secondValueProperty' ),
      phetioReadOnly: true
    } );
    this.thirdValueProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'thirdValueProperty' ),
      phetioReadOnly: true
    } );

    this.setValues( materialType, materialLabelKey, secondValue, thirdValue );
  }

  /**
   * Sets all metadata Properties from captured model values.
   */
  public setValues(
    materialType: MaterialType,
    materialLabelKey: string | null,
    secondValue: number,
    thirdValue: number
  ): void {
    this.materialTypeProperty.value = materialType;
    this.materialLabelKeyProperty.value = materialLabelKey;
    this.secondValueProperty.value = secondValue;
    this.thirdValueProperty.value = thirdValue;
  }
}

type GraphSnapshotOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

/**
 * Reusable snapshot slot: sampled points plus captured model metadata. Properties are individually instrumented so
 * PhET-iO handles state save and restore automatically.
 */
export default class GraphSnapshot extends PhetioObject {

  // Deep-copied data points captured for this snapshot slot.
  public readonly pointsProperty: Property<ReadonlyArray<Vector2>>;

  // Captured material identity and operating conditions for this snapshot slot.
  public readonly metadata: GraphSnapshotMetadata;

  public constructor( secondValueLabelProperty: TReadOnlyProperty<string>,
                      formatSecondValue: ( value: number ) => string,
                      thirdValueLabelProperty: TReadOnlyProperty<string>,
                      formatThirdValue: ( value: number ) => string,
                      providedOptions: GraphSnapshotOptions ) {

    const options = optionize<GraphSnapshotOptions, EmptySelfOptions, PhetioObjectOptions>()( {
      phetioState: false,
      isDisposable: false
    }, providedOptions );

    super( options );

    this.pointsProperty = new Property<ReadonlyArray<Vector2>>( [], {
      tandem: options.tandem.createTandem( 'pointsProperty' ),
      phetioValueType: ArrayIO( Vector2.Vector2IO ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );

    this.metadata = new GraphSnapshotMetadata( MaterialType.SODIUM, null,
      secondValueLabelProperty, 0, formatSecondValue,
      thirdValueLabelProperty, 0, formatThirdValue,
      options.tandem
    );
  }

  /**
   * Captures model values into this reusable slot.
   *
   * @param points - Live graph points to deep copy into this slot.
   * @param materialProperty - Material property to capture for this slot's metadata.
   * @param secondValueProperty - Second value property to capture for this slot's metadata.
   * @param thirdValueProperty - Third value property to capture for this slot's metadata.
   */
  public save( points: ReadonlyArray<Vector2>, materialProperty: TReadOnlyProperty<Material>,
               secondValueProperty: TReadOnlyProperty<number>, thirdValueProperty: TReadOnlyProperty<number> ): void {
    this.pointsProperty.value = points.map( point => new Vector2( point.x, point.y ) );
    this.metadata.setValues(
      materialProperty.value.materialType,
      materialProperty.value.labelKey,
      secondValueProperty.value,
      thirdValueProperty.value
    );
  }

  /**
   * Clears large saved data from this slot. Scalar values are left in place because snapshotsCountProperty in GraphData
   * is the source of truth for whether this slot is active.
   */
  public clear(): void {
    this.pointsProperty.value = [];
  }
}
