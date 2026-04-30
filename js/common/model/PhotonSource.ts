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
import { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import PhotoelectricEffectPreferences from './PhotoelectricEffectPreferences.js';
import { normalizedOutputToPhotonRate } from './PhotoelectricEffectUtils.js';

// Default normalized source output used at initialization.
const INITIAL_NORMALIZED_OUTPUT = 0;

// Default wavelength in nanometers used at initialization.
const INITIAL_WAVELENGTH = 400;

// Allowed wavelength range in nanometers.
const WAVELENGTH_RANGE = new Range( PhotoelectricEffectConstants.MIN_WAVELENGTH,
  PhotoelectricEffectConstants.MAX_WAVELENGTH_UI );

type PhotonSourceOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotonSource {

  // Allowed normalized source output range.
  public static readonly NORMALIZED_OUTPUT_RANGE = new Range( 0, 1 );

  /**
   * Controls the source output as a normalized value.
   * The selected emission mode determines how this value maps to photons per second.
   */
  public readonly normalizedOutputProperty: NumberProperty;

  /**
   * Source output as a percentage (100 × normalized output), for UI and clients that prefer percent units.
   */
  public readonly normalizedOutputPercentProperty: TReadOnlyProperty<number>;

  // Derived photon emission rate for the current normalized source output and emission mode.
  public readonly photonRateProperty: TReadOnlyProperty<number>;

  /**
   * Wavelength of emitted photons.
   * Used to compute photon energy for target interactions.
   */
  public readonly wavelengthProperty: NumberProperty;

  /**
   * Creates a photon source with its own source output and wavelength Properties.
   */
  public constructor( providedOptions: PhotonSourceOptions ) {
    const tandem = providedOptions.tandem;

    this.normalizedOutputProperty = new NumberProperty( INITIAL_NORMALIZED_OUTPUT, {
      range: PhotonSource.NORMALIZED_OUTPUT_RANGE,
      tandem: tandem.createTandem( 'normalizedOutputProperty' ),
      phetioDocumentation: 'Normalized photon source output from 0 to 1, interpreted by the selected emission mode'
    } );

    this.normalizedOutputPercentProperty = new DerivedProperty(
      [ this.normalizedOutputProperty ],
      normalizedOutput => 100 * normalizedOutput,
      {
        tandem: tandem.createTandem( 'normalizedOutputPercentProperty' ),
        phetioValueType: NumberIO,
        phetioDocumentation: 'Photon source output as a percentage from 0 to 100'
      }
    );

    this.wavelengthProperty = new NumberProperty( INITIAL_WAVELENGTH, {
      range: WAVELENGTH_RANGE,
      tandem: tandem.createTandem( 'wavelengthProperty' ),
      phetioDocumentation: 'Wavelength of emitted photons in nanometers'
    } );

    this.photonRateProperty = new DerivedProperty(
      [
        this.normalizedOutputProperty,
        this.wavelengthProperty,
        PhotoelectricEffectPreferences.photonCountModeEnabledProperty
      ],
      ( normalizedOutput, wavelength, photonCountModeEnabled ) => normalizedOutputToPhotonRate(
        normalizedOutput,
        wavelength,
        photonCountModeEnabled
      ),
      {
        tandem: tandem.createTandem( 'photonRateProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        phetioDocumentation: 'Photon emission rate in photons per second'
      }
    );
  }

  /**
   * Gets the photon emission rate for an arbitrary normalized source output, using the current wavelength
   * and selected emission mode.
   */
  public getPhotonRateForNormalizedOutput( normalizedOutput: number ): number {
    return normalizedOutputToPhotonRate(
      normalizedOutput,
      this.wavelengthProperty.value,
      PhotoelectricEffectPreferences.photonCountModeEnabledProperty.value
    );
  }

  /**
   * Resets source output and wavelength to their initial values.
   */
  public reset(): void {
    this.normalizedOutputProperty.reset();
    this.wavelengthProperty.reset();
  }
}