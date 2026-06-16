// Copyright 2026, University of Colorado Boulder

/**
 * Shared layout values and calculations for the Energy screen graph displays.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
export default class EnergyGraphLayout {

  // Space between y-axis tick labels and the plot area.
  public static readonly Y_TICK_LABEL_MARGIN = 5;

  // Space between x-axis tick labels and the plot area.
  public static readonly X_TICK_LABEL_MARGIN = 5;

  /**
   * Returns the center x position for a sample in graph model coordinates. Sample indices are zero-based, while model x
   * positions are one-based.
   */
  public static getSampleCenterX( sampleIndex: number ): number {
    return sampleIndex + 1;
  }
}
