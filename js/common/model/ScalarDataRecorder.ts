// Copyright 2026, University of Colorado Boulder

/**
 * Records scalar data with timestamps, computing statistics over a sliding time window.
 * Updated during model stepping rather than with a timer.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

// Timestamped scalar value recorded in simulation time.
type DataRecordEntry = {
  time: number;
  value: number;
};

export default class ScalarDataRecorder {

  // Collection of recorded entries within the active time window.
  private readonly dataRecord: DataRecordEntry[] = [];

  // Sum of entry values within the current window.
  private dataTotal = 0;

  // Average of entry values within the current window.
  private dataAverage = 0;

  // Duration of the sliding window in seconds.
  private timeWindow = 0;

  // Elapsed time span covered by the current entries.
  private timeSpanOfEntries = 0;

  // Minimum entry value within the current window.
  private minVal = 0;

  // Maximum entry value within the current window.
  private maxVal = 0;

  // Current simulation time, advanced in step().
  private simulationTime = 0;

  // Accumulated time since the last statistics update.
  private elapsedSinceUpdate = 0;

  // Interval between statistics updates, in seconds.
  private clientUpdateInterval = 0;

  /**
   * Creates a recorder that maintains rolling statistics over a time window.
   * Updates are triggered from step() rather than a real-time timer.
   *
   * @param clientUpdateInterval - interval between statistics updates, in seconds
   * @param timeWindow - sliding window size, in seconds
   */
  public constructor( clientUpdateInterval: number, timeWindow: number ) {
    this.clientUpdateInterval = clientUpdateInterval;
    this.timeWindow = timeWindow;
  }

  /**
   * Clears recorded entries and resets derived statistics.
   * Does not reset simulation time or update timers.
   */
  public clear(): void {
    this.dataRecord.length = 0;
    this.dataTotal = 0;
    this.dataAverage = 0;
    this.timeSpanOfEntries = 0;
    this.minVal = 0;
    this.maxVal = 0;
  }

  /**
   * Resets the recorder to its initial state, including simulation time.
   */
  public reset(): void {
    this.clear();
    this.simulationTime = 0;
    this.elapsedSinceUpdate = 0;
  }

  /**
   * Adds a data entry at the current simulation time.
   * Caller manages when to push entries (e.g., per emission or per frame).
   */
  public addDataRecordEntry( value: number ): void {
    this.dataRecord.push( {
      time: this.simulationTime,
      value: value
    } );
  }

  /**
   * Steps the recorder forward in simulation time.
   * Updates statistics only when the client update interval elapses.
   *
   * @param dt - time step in seconds
   */
  public step( dt: number ): void {
    if ( dt > 0 ) {
      this.simulationTime += dt;
      this.elapsedSinceUpdate += dt;

      if ( this.elapsedSinceUpdate >= this.clientUpdateInterval ) {
        this.computeDataStatistics();
        this.elapsedSinceUpdate = 0;
      }
    }
  }

  /**
   * Returns the current sliding window size.
   */
  public getTimeWindow(): number {
    return this.timeWindow;
  }

  /**
   * Sets the sliding window size for new statistics calculations.
   */
  public setTimeWindow( timeWindow: number ): void {
    this.timeWindow = timeWindow;
  }

  /**
   * Sets the interval between statistics updates in seconds.
   */
  public setClientUpdateInterval( clientUpdateInterval: number ): void {
    this.clientUpdateInterval = clientUpdateInterval;
  }

  /**
   * Returns the sum of entry values within the current window.
   */
  public getDataTotal(): number {
    return this.dataTotal;
  }

  /**
   * Returns the average of entry values within the current window.
   */
  public getDataAverage(): number {
    return this.dataAverage;
  }

  /**
   * Returns the number of entries currently in the window.
   */
  public getNumEntries(): number {
    return this.dataRecord.length;
  }

  /**
   * Returns the elapsed time between the first and last entries.
   */
  public getTimeSpanOfEntries(): number {
    return this.timeSpanOfEntries;
  }

  /**
   * Returns the minimum value among entries in the current window.
   */
  public getMinVal(): number {
    return this.minVal;
  }

  /**
   * Returns the maximum value among entries in the current window.
   */
  public getMaxVal(): number {
    return this.maxVal;
  }

  /**
   * Recomputes totals, averages, and extrema based on the current window.
   * Removes any entries that are older than the configured time window.
   */
  protected computeDataStatistics(): void {
    if ( this.dataRecord.length > 0 ) {
      let startIndex = 0;
      while ( startIndex < this.dataRecord.length &&
              this.simulationTime - this.dataRecord[ startIndex ].time > this.timeWindow ) {
        startIndex++;
      }

      if ( startIndex > 0 ) {
        this.dataRecord.splice( 0, startIndex );
      }
    }

    this.dataTotal = 0;
    this.minVal = Number.POSITIVE_INFINITY;
    this.maxVal = Number.NEGATIVE_INFINITY;

    for ( let i = 0; i < this.dataRecord.length; i++ ) {
      const entry = this.dataRecord[ i ];
      this.dataTotal += entry.value;
      this.minVal = Math.min( this.minVal, entry.value );
      this.maxVal = Math.max( this.maxVal, entry.value );
    }

    this.dataAverage = 0;
    this.timeSpanOfEntries = 0;

    if ( this.dataRecord.length > 0 ) {
      const timeOfFirstEntry = this.dataRecord[ 0 ].time;
      const timeOfLastEntry = this.dataRecord[ this.dataRecord.length - 1 ].time;
      this.timeSpanOfEntries = timeOfLastEntry - timeOfFirstEntry;
      this.dataAverage = this.dataTotal / this.dataRecord.length;
    }
    else {
      this.minVal = 0;
      this.maxVal = 0;
    }
  }
}
