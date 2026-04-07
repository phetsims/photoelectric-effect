// Copyright 2026, University of Colorado Boulder

/**
 * Shared physics utilities for the photoelectric effect model.
 * Includes wavelength/energy conversions used across the model.
 *
 * @author Marla A. Schulz (PhET Interactive Simulations)
 */

import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// hc constant in eV*nm for wavelength-energy conversions.
const PHOTON_ENERGY_CONSTANT = 1240;

/**
 * Converts photon wavelength in nm to energy in eV.
 * Uses the simplified hc constant used by the legacy model.
 */
export const wavelengthToEnergy = ( wavelength: number ): number => {
  let energy = 0;
  if ( wavelength > 0 ) {
    energy = PHOTON_ENERGY_CONSTANT / wavelength;
  }
  return energy;
};

/**
 * Converts normalized intensity to photons-per-second.
 * Matches legacy behavior by scaling with wavelength.
 * Clamps intensity to [0, 1] before applying the scale.
 */
export const intensityToPhotonRate = ( intensity: number, wavelength: number ): number => {
  const clampedIntensity = Math.max( 0, Math.min( intensity, 1 ) );
  const wavelengthScale = wavelength / PhotoelectricEffectConstants.MAX_WAVELENGTH_UI;
  return clampedIntensity * PhotoelectricEffectConstants.MAX_PHOTONS_PER_SECOND * wavelengthScale;
};
