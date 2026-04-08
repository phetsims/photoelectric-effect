// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectConstants is the set of constants used throughout the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

export default class PhotoelectricEffectConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;
  public static readonly DEFAULT_BATTERY_VOLTAGE = 0;

  // Factor to scale analytically reported current from photons-per-second.
  public static readonly CURRENT_JIMMY_FACTOR = 0.015;

  // Factor to scale voltage across electrodes for display.
  public static readonly VOLTAGE_SCALE_FACTOR = 1;

  // Minimum voltage in the model range (volts).
  public static readonly MIN_VOLTAGE = -8;

  // Maximum voltage in the model range (volts).
  public static readonly MAX_VOLTAGE = 8;

  // Minimum wavelength in the model range (nm).
  public static readonly MIN_WAVELENGTH = 100;

  // Maximum wavelength used by the model (nm).
  public static readonly MAX_WAVELENGTH = 800;

  // Maximum wavelength used by the UI slider (nm).
  public static readonly MAX_WAVELENGTH_UI = 850;

  // Maximum photon emission rate (photons per second).
  public static readonly MAX_PHOTONS_PER_SECOND = 500;

  // Maximum expected current for the ammeter display, derived from max rate.
  public static readonly MAX_CURRENT = PhotoelectricEffectConstants.MAX_PHOTONS_PER_SECOND *
                                       PhotoelectricEffectConstants.CURRENT_JIMMY_FACTOR / 8;

  // Electron mass in kilograms, used for kinetic energy conversions.
  public static readonly ELECTRON_MASS = 9.11e-31;

  // Scale factor applied to computed electron speeds for model tuning.
  public static readonly ELECTRON_SPEED_SCALE_FACTOR = 5e-16;

  // Minimum electron speed for randomized emission (model units per second).
  public static readonly MINIMUM_ELECTRON_SPEED = 0.1;

  // Acceleration scale from voltage to model units (model units per V*s^2).
  public static readonly ELECTRON_ACCELERATION_SCALE = 100.2865;
}
