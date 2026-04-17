// Copyright 2026, University of Colorado Boulder

/**
 * Shared utilities for the photoelectric effect sim: physics conversions (model) and visible-spectrum color
 * mapping (view), kept in one module for reuse across model and view code.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// hc constant in eV*nm for wavelength-energy conversions.
const PHOTON_ENERGY_CONSTANT = 1240;

// Speed of light in vacuum in m/s (exact SI definition, used for c = f λ).
const SPEED_OF_LIGHT_METERS_PER_SECOND = 299792458;

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
 * Photon frequency in units of 10^15 Hz from wavelength in nm.
 * Uses f = c / λ with λ converted from nm to m, then scaled to petahertz.
 */
export const wavelengthToFrequency = ( wavelength: number ): number => {
  let frequency = 0;
  if ( wavelength > 0 ) {
    const wavelengthMeters = wavelength * 1e-9;
    frequency = SPEED_OF_LIGHT_METERS_PER_SECOND / wavelengthMeters / 1e15;
  }
  return frequency;
};

/**
 * Photon wavelength in nm from frequency in units of 10^15 Hz.
 * Inverse of wavelengthToFrequency for positive finite frequencies.
 */
export const frequencyToWavelength = ( frequency: number ): number => {
  let wavelength = 0;
  if ( frequency > 0 ) {
    const frequencyHertz = frequency * 1e15;
    wavelength = SPEED_OF_LIGHT_METERS_PER_SECOND / frequencyHertz * 1e9;
  }
  return wavelength;
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

/**
 * Maps wavelength in nm to a display color for spectrum sliders (thumb and track).
 * UV and IR bands use white, consistent across photon-source controls.
 */
export const wavelengthToColor = ( wavelength: number ): Color => {
  return VisibleColor.wavelengthToColor( wavelength, {
    uvColor: Color.WHITE,
    irColor: Color.WHITE
  } );
};

/**
 * Color at the high-intensity end of the intensity backplate gradient for the selected wavelength.
 * Same UV/IR treatment as wavelengthToColor, without reducing intensity at spectral extrema.
 */
export const wavelengthToIntensityGradientEndColor = ( wavelength: number ): Color => {
  return VisibleColor.wavelengthToColor( wavelength, {
    uvColor: Color.WHITE,
    irColor: Color.WHITE,
    reduceIntensityAtExtrema: false
  } );
};
