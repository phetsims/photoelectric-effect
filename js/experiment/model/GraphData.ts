// Copyright 2026, University of Colorado Boulder

/**
 * Owns a simple array of chart samples for one experiment graph, and wires axon listeners so points
 * append when a driving NumberProperty changes, clear when any dependency changes, and clear on model reset.
 *
 * Also stores a small number of immutable snapshot copies of the live series for later plotting.
 *
 * The view syncs line history from dataChangedEmitter; points are not wrapped in Property or ObservableArray.
 * The current operating point for the latest-point marker syncs from currentPointProperty when the driving property
 * changes (independent of line clears).
 *
 * clearDependencies should list every other model input that changes the physical meaning of the curve (or the
 * mapping in createDataPoint) so the plot does not mix samples from incompatible settings of the simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import type { TReadOnlyEmitter } from '../../../../axon/js/TEmitter.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import { equalsEpsilon } from '../../../../dot/js/util/equalsEpsilon.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';

// Maximum number of chart samples retained per series; oldest points are dropped when appending past this size.
const MAX_DATA_POINTS = 100;

// Two chart x values closer than this are treated as the same abscissa so the newer sample replaces the older.
const X_DUPLICATE_EPSILON = 1e-10;

export default class GraphData {

  // Upper bound on snapshots; captureSnapshot asserts the stored count stays below this before adding another.
  public static readonly MAX_SNAPSHOTS = 4;

  // Accumulated chart samples in model coordinates (at most one point per x, newest wins). Only this class appends or
  // clears entries when the driving NumberProperty changes, clear dependencies change, or reset runs.
  private readonly dataPoints: Vector2[] = [];

  // Deep-copied point arrays captured via captureSnapshot(); each inner array is not mutated after it is stored.
  private readonly snapshots: Vector2[][] = [];

  // Fires after a new sample is appended or after clear() removes samples, so views can read
  // getDataPoints() and update plots.
  public readonly dataChangedEmitter = new Emitter();

  // Latest chart coordinates for the current driving value.
  public readonly currentPointProperty: Property<Vector2>;

  // Number of stored snapshots.
  public readonly snapshotsCountProperty = new NumberProperty( 0, {
    range: new Range( 0, GraphData.MAX_SNAPSHOTS )
  } );

  /**
   * @param drivingProperty - New values trigger one appended sample.
   * @param createDataPoint - Maps the new driving value to model coordinates for the chart.
   * @param clearDependencies - Properties to watch so that changing any of them clears the series. Provide every
   *   model input that affects the interpretation of the axes except the drivingProperty itself, otherwise old points\
   *   would stay on screen and imply a single curve even though the underlying relationship or experimental
   *   conditions have changed.
   * @param resetEmitter - Model reset clears live samples and all snapshots.
   */
  public constructor(
    drivingProperty: NumberProperty,
    createDataPoint: ( drivingValue: number ) => Vector2,
    clearDependencies: Readonly<TReadOnlyProperty<IntentionalAny>[]>,
    resetEmitter: TReadOnlyEmitter
  ) {
    this.currentPointProperty = new Property( createDataPoint( drivingProperty.value ) );

    drivingProperty.lazyLink( ( drivingValue: number ) => {
      const newPoint = createDataPoint( drivingValue );

      // Remove same-x samples: iterate backward so splice index shifts do not skip the next element.
      for ( let i = this.dataPoints.length - 1; i >= 0; i-- ) {
        if ( equalsEpsilon( this.dataPoints[ i ].x, newPoint.x, X_DUPLICATE_EPSILON ) ) {
          this.dataPoints.splice( i, 1 );
        }
      }
      this.dataPoints.push( newPoint );
      while ( this.dataPoints.length > MAX_DATA_POINTS ) {
        this.dataPoints.shift();
      }
      this.dataChangedEmitter.emit();
      this.currentPointProperty.value = newPoint;
    } );

    Multilink.lazyMultilinkAny( clearDependencies, () => {
      this.clear();
    } );

    resetEmitter.addListener( () => {
      this.clearSnapshots();
      this.clear();
    } );
  }

  /**
   * Points in model/chart coordinates, most recently appended last. Do not mutate; use clear() to empty.
   */
  public getDataPoints(): ReadonlyArray<Vector2> {
    return this.dataPoints;
  }

  /**
   * Immutable snapshot series in capture order. Do not mutate the returned arrays or points; the model treats each
   * snapshot as read-only after it is stored.
   */
  public getSnapshots(): ReadonlyArray<ReadonlyArray<Vector2>> {
    return this.snapshots;
  }

  /**
   * Removes all samples and notifies listeners.
   */
  public clear(): void {
    if ( this.dataPoints.length > 0 ) {
      this.dataPoints.length = 0;
      this.dataChangedEmitter.emit();
    }
  }

  /**
   * Stores a deep copy of the current live series as a new snapshot. Asserts that fewer than GraphData.MAX_SNAPSHOTS
   * are already stored (clear snapshots before capturing more).
   */
  public captureSnapshot(): void {
    assert && assert( this.snapshots.length < GraphData.MAX_SNAPSHOTS, 'snapshot storage is full' );
    const snapshot = this.dataPoints.map( point => new Vector2( point.x, point.y ) );
    this.snapshots.push( snapshot );
    this.syncSnapshotsCountProperty();
  }

  /**
   * Removes all snapshots and updates snapshotsCountProperty. Does not change the live series.
   */
  public clearSnapshots(): void {
    if ( this.snapshots.length > 0 ) {
      this.snapshots.length = 0;
      this.syncSnapshotsCountProperty();
    }
  }

  /**
   * Sets snapshotsCountProperty from the current snapshot list length.
   */
  private syncSnapshotsCountProperty(): void {
    this.snapshotsCountProperty.value = this.snapshots.length;
  }
}
