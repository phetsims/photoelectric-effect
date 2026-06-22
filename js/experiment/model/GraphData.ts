// Copyright 2026, University of Colorado Boulder

/**
 * Owns deterministic binned chart samples for one experiment graph, and wires axon listeners to reveal state updates
 * when a driving NumberProperty changes. Clears when any dependency changes, and clears on model reset.
 *
 * Samples are stored in a fixed number of x-axis bins across xDomain (defaults to drivingProperty.range) so memory
 * stays bounded while sweeping the control. Bin y-values are deterministic for the current
 * model state, and a reveal mask tracks which bins have been swept by the driving control.
 *
 * Also stores a small number of reusable snapshot slots for later plotting.
 *
 * The view syncs line history from dataChangedEmitter; points are not wrapped in Property or ObservableArray.
 * The current operating point for the latest-point marker syncs from currentPointProperty when the driving property
 * changes (independent of line clears).
 *
 * clearDependencies should list every other model input that changes the physical meaning of the curve (or the
 * mapping in createDataPointAtChartX) so the plot does not mix samples from incompatible settings of the simulation.
 *
 * An optional samplingEnabledProperty gates new data: while false, sweeping the driving control reveals nothing and
 * currentPointProperty is null so the latest-point marker hides. Previously revealed samples remain visible.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
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
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectQueryParameters from '../../common/PhotoelectricEffectQueryParameters.js';
import GraphSnapshot from './GraphSnapshot.js';

type SelfOptions = {

  // Optional chart x domain override when chart x differs from the driving NumberProperty.
  xDomain?: Range;

  // Optional mapping from driving-property value domain to chart-x domain. This keeps reveal and marker updates in
  // the same coordinate system as deterministic bins. Identity by default for plots where the driving value is chart x
  // directly (voltage/current, intensity/current), and a transform when chart x differs (wavelength-driven
  // frequency/energy graph maps wavelength -> frequency).
  drivingValueToChartX?: ( drivingValue: number ) => number;

  // Number of fixed x-axis bins across xDomain, including both endpoints. Increase the binCount for
  // more accurate/smooth plots.
  binCount?: number;

  // Gates new data. While false, driving-property changes do not reveal new samples and currentPointProperty is
  // null so the latest-point marker hides. Previously revealed samples remain visible. Defaults to always enabled.
  samplingEnabledProperty?: TReadOnlyProperty<boolean>;
};

export type GraphDataPhetioOptions =
  PickRequired<PhetioObjectOptions, 'tandem'> &
  PickOptional<PhetioObjectOptions, 'phetioDocumentation'>;

export type GraphDataOptions = SelfOptions & GraphDataPhetioOptions;

// Bundles the label, value source, and display formatter for one metadata field captured with each snapshot.
export type GraphMetadataConfig = {
  labelProperty: TReadOnlyProperty<string>;
  valueProperty: TReadOnlyProperty<number>;
  formatValue: ( value: number ) => string;
};

// PhET-iO serialized state for experiment graph data.
type GraphDataStateObject = {

  // Revealed bin indices are enough to restore the live line because bin y-values are recomputed from current model
  // state.
  revealedBinIndices: number[];

  // Preserves sweep continuity after state restore.
  previousDrivingBinIndex: number | null;
};

type BinData = {

  // Deterministic data point for this chart-x bin center.
  dataPoint: Vector2;

  // Whether this bin has been revealed by sweeping the driving control.
  revealed: boolean;
};


export default class GraphData extends PhetioObject {

  // Upper bound on snapshots; captureSnapshot asserts the stored count stays below this before adding another.
  public static readonly MAX_SNAPSHOTS = 3;

  // Bin width in chart x model units.
  private readonly binWidth: number;

  // Inclusive span used for bin indices; when omitted at construction, matches drivingProperty.range.
  private readonly xDomain: Range;

  // Number of fixed x-axis bins, including both endpoints.
  private readonly binCount: number;

  // Deterministic data and reveal state for each chart-x bin center.
  private readonly bins: BinData[];

  // Most recent driving bin index, used to reveal all bins between previous and current positions.
  private previousDrivingBinIndex: number | null = null;

  // Reusable snapshot slots. The leading snapshotsCountProperty.value slots are active.
  public readonly snapshots: GraphSnapshot[];

  // Shared model state source for snapshot metadata captured at save time.
  private readonly model: PhotoelectricEffectModel;

  // Fires after reveal state changes or after clear() removes revealed samples, so views can read
  // getDataPoints() and update plots.
  public readonly dataChangedEmitter = new Emitter();

  // Latest chart coordinates for the current driving value, or null while sampling is disabled.
  public readonly currentPointProperty: Property<Vector2 | null>;

  // Gates new data; see SelfOptions.samplingEnabledProperty.
  private readonly samplingEnabledProperty: TReadOnlyProperty<boolean>;

  // Number of stored snapshots.
  public readonly snapshotsCountProperty: NumberProperty;

  /**
   * @param drivingProperty - New values reveal bins along the sweep path.
   * @param createDataPointAtChartX - Deterministically evaluates the curve at a chart-x value. GraphData uses this
   *   for every canonical bin center during recomputation, and also for currentPointProperty after applying
   *   the driving-value -> chart-x mapping. Keeping this callback in chart-x coordinates ensures one consistent
   *   curve definition for both deterministic bins and the latest-point marker.
   * @param model - Source of shared snapshot metadata values captured with each saved snapshot.
   * @param secondValueMetadata - Label, value source, and formatter for the second metadata field in each snapshot legend.
   * @param thirdValueMetadata - Label, value source, and formatter for the third metadata field in each snapshot legend.
   * @param clearDependencies - Properties to watch so that changing any of them clears the series. Provide every
   *   model input that affects the interpretation of the axes except the drivingProperty itself, otherwise old points
   *   would stay on screen and imply a single curve even though the underlying relationship or experimental
   *   conditions have changed.
   * @param resetEmitter - Model reset clears live samples and all snapshots.
   * @param providedOptions
   */
  public constructor(
    drivingProperty: NumberProperty,
    createDataPointAtChartX: ( chartX: number ) => Vector2,
    model: PhotoelectricEffectModel,
    private readonly secondValueMetadata: GraphMetadataConfig,
    private readonly thirdValueMetadata: GraphMetadataConfig,
    clearDependencies: Readonly<TReadOnlyProperty<IntentionalAny>[]>,
    resetEmitter: TReadOnlyEmitter,
    providedOptions: GraphDataOptions
  ) {

    const options = optionize<GraphDataOptions, SelfOptions, PhetioObjectOptions>()( {
      phetioType: GraphData.GraphDataIO,
      phetioState: true,
      xDomain: drivingProperty.range,
      binCount: 200,
      drivingValueToChartX: drivingValue => drivingValue,
      samplingEnabledProperty: new BooleanProperty( true )
    }, providedOptions );

    super( options );
    this.model = model;
    this.samplingEnabledProperty = options.samplingEnabledProperty;
    this.secondValueMetadata = secondValueMetadata;
    this.thirdValueMetadata = thirdValueMetadata;
    this.snapshotsCountProperty = new NumberProperty( 0, {
      range: new Range( 0, GraphData.MAX_SNAPSHOTS ),
      numberType: 'Integer',
      tandem: options.tandem.createTandem( 'snapshotsCountProperty' ),
      phetioReadOnly: true,
      phetioFeatured: true
    } );
    const snapshotsTandem = options.tandem.createGroupTandem( 'snapshot' );
    this.snapshots = _.times( GraphData.MAX_SNAPSHOTS, () => new GraphSnapshot(
      secondValueMetadata.labelProperty, secondValueMetadata.formatValue,
      thirdValueMetadata.labelProperty, thirdValueMetadata.formatValue,
      { tandem: snapshotsTandem.createNextTandem() }
    ) );

    affirm( Number.isInteger( options.binCount ) && options.binCount > 1,
      'binCount must be an integer greater than 1' );

    this.xDomain = options.xDomain;

    const span = this.xDomain.getLength();
    affirm( span > 0, 'xDomain must have positive length' );
    this.binCount = options.binCount;
    this.binWidth = span / ( this.binCount - 1 );

    // recomputeDeterministicBinsAndCurrentPoint below assigns the initial value, respecting samplingEnabledProperty.
    this.currentPointProperty = new Property<Vector2 | null>( null );

    this.bins = _.times( this.binCount, index => ( {
      dataPoint: new Vector2( this.binIndexToChartX( index ), 0 ),
      revealed: false
    } ) );
    this.recomputeDeterministicBinsAndCurrentPoint(
      createDataPointAtChartX,
      options.drivingValueToChartX( drivingProperty.value )
    );

    drivingProperty.lazyLink( ( drivingValue: number ) => {

      // While sampling is disabled, sweeping reveals nothing and the marker stays hidden.
      if ( !this.samplingEnabledProperty.value ) {
        return;
      }

      const chartX = options.drivingValueToChartX( drivingValue );
      this.currentPointProperty.value = createDataPointAtChartX( chartX );

      const currentBinIndex = this.chartXToBinIndex( chartX );
      this.revealBinRange( this.previousDrivingBinIndex, currentBinIndex );
      this.previousDrivingBinIndex = currentBinIndex;
      this.dataChangedEmitter.emit();
    } );

    options.samplingEnabledProperty.lazyLink( samplingEnabled => {

      // Show the operating-point marker only while sampling is enabled. Revealed samples are untouched.
      this.currentPointProperty.value = samplingEnabled ?
                                        createDataPointAtChartX( options.drivingValueToChartX( drivingProperty.value ) ) :
                                        null;

      // Notifies views so the zoom level re-fits with or without the marker.
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
   * Points in model/chart coordinates in ascending chart x. By default, this returns revealed bins only.
   * With ?showAllGraphData, this returns every deterministic bin. Do not mutate; use clear() to empty.
   */
  public getDataPoints(): ReadonlyArray<Vector2> {
    const dataPoints: Vector2[] = [];
    this.bins.forEach( bin => {
      if ( PhotoelectricEffectQueryParameters.showAllGraphData || bin.revealed ) {
        dataPoints.push( bin.dataPoint );
      }
    } );
    return dataPoints;
  }

  /**
   * Active snapshot series in capture order.
   */
  public getSnapshots(): ReadonlyArray<GraphSnapshot> {
    return this.snapshots.slice( 0, this.snapshotsCountProperty.value );
  }

  /**
   * Removes all revealed samples and notifies listeners.
   */
  public clear(): void {
    this.previousDrivingBinIndex = null;
    this.bins.forEach( bin => {
      bin.revealed = false;
    } );
    this.dataChangedEmitter.emit();
  }

  /**
   * Stores a deep copy of the current live series in the next snapshot slot. Asserts that fewer than
   * GraphData.MAX_SNAPSHOTS are already stored (clear snapshots before capturing more).
   */
  public captureSnapshot(): void {
    const snapshotIndex = this.snapshotsCountProperty.value;
    affirm( snapshotIndex < GraphData.MAX_SNAPSHOTS, 'snapshot storage is full' );
    this.snapshots[ snapshotIndex ].save( this.getDataPoints(), this.model.target.materialProperty,
      this.secondValueMetadata.valueProperty, this.thirdValueMetadata.valueProperty );
    this.snapshotsCountProperty.value = snapshotIndex + 1;
  }

  /**
   * Removes all snapshots and updates snapshotsCountProperty. Does not change the live series.
   */
  public clearSnapshots(): void {
    this.snapshots.forEach( snapshot => {
      snapshot.clear();
    } );
    this.snapshotsCountProperty.value = 0;
  }

  /**
   * Maps chart x to a bin index in [0, binCount - 1].
   */
  private chartXToBinIndex( chartX: number ): number {
    const rawIndex = roundSymmetric( ( chartX - this.xDomain.min ) / this.binWidth );
    return clamp( rawIndex, 0, this.binCount - 1 );
  }

  /**
   * Canonical chart x for a bin index.
   */
  private binIndexToChartX( binIndex: number ): number {
    return this.xDomain.min + binIndex * this.binWidth;
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
    this.bins.forEach( bin => {
      bin.revealed = false;
    } );
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
    this.bins.forEach( ( bin, i ) => {
      const canonicalX = this.binIndexToChartX( i );
      const point = createDataPointAtChartX( canonicalX );
      bin.dataPoint = new Vector2( canonicalX, point.y );
    } );

    // When a dependency changes that should clear the plot, it changed the physical state for the system,
    // so recompute the current point. While sampling is disabled there is no operating point to show.
    this.currentPointProperty.value = this.samplingEnabledProperty.value ?
                                      createDataPointAtChartX( drivingValueInChartX ) :
                                      null;
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
   * Serializes graph reveal continuity for PhET-iO (bin y-values follow from current model state).
   */
  private toStateObject(): GraphDataStateObject {
    return {
      revealedBinIndices: this.getRevealedBinIndices(),
      previousDrivingBinIndex: this.previousDrivingBinIndex
    };
  }

  /**
   * Restores reveal mask and sweep continuity from PhET-iO state.
   */
  private applyState( stateObject: GraphDataStateObject ): void {
    this.previousDrivingBinIndex = stateObject.previousDrivingBinIndex;
    this.setRevealedBinIndices( stateObject.revealedBinIndices );
    this.dataChangedEmitter.emit();
  }

  /**
   * PhET-iO state schema.
   *
   * Top-level serialized GraphData structure used by GraphDataIO. Live curve y-values are not serialized because they
   * are deterministic for the current model state; only reveal continuity and saved snapshots are persisted.
   */
  private static readonly GRAPH_DATA_STATE_SCHEMA = {
    revealedBinIndices: ArrayIO( NumberIO ),
    previousDrivingBinIndex: NullableIO( NumberIO )
  };

  /**
   * GraphData uses aggregate state because the live graph is more than a simple array of points.
   * The plotted line is derived from deterministic bins whose y-values are recomputed from the current model state,
   * while the persisted state only needs to preserve which bins have been revealed by user interaction.
   *
   * This IOType serializes the state rather than exposing the internal bin data structures.
   */
  public static readonly GraphDataIO = new IOType<GraphData, GraphDataStateObject>( 'GraphDataIO', {
    valueType: GraphData,
    stateSchema: GraphData.GRAPH_DATA_STATE_SCHEMA,
    toStateObject: graphData => graphData.toStateObject(),
    applyState: ( graphData, stateObject ) => graphData.applyState( stateObject )
  } );
}
