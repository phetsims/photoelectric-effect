// Copyright 2026, University of Colorado Boulder

/**
 * Shared snapshot domain types and serialization for experiment graph history.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2, { type Vector2StateObject } from '../../../../dot/js/Vector2.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import { MaterialType } from '../../common/model/Material.js';

export type GraphSnapshotMetadataField = 'wavelength' | 'intensity' | 'voltage';
export type GraphSnapshotMetadataFieldPair = [ GraphSnapshotMetadataField, GraphSnapshotMetadataField ];

// PhET-iO serialized form for GraphSnapshotMetadata.
// materialType is stored as an enumeration key string.
type GraphSnapshotMetadataStateObject = {
  materialType: string;
  materialLabelKey: string | null;
  wavelength: number;
  intensity: number;
  voltage: number;
};

// PhET-iO serialized form for one GraphSnapshot entry.
export type GraphSnapshotStateObject = {
  points: Vector2StateObject[];
  metadata: GraphSnapshotMetadataStateObject;
};

/**
 * Immutable metadata captured with each GraphSnapshot. It is tightly coupled with
 * GraphSnapshot so it seems best to keep here instead of in its own file. This is a class
 * and not a type so that it can be used as the valueType for the metadata IOTYpe.
 */
export class GraphSnapshotMetadata {
  // Serializes snapshot metadata material type as an enumeration key in GraphData state.
  public static readonly SNAPSHOT_MATERIAL_TYPE_IO = EnumerationIO( MaterialType );

  // Serialized structure for metadata captured with one saved snapshot.
  // Uses primitive/state-safe types so metadata can be persisted and restored.
  private static readonly GRAPH_SNAPSHOT_METADATA_STATE_SCHEMA = {
    materialType: GraphSnapshotMetadata.SNAPSHOT_MATERIAL_TYPE_IO,
    materialLabelKey: NullableIO( StringIO ),
    wavelength: NumberIO,
    intensity: NumberIO,
    voltage: NumberIO
  };

  // IOType for one snapshot metadata record (material identity + operating conditions at capture time).
  public static readonly GRAPH_SNAPSHOT_METADATA_IO = new IOType<GraphSnapshotMetadata, GraphSnapshotMetadataStateObject>( 'GraphSnapshotMetadataIO', {
    valueType: GraphSnapshotMetadata,
    stateSchema: GraphSnapshotMetadata.GRAPH_SNAPSHOT_METADATA_STATE_SCHEMA,
    toStateObject: metadata => metadata.toStateObject(),
    fromStateObject: stateObject => GraphSnapshotMetadata.fromStateObject( stateObject )
  } );

  public constructor(
    // Canonical material identity for physics/state restoration and generic labeling.
    public readonly materialType: MaterialType,
    // Optional instance-level label override key (for example mystery1/mystery2) used to preserve the exact
    // displayed material label in snapshot rows when multiple materials share one MaterialType.
    public readonly materialLabelKey: string | null,
    public readonly wavelength: number,
    public readonly intensity: number,
    public readonly voltage: number
  ) {}

  /**
   * Converts runtime metadata to the PhET-iO state shape.
   */
  public toStateObject(): GraphSnapshotMetadataStateObject {
    return {
      materialType: GraphSnapshotMetadata.SNAPSHOT_MATERIAL_TYPE_IO.toStateObject( this.materialType ),
      materialLabelKey: this.materialLabelKey,
      wavelength: this.wavelength,
      intensity: this.intensity,
      voltage: this.voltage
    };
  }

  /**
   * Restores runtime metadata from the PhET-iO state shape.
   */
  public static fromStateObject( stateObject: GraphSnapshotMetadataStateObject ): GraphSnapshotMetadata {
    return new GraphSnapshotMetadata(
      GraphSnapshotMetadata.SNAPSHOT_MATERIAL_TYPE_IO.fromStateObject( stateObject.materialType ),
      stateObject.materialLabelKey,
      stateObject.wavelength,
      stateObject.intensity,
      stateObject.voltage
    );
  }
}

// Immutable snapshot payload: sampled points plus captured model metadata.
export default class GraphSnapshot {
  public constructor(
    public readonly points: Vector2[],
    public readonly metadata: GraphSnapshotMetadata
  ) {}

  // Serialized structure for one full saved snapshot entry (points + metadata).
  private static readonly GRAPH_SNAPSHOT_STATE_SCHEMA = {
    points: ArrayIO( Vector2.Vector2IO ),
    metadata: GraphSnapshotMetadata.GRAPH_SNAPSHOT_METADATA_IO
  };

  // IOType for one saved snapshot. Keeps point arrays and metadata bundled together so restore preserves
  // exactly what the user captured in the snapshots gallery.
  public static readonly GRAPH_SNAPSHOT_IO = new IOType<GraphSnapshot, GraphSnapshotStateObject>( 'GraphSnapshotIO', {
    valueType: GraphSnapshot,
    stateSchema: GraphSnapshot.GRAPH_SNAPSHOT_STATE_SCHEMA,
    toStateObject: snapshot => snapshot.toStateObject(),
    fromStateObject: stateObject => GraphSnapshot.fromStateObject( stateObject )
  } );

  /**
   * Converts this snapshot to the PhET-iO state shape.
   */
  public toStateObject(): GraphSnapshotStateObject {
    return {
      points: this.points.map( point => point.toStateObject() ),
      metadata: this.metadata.toStateObject()
    };
  }

  /**
   * Restores one runtime snapshot from persisted state.
   */
  public static fromStateObject( stateObject: GraphSnapshotStateObject ): GraphSnapshot {
    return new GraphSnapshot(
      stateObject.points.map( point => Vector2.fromStateObject( point ) ),
      GraphSnapshotMetadata.fromStateObject( stateObject.metadata )
    );
  }
}