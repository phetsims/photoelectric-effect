// Copyright 2026, University of Colorado Boulder

/**
 * Shared snapshot domain types, reusable model slot, and serialization for experiment graph history. GraphData owns a
 * fixed number of these slots and rewrites their Property values when users save or restore snapshots.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2, { type Vector2StateObject } from '../../../../dot/js/Vector2.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import Material, { MaterialType } from '../../common/model/Material.js';


/**
 * Metadata captured with each GraphSnapshot. It is tightly coupled with GraphSnapshot so it seems best to keep here
 * instead of in its own file. These values are represented as Properties so reused view rows can stay linked to one
 * metadata instance while PhET-iO state or user actions update that instance in place.
 */
export class GraphSnapshotMetadata {

  // Canonical material identity for physics/state restoration and generic labeling.
  //TODO: These need to be instrumented
  public readonly materialTypeProperty = new EnumerationProperty( MaterialType.SODIUM );

  // Optional instance-level label override key (for example mystery1/mystery2) used to preserve the exact
  // displayed material label in snapshot rows when multiple materials share one MaterialType.
  public readonly materialLabelKeyProperty = new Property<string | null>( null );

  // Operating conditions captured when this metadata is saved.
  //TODO: These need to be instrumented
  public readonly secondValueProperty = new NumberProperty( 0 );
  public readonly thirdValueProperty = new NumberProperty( 0 );


  /**
   * Creates metadata with explicit initial values. These values are required because metadata is part of each serialized
   * snapshot, and callers should make the initial material identity and operating conditions visible at construction.
   *
   * @param materialType - Canonical material identity.
   * @param materialLabelKey - Optional instance-level label override key for the material.
   *
   * // Each graph snapshot is tracking two separate values alongside the material. These can vary between
   * @param secondValue - Captured wavelength value.
   * @param formatSecondValue - Formatter for the second value shown in snapshot legends.
   * @param thirdValue - Captured intensity value.
   * @param formatThirdValue - Formatter for the third value shown in snapshot legends.
   */
  public constructor(
    materialType: MaterialType,
    materialLabelKey: string | null,
    public readonly secondValueLabelProperty: TReadOnlyProperty<string>,
    secondValue: number,
    public readonly formatSecondValue: ( value: number ) => string,
    public readonly thirdValueLabelProperty: TReadOnlyProperty<string>,
    thirdValue: number,
    public readonly formatThirdValue: ( value: number ) => string
  ) {
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

// PhET-iO serialized form for one reusable GraphSnapshot slot.
export type GraphSnapshotStateObject = {
  points: Vector2StateObject[];
};

/**
 * Reusable snapshot slot: sampled points plus captured model metadata. Scalar values are represented as Properties so
 * reused view rows can stay linked to one slot while PhET-iO state or user actions update that slot in place.
 */
export default class GraphSnapshot {

  // Deep-copied data points captured for this snapshot slot.
  public readonly pointsProperty = new Property<ReadonlyArray<Vector2>>( [] );

  // Captured material identity and operating conditions for this snapshot slot.
  public readonly metadata: GraphSnapshotMetadata;

  public constructor( secondValueLabelProperty: TReadOnlyProperty<string>,
                      formatSecondValue: ( value: number ) => string,
                      thirdValueLabelProperty: TReadOnlyProperty<string>,
                      formatThirdValue: ( value: number ) => string ) {
    this.metadata = new GraphSnapshotMetadata( MaterialType.SODIUM, null,
      secondValueLabelProperty, 0, formatSecondValue,
      thirdValueLabelProperty, 0, formatThirdValue );
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

  /**
   * Converts this snapshot slot to the PhET-iO state shape.
   */
  public toStateObject(): GraphSnapshotStateObject {
    return {
      points: this.pointsProperty.value.map( point => point.toStateObject() )
    };
  }

  /**
   * Restores this reusable slot from persisted state.
   */
  public applyState( stateObject: GraphSnapshotStateObject ): void {
    this.pointsProperty.value = stateObject.points.map( point => Vector2.fromStateObject( point ) );
  }

  // Serialized structure for one full saved snapshot entry (points + metadata).
  private static readonly GRAPH_SNAPSHOT_STATE_SCHEMA = {
    points: ArrayIO( Vector2.Vector2IO )
  };

  // IOType for one saved snapshot. Snapshot slots are not PhET-iO components; GraphDataIO owns this aggregate state.
  public static readonly GraphSnapshotIO = new IOType<GraphSnapshot, GraphSnapshotStateObject>( 'GraphSnapshotIO', {
    valueType: GraphSnapshot,
    stateSchema: GraphSnapshot.GRAPH_SNAPSHOT_STATE_SCHEMA,
    toStateObject: snapshot => snapshot.toStateObject()
  } );
}
