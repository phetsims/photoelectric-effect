// Copyright 2026, University of Colorado Boulder

/**
 * Meter that computes beam intensity from emitted photon counts.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

import ScalarDataRecorder from './ScalarDataRecorder.js';

// Interval between statistics refreshes, in seconds.
const CLIENT_UPDATE_INTERVAL = 0.5;

// Sliding window size for intensity accumulation, in seconds.
const SIMULATION_TIME_WINDOW = 1;

export default class BeamIntensityMeter extends ScalarDataRecorder {

  /**
   * Creates a meter that aggregates photon counts over a fixed time window.
   * Uses a short client update interval so the intensity display stays responsive.
   */
  public constructor() {
    super( CLIENT_UPDATE_INTERVAL, SIMULATION_TIME_WINDOW );
  }

  /**
   * Records a single photon emission in the current time slice.
   * Convenience wrapper used by sources that emit one photon at a time.
   */
  public recordPhoton(): void {
    this.recordPhotons( 1 );
  }

  /**
   * Records a batch of photons emitted at the current simulation time.
   * Caller supplies the count to avoid pushing multiple entries.
   */
  public recordPhotons( numPhotons: number ): void {
    this.addDataRecordEntry( numPhotons );
  }

  /**
   * Computes the current beam intensity in photons per second.
   * Uses the underlying sliding-window statistics and guards against NaN/Infinity
   * when the time span is zero or no data are present.
   */
  public getIntensity(): number {
    this.computeDataStatistics();
    const timeSpan = this.getTimeSpanOfEntries();
    let intensity = 0;

    if ( timeSpan > 0 ) {
      intensity = this.getDataTotal() / timeSpan;
    }

    if ( !Number.isFinite( intensity ) ) {
      intensity = 0;
    }

    return intensity;
  }
}
