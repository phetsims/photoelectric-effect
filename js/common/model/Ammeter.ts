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

const CLIENT_UPDATE_INTERVAL = 0.5;
const SIMULATION_TIME_WINDOW = 1;

export default class Ammeter extends ScalarDataRecorder {

  public constructor() {
    super( CLIENT_UPDATE_INTERVAL, SIMULATION_TIME_WINDOW );
  }

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

  public recordElectron(): void {
    this.recordElectrons( 1 );
  }

  public recordElectrons( numElectrons: number ): void {
    this.addDataRecordEntry( numElectrons );
  }

  public getSimulationTimeWindow(): number {
    return SIMULATION_TIME_WINDOW;
  }
}