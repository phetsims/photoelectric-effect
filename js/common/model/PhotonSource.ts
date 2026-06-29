// Copyright 2026, University of Colorado Boulder

/**
 * Model for the photon source that emits photons toward the target.
 * Stores photon emission settings that determine how many photons are produced
 * and their energies.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { nanometersUnit } from '../../../../scenery-phet/js/units/nanometersUnit.js';
import { photonsPerSecondUnit } from '../../../../scenery-phet/js/units/photonsPerSecondUnit.js';
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import PhotoelectricEffectPreferences from './PhotoelectricEffectPreferences.js';
import { normalizedIntensityToPhotonRate } from './PhotoelectricEffectUtils.js';

// Default normalized source intensity used at initialization.
const INITIAL_NORMALIZED_INTENSITY = 0;

// Default wavelength in nanometers used at initialization.
const INITIAL_WAVELENGTH = 400;

// Allowed wavelength range in nanometers.
const WAVELENGTH_RANGE = new Range( PhotoelectricEffectConstants.MIN_WAVELENGTH,
  PhotoelectricEffectConstants.MAX_WAVELENGTH_UI );

type PhotonSourceOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotonSource {

  // Allowed normalized source intensity range.
  public static readonly NORMALIZED_INTENSITY_RANGE = new Range( 0, 1 );

  /**
   * Controls the source intensity as a normalized value.
   * The selected emission mode determines how this value maps to photons per second.
   */
  public readonly normalizedIntensityProperty: NumberProperty;

  /**
   * Source intensity as a percentage (100 × normalized intensity), for UI and clients that prefer percent units.
   */
  public readonly intensityPercentProperty: TReadOnlyProperty<number>;

  // Derived photon emission rate for the current normalized source intensity and emission mode.
  public readonly photonRateProperty: TReadOnlyProperty<number>;

  /**
   * Wavelength of emitted photons.
   * Used to compute photon energy for target interactions.
   */
  public readonly wavelengthProperty: NumberProperty;

  /**
   * Creates a photon source with its own source intensity and wavelength Properties.
   */
  public constructor( providedOptions: PhotonSourceOptions ) {
    const tandem = providedOptions.tandem;

    this.normalizedIntensityProperty = new NumberProperty( INITIAL_NORMALIZED_INTENSITY, {
      range: PhotonSource.NORMALIZED_INTENSITY_RANGE,
      tandem: tandem.createTandem( 'normalizedIntensityProperty' ),
      phetioDocumentation: 'Normalized photon source intensity from 0 to 1, interpreted by the selected emission mode'
    } );

    this.intensityPercentProperty = new DerivedProperty(
      [ this.normalizedIntensityProperty ],
      normalizedIntensity => 100 * normalizedIntensity,
      {
        tandem: tandem.createTandem( 'intensityPercentProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'Photon source intensity as a percentage from 0 to 100'
      }
    );

    this.wavelengthProperty = new NumberProperty( INITIAL_WAVELENGTH, {
      range: WAVELENGTH_RANGE,
      units: nanometersUnit,
      tandem: tandem.createTandem( 'wavelengthProperty' ),
      phetioDocumentation: 'Wavelength of emitted photons in nanometers'
    } );

    this.photonRateProperty = new DerivedProperty(
      [
        this.normalizedIntensityProperty,
        this.wavelengthProperty,
        PhotoelectricEffectPreferences.photonModeProperty
      ],
      ( normalizedIntensity, wavelength, photonMode ) => normalizedIntensityToPhotonRate(
        normalizedIntensity,
        wavelength,
        photonMode
      ),
      {
        units: photonsPerSecondUnit,
        tandem: tandem.createTandem( 'photonRateProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        phetioDocumentation: 'Photon emission rate in photons per second'
      }
    );
  }

  /**
   * Gets the photon emission rate for an arbitrary normalized source intensity, using the current wavelength
   * and selected emission mode.
   */
  public getPhotonRateForNormalizedIntensity( normalizedIntensity: number ): number {
    return normalizedIntensityToPhotonRate(
      normalizedIntensity,
      this.wavelengthProperty.value,
      PhotoelectricEffectPreferences.photonModeProperty.value
    );
  }

  /**
   * Resets source intensity and wavelength to their initial values.
   */
  public reset(): void {
    this.normalizedIntensityProperty.reset();
    this.wavelengthProperty.reset();
  }
}