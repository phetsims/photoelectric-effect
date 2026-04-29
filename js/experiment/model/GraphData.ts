// Copyright 2026, University of Colorado Boulder

/**
 * Owns deterministic binned chart samples for one experiment graph, and wires axon listeners to reveal state updates
 * when a driving NumberProperty changes. Clears when any dependency changes, and clear on model reset.
 *
 * Samples are stored in fixed x-axis bins derived from xDomain (defaults to drivingProperty.range) and
 * xResolution so memory stays bounded while sweeping the control. Bin y-values are deterministic for the current
 * model state, and a reveal mask tracks which bins have been swept by the driving control.
 *
 * Also stores a small number of immutable snapshot copies of the live series for later plotting.
 *
 * The view syncs line history from dataChangedEmitter; points are not wrapped in Property or ObservableArray.
 * The current operating point for the latest-point marker syncs from currentPointProperty when the driving property
 * changes (independent of line clears).
 *
 * clearDependencies should list every other model input that changes the physical meaning of the curve (or the
 * mapping in createDataPointAtChartX) so the plot does not mix samples from incompatible settings of the simulation.
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
import { clamp } from '../../../../dot/js/util/clamp.js';
import { roundSymmetric } from '../../../../dot/js/util/roundSymmetric.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize from '../../../../phet-core/js/optionize.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import ArrayIO from '../../../../tandem/js/types/ArrayIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';
import NullableIO from '../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';

type SelfOptions = {

  // Optional chart x domain override when chart x differs from the driving NumberProperty.
  xDomain?: Range;

  // Optional mapping from driving-property value domain to chart-x domain. This keeps reveal and marker updates in
  // the same coordinate system as deterministic bins. Identity by default for plots where the driving value is chart x
  // directly (voltage/current, intensity/current), and a transform when chart x differs (wavelength-driven
  // frequency/energy graph maps wavelength -> frequency).
  drivingValueToChartX?: ( drivingValue: number ) => number;

  // Model-units spacing between adjacent x bins. Reduce this value to increase the number of bins.
  xResolution?: number;
};

export type GraphDataPhetioOptions =
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

export type GraphDataOptions = SelfOptions & GraphDataPhetioOptions;

type GraphDataStateObject = {

  // Revealed bin indices are enough to restore the live line because bin y-values are recomputed from current model
  // state.
  revealedBinIndices: number[];

  // Preserves sweep continuity after state restore.
  previousDrivingBinIndex: number | null;

  // Snapshot copies are user-saved historical series, so preserve their exact points.
  snapshots: Vector2[][];
};

type BinData = {

  // Deterministic data point for this chart-x bin center.
  dataPoint: Vector2;

  // Whether this bin has been revealed by sweeping the driving control.
  revealed: boolean;
};

export default class GraphData extends PhetioObject {

  // Upper bound on snapshots; captureSnapshot asserts the stored count stays below this before adding another.
  public static readonly MAX_SNAPSHOTS = 4;

  // Bin width in chart x model units.
  private readonly xResolution: number;

  // Inclusive span used for bin indices; when omitted at construction, matches drivingProperty.range.
  private readonly xDomain: Range;

  // Number of bins = floor( span / xResolution ) + 1.
  private readonly binCount: number;

  // Deterministic data and reveal state for each chart-x bin center.
  private readonly bins: BinData[];

  // Most recent driving bin index, used to reveal all bins between previous and current positions.
  private previousDrivingBinIndex: number | null = null;

  // Deep-copied point arrays captured via captureSnapshot(); each inner array is not mutated after it is stored.
  private readonly snapshots: Vector2[][] = [];

  // Fires after reveal state changes or after clear() removes revealed samples, so views can read
  // getDataPoints() and update plots.
  public readonly dataChangedEmitter = new Emitter();

  // Latest chart coordinates for the current driving value.
  public readonly currentPointProperty: Property<Vector2>;

  // Number of stored snapshots.
  public readonly snapshotsCountProperty = new NumberProperty( 0, {
    range: new Range( 0, GraphData.MAX_SNAPSHOTS )
  } );

  /**
   * @param drivingProperty - New values reveal bins along the sweep path.
   * @param createDataPointAtChartX - Deterministically evaluates the curve at a chart-x value. GraphData uses this
   *   for every canonical bin center during recomputation, and also for currentPointProperty after applying
   *   the driving-value -> chart-x mapping. Keeping this callback in chart-x coordinates ensures one consistent
   *   curve definition for both deterministic bins and the latest-point marker.
   * @param clearDependencies - Properties to watch so that changing any of them clears the series. Provide every
   *   model input that affects the interpretation of the axes except the drivingProperty itself, otherwise old points\
   *   would stay on screen and imply a single curve even though the underlying relationship or experimental
   *   conditions have changed.
   * @param resetEmitter - Model reset clears live samples and all snapshots.
   * @param providedOptions
   */
  public constructor(
    drivingProperty: NumberProperty,
    createDataPointAtChartX: ( chartX: number ) => Vector2,
    clearDependencies: Readonly<TReadOnlyProperty<IntentionalAny>[]>,
    resetEmitter: TReadOnlyEmitter,
    providedOptions: GraphDataOptions
  ) {

    const options = optionize<GraphDataOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: GraphData.GraphDataIO,
      phetioState: true,
      xDomain: drivingProperty.range,
      xResolution: 0.01,
      drivingValueToChartX: drivingValue => drivingValue
    }, providedOptions );

    super( options );

    affirm( options.xResolution > 0, 'xResolution must be positive' );

    this.xResolution = options.xResolution;
    this.xDomain = options.xDomain;

    const span = this.xDomain.getLength();
    affirm( span >= 0, 'xDomain must be a valid range' );
    this.binCount = Math.max( 1, Math.floor( span / this.xResolution ) + 1 );

    const initialChartX = options.drivingValueToChartX( drivingProperty.value );
    this.currentPointProperty = new Property( createDataPointAtChartX( initialChartX ) );

    this.bins = _.times( this.binCount, index => ( {
      dataPoint: new Vector2( this.binIndexToChartX( index ), 0 ),
      revealed: false
    } ) );
    this.recomputeDeterministicBinsAndCurrentPoint(
      createDataPointAtChartX,
      options.drivingValueToChartX( drivingProperty.value )
    );

    drivingProperty.lazyLink( ( drivingValue: number ) => {
      const chartX = options.drivingValueToChartX( drivingValue );
      this.currentPointProperty.value = createDataPointAtChartX( chartX );

      const currentBinIndex = this.chartXToBinIndex( chartX );
      this.revealBinRange( this.previousDrivingBinIndex, currentBinIndex );
      this.previousDrivingBinIndex = currentBinIndex;
      this.dataChangedEmitter.emit();
    } );

    Multilink.lazyMultilinkAny( clearDependencies, () => {

      // Deterministic bins cache y-values for one physical configuration.
      // Any clear dependency change means the curve definition changed.
      this.recomputeDeterministicBinsAndCurrentPoint(
        createDataPointAtChartX,
        options.drivingValueToChartX( drivingProperty.value )
      );

      this.clear();
    } );

    resetEmitter.addListener( () => {
      this.clearSnapshots();
      this.clear();
    } );
  }

  /**
   * Points in model/chart coordinates in ascending chart x (revealed bins only). Do not mutate; use clear() to empty.
   */
  public getDataPoints(): ReadonlyArray<Vector2> {
    const dataPoints: Vector2[] = [];
    this.bins.forEach( bin => {
      if ( bin.revealed ) {
        dataPoints.push( bin.dataPoint );
      }
    } );
    return dataPoints;
  }

  /**
   * Immutable snapshot series in capture order. Do not mutate the returned arrays or points; the model treats each
   * snapshot as read-only after it is stored.
   */
  public getSnapshots(): ReadonlyArray<ReadonlyArray<Vector2>> {
    return this.snapshots;
  }

  /**
   * Removes all revealed samples and notifies listeners.
   */
  public clear(): void {
    this.previousDrivingBinIndex = null;
    for ( let i = 0; i < this.bins.length; i++ ) {
      this.bins[ i ].revealed = false;
    }
    this.dataChangedEmitter.emit();
  }

  /**
   * Stores a deep copy of the current live series as a new snapshot. Asserts that fewer than GraphData.MAX_SNAPSHOTS
   * are already stored (clear snapshots before capturing more).
   */
  public captureSnapshot(): void {
    affirm( this.snapshots.length < GraphData.MAX_SNAPSHOTS, 'snapshot storage is full' );
    const snapshot = this.getDataPoints().map( point => new Vector2( point.x, point.y ) );
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
   * Restores user-saved snapshot series from PhET-iO state.
   */
  private setSnapshots( snapshots: Vector2[][] ): void {
    this.snapshots.length = 0;
    snapshots.forEach( snapshot => {
      this.snapshots.push( snapshot.map( point => new Vector2( point.x, point.y ) ) );
    } );
    this.syncSnapshotsCountProperty();
  }

  /**
   * Sets snapshotsCountProperty from the current snapshot list length.
   */
  private syncSnapshotsCountProperty(): void {
    this.snapshotsCountProperty.value = this.snapshots.length;
  }

  /**
   * Maps chart x to a bin index in [0, binCount - 1].
   */
  private chartXToBinIndex( chartX: number ): number {
    const rawIndex = roundSymmetric( ( chartX - this.xDomain.min ) / this.xResolution );
    return clamp( rawIndex, 0, this.binCount - 1 );
  }

  /**
   * Canonical chart x for a bin index.
   */
  private binIndexToChartX( binIndex: number ): number {
    return this.xDomain.min + binIndex * this.xResolution;
  }

  /**
   * Gets the live line's revealed bin indices for compact PhET-iO state.
   */
  private getRevealedBinIndices(): number[] {
    const revealedBinIndices: number[] = [];
    this.bins.forEach( ( bin, index ) => {
      if ( bin.revealed ) {
        revealedBinIndices.push( index );
      }
    } );
    return revealedBinIndices;
  }

  /**
   * Restores the live line's reveal mask from compact PhET-iO state.
   */
  private setRevealedBinIndices( revealedBinIndices: number[] ): void {
    for ( let i = 0; i < this.bins.length; i++ ) {
      this.bins[ i ].revealed = false;
    }
    revealedBinIndices.forEach( binIndex => {
      affirm( binIndex >= 0 && binIndex < this.bins.length, 'revealed bin index out of range' );
      this.bins[ binIndex ].revealed = true;
    } );
  }

  /**
   * Recomputes deterministic bin y-values for the current model state.
   */
  private recomputeDeterministicBinsAndCurrentPoint(
    createDataPointAtChartX: ( chartX: number ) => Vector2,
    drivingValueInChartX: number
  ): void {
    _.times( this.binCount, i => {
      const canonicalX = this.binIndexToChartX( i );
      const point = createDataPointAtChartX( canonicalX );
      this.bins[ i ].dataPoint = new Vector2( canonicalX, point.y );
    } );

    // When a dependency changes that should clear the plot, it changed the physical state for the system,
    // so recompute the current point.
    this.currentPointProperty.value = createDataPointAtChartX( drivingValueInChartX );
  }

  /**
   * Reveals one bin or a contiguous range between previous and current bin indices.
   */
  private revealBinRange( previousBinIndex: number | null, currentBinIndex: number ): void {
    if ( previousBinIndex === null ) {
      this.revealSingleBin( currentBinIndex );
    }
    else {
      const startIndex = Math.min( previousBinIndex, currentBinIndex );
      const endIndex = Math.max( previousBinIndex, currentBinIndex );
      for ( let i = startIndex; i <= endIndex; i++ ) {
        this.revealSingleBin( i );
      }
    }
  }

  /**
   * Reveals one bin.
   */
  private revealSingleBin( binIndex: number ): void {
    this.bins[ binIndex ].revealed = true;
  }

  /**
   * GraphData uses aggregate state because the live graph is more than a simple array of points.
   * The plotted line is derived from deterministic bins whose y-values are recomputed from the current model state,
   * while the persisted state only needs to preserve which bins have been revealed by user interaction.
   *
   * This IOType serializes the state rather than exposing the internal bin data structures.
   */
  public static readonly GraphDataIO = new IOType<GraphData, GraphDataStateObject>( 'GraphDataIO', {
    valueType: GraphData,
    stateSchema: {
      revealedBinIndices: ArrayIO( NumberIO ),
      previousDrivingBinIndex: NullableIO( NumberIO ),
      snapshots: ArrayIO( ArrayIO( Vector2.Vector2IO ) )
    },
    toStateObject: graphData => ( {
      revealedBinIndices: graphData.getRevealedBinIndices(),
      previousDrivingBinIndex: graphData.previousDrivingBinIndex,
      snapshots: graphData.snapshots.map( snapshot => snapshot.map( point => new Vector2( point.x, point.y ) ) )
    } ),
    applyState: ( graphData, stateObject ) => {
      graphData.previousDrivingBinIndex = stateObject.previousDrivingBinIndex;
      graphData.setRevealedBinIndices( stateObject.revealedBinIndices );
      graphData.setSnapshots( stateObject.snapshots );
      graphData.dataChangedEmitter.emit();
    }
  } );
}
