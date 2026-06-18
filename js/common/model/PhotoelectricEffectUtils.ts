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
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import type { PhotonMode } from './PhotonMode.js';

type WavelengthColorStop = {
  wavelength: number;
  color: () => Color;
};

// hc constant in eV*nm for wavelength-energy conversions.
const PHOTON_ENERGY_CONSTANT = 1240;

// Speed of light in vacuum in m/s (exact SI definition, used for c = f λ).
const SPEED_OF_LIGHT_METERS_PER_SECOND = 299792458;

// SpectrumNode samples these stops to render short gradients from the non-visible tinted grey regions into the
// visible spectrum. Adjust these wavelengths and colors to tune the UV/IR bands.
// TODO: Consider if this should be moved to common code. If the team likes it and we keep it, we will probably
//  want this kind of thing for other sims.
const UV_SPECTRUM_TRACK_COLOR_STOPS: WavelengthColorStop[] = [
  {
    wavelength: PhotoelectricEffectConstants.MIN_WAVELENGTH,
    color: () => PhotoelectricEffectColors.wavelengthSliderUVTrackBackgroundColorProperty.value
  },
  {
    wavelength: 330,
    color: () => PhotoelectricEffectColors.wavelengthSliderUVTrackBackgroundColorProperty.value
  },
  {
    wavelength: VisibleColor.MIN_WAVELENGTH,
    color: () => VisibleColor.wavelengthToColor( VisibleColor.MIN_WAVELENGTH )
  }
];

const IR_SPECTRUM_TRACK_COLOR_STOPS: WavelengthColorStop[] = [
  {
    wavelength: VisibleColor.MAX_WAVELENGTH,
    color: () => VisibleColor.wavelengthToColor( VisibleColor.MAX_WAVELENGTH )
  },
  {
    wavelength: 820,
    color: () => PhotoelectricEffectColors.wavelengthSliderIRTrackBackgroundColorProperty.value
  },
  {
    wavelength: PhotoelectricEffectConstants.MAX_WAVELENGTH_UI,
    color: () => PhotoelectricEffectColors.wavelengthSliderIRTrackBackgroundColorProperty.value
  }
];

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
 * Converts normalized photon source output to photons-per-second for the selected emission mode.
 * This is a direct port from the java.
 */
export const normalizedOutputToPhotonRate = (
  normalizedOutput: number,
  wavelength: number,
  photonMode: PhotonMode
): number => {

  // Sanity check.
  const clampedNormalizedOutput = Math.max( 0, Math.min( normalizedOutput, 1 ) );
  return photonMode === 'count' ? clampedNormalizedOutput * PhotoelectricEffectConstants.MAX_PHOTONS_PER_SECOND :
         photonMode === 'intensity' ? intensityToPhotonRate( clampedNormalizedOutput, wavelength ) :
         ( () => { throw new Error( `Unrecognized photonMode: ${photonMode}` ); } )();
};

/**
 * Converts electric current from amps to microamps.
 */
export const ampsToMicroamps = ( currentAmps: number ): number => {
  return currentAmps * 1e6;
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
 * Maps wavelength in nm to the color sampled by the wavelength slider track. Visible wavelengths use
 * VisibleColor directly. UV and IR use photoelectric-specific gradient stops so the non-visible regions can be
 * tuned independently from shared scenery-phet color behavior.
 */
export const wavelengthToSpectrumTrackColor = ( wavelength: number ): Color => {
  if ( VisibleColor.isUVWavelength( wavelength ) ) {
    return wavelengthToColorFromStops( wavelength, UV_SPECTRUM_TRACK_COLOR_STOPS );
  }
  else if ( VisibleColor.isIRWavelength( wavelength ) ) {
    return wavelengthToColorFromStops( wavelength, IR_SPECTRUM_TRACK_COLOR_STOPS );
  }
  else {
    return VisibleColor.wavelengthToColor( wavelength );
  }
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

/**
 * Returns the interpolated color for a wavelength from a sorted list of wavelength color stops.
 */
function wavelengthToColorFromStops( wavelength: number, colorStops: WavelengthColorStop[] ): Color {
  assert && assert( colorStops.length >= 2, 'At least two color stops are required.' );

  const firstStop = colorStops[ 0 ];
  const lastStop = colorStops[ colorStops.length - 1 ];

  if ( wavelength <= firstStop.wavelength ) {
    return firstStop.color();
  }
  else if ( wavelength >= lastStop.wavelength ) {
    return lastStop.color();
  }

  for ( let i = 1; i < colorStops.length; i++ ) {
    const previousStop = colorStops[ i - 1 ];
    const nextStop = colorStops[ i ];

    assert && assert( previousStop.wavelength < nextStop.wavelength, 'Color stops must be sorted by wavelength.' );

    if ( wavelength <= nextStop.wavelength ) {
      const ratio = ( wavelength - previousStop.wavelength ) / ( nextStop.wavelength - previousStop.wavelength );
      return Color.interpolateRGBA( previousStop.color(), nextStop.color(), ratio );
    }
  }

  throw new Error( `No color stop found for wavelength ${wavelength}` );
}
