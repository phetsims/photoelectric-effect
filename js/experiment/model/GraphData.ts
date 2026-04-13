// Copyright 2026, University of Colorado Boulder

/**
 * Owns a simple array of chart samples for one experiment graph, and wires axon listeners so points
 * append when a driving NumberProperty changes, clear when any dependency changes, and clear on model reset.
 *
 * The view syncs from dataChangedEmitter; points are not wrapped in Property or ObservableArray.
 *
 * clearDependencies should list every other model input that changes the physical meaning of the curve (or the
 * mapping in createDataPoint) so the plot does not mix samples from incompatible settings of the apparatus.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import Multilink from '../../../../axon/js/Multilink.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyEmitter } from '../../../../axon/js/TEmitter.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';

export default class GraphData {

  // Accumulated chart samples in model coordinates. Only this class appends or clears entries when the
  // driving NumberProperty changes, clear dependencies change, or reset runs.
  private readonly dataPoints: Vector2[] = [];

  // Fires after a new sample is appended or after clear() removes samples, so views can read
  // getDataPoints() and update the plot.
  public readonly dataChangedEmitter = new Emitter();

  /**
   * @param drivingProperty - New values trigger one appended sample.
   * @param createDataPoint - Maps the new driving value to model coordinates for the chart.
   * @param clearDependencies - Properties to watch so that changing any of them clears the series. Provide every
   *   model input that affects the interpretation of the axes except the drivingProperty itself, otherwise old points\
   *   would stay on screen and imply a single curve even though the underlying relationship or experimental
   *   conditions have changed.
   * @param resetEmitter - Model reset clears all samples.
   */
  public constructor(
    drivingProperty: NumberProperty,
    createDataPoint: ( drivingValue: number ) => Vector2,
    clearDependencies: Readonly<TReadOnlyProperty<IntentionalAny>[]>,
    resetEmitter: TReadOnlyEmitter
  ) {

    drivingProperty.lazyLink( ( drivingValue: number ) => {
      this.dataPoints.push( createDataPoint( drivingValue ) );
      this.dataChangedEmitter.emit();
    } );

    const clearObserver = this.clear.bind( this );
    Multilink.lazyMultilinkAny( clearDependencies, clearObserver );
    resetEmitter.addListener( clearObserver );
  }

  /**
   * Points in model/chart coordinates, most recently appended last. Do not mutate; use clear() to empty.
   */
  public getDataPoints(): readonly Vector2[] {
    return this.dataPoints;
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
}
