// Copyright 2026, University of Colorado Boulder

/**
 * Model for the ammeter accessory used to measure current in the circuit.
 * Records electrons over a sliding time window to compute current.
 *
 * TODO: Unclear if we need this at all. Do we need to calculate electrons hitting the sink?
 *   The java did not do that at all (commented out). Come back to this when we know how the curreent
 *   is supposed to work.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ScalarDataRecorder from './ScalarDataRecorder.js';

// Interval between client-facing updates, in seconds.
const CLIENT_UPDATE_INTERVAL = 0.5;

// Duration of the sliding window used for current, in seconds.
const SIMULATION_TIME_WINDOW = 1;

export default class Ammeter extends ScalarDataRecorder {

  /**
   * Creates an ammeter that records electrons over a fixed time window.
   */
  public constructor() {
    super( CLIENT_UPDATE_INTERVAL, SIMULATION_TIME_WINDOW );
  }

  /**
   * Returns the current based on the recorded electron counts.
   */
  public getCurrent(): number {
    this.computeDataStatistics();
    const timeSpan = this.getTimeSpanOfEntries();
    let current = 0;

    if ( timeSpan > 0 ) {
      current = this.getDataTotal() / timeSpan;
    }

    if ( !Number.isFinite( current ) ) {
      current = 0;
    }

    return current;
  }

  /**
   * Records a single electron for the current window.
   */
  public recordElectron(): void {
    this.recordElectrons( 1 );
  }

  /**
   * Records one or more electrons for the current window.
   */
  public recordElectrons( numElectrons: number ): void {
    this.addDataRecordEntry( numElectrons );
  }

  /**
   * Returns the time window used for current measurements.
   */
  public getSimulationTimeWindow(): number {
    return SIMULATION_TIME_WINDOW;
  }
}