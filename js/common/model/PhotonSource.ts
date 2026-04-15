// Copyright 2026, University of Colorado Boulder

/**
 * Model for the photon source that emits photons toward the target.
 * Stores photon emission settings that determine how many photons are produced
 * and their energies.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// Default intensity used at initialization.
const INITIAL_INTENSITY = 0;

// Default wavelength in nanometers used at initialization.
const INITIAL_WAVELENGTH = 400;

// Allowed wavelength range in nanometers.
const WAVELENGTH_RANGE = new Range( PhotoelectricEffectConstants.MIN_WAVELENGTH,
  PhotoelectricEffectConstants.MAX_WAVELENGTH_UI );

type PhotonSourceOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotonSource {

  // Allowed intensity range (normalized 0-1).
  public static readonly INTENSITY_RANGE = new Range( 0, 1 );

  /**
   * Controls photon emission rate as a normalized value.
   * Higher values produce more photons per unit time.
   */
  public readonly intensityProperty: NumberProperty;

  /**
   * Wavelength of emitted photons.
   * Used to compute photon energy for target interactions.
   */
  public readonly wavelengthProperty: NumberProperty;

  /**
   * Creates a photon source with its own intensity and wavelength Properties.
   */
  public constructor( providedOptions: PhotonSourceOptions ) {
    const tandem = providedOptions.tandem;

    this.intensityProperty = new NumberProperty( INITIAL_INTENSITY, {
      range: PhotonSource.INTENSITY_RANGE,
      tandem: tandem.createTandem( 'intensityProperty' )
    } );

    this.wavelengthProperty = new NumberProperty( INITIAL_WAVELENGTH, {
      range: WAVELENGTH_RANGE,
      tandem: tandem.createTandem( 'wavelengthProperty' )
    } );
  }

  /**
   * Resets intensity and wavelength to their initial values.
   */
  public reset(): void {
    this.intensityProperty.reset();
    this.wavelengthProperty.reset();
  }
}