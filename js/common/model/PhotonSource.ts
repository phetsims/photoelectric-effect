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
import PhotoelectricEffectModelConstants from './PhotoelectricEffectModelConstants.js';

const INITIAL_INTENSITY = 1;
const INTENSITY_RANGE = new Range( 0, 1 );
const INITIAL_WAVELENGTH = 400;
const WAVELENGTH_RANGE = new Range( PhotoelectricEffectModelConstants.MIN_WAVELENGTH,
  PhotoelectricEffectModelConstants.MAX_WAVELENGTH_UI );

type PhotonSourceOptions = PickRequired<PhetioObjectOptions, 'tandem'>;

export default class PhotonSource {

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

  public constructor( providedOptions: PhotonSourceOptions ) {
    const tandem = providedOptions.tandem;

    this.intensityProperty = new NumberProperty( INITIAL_INTENSITY, {
      range: INTENSITY_RANGE,
      tandem: tandem.createTandem( 'intensityProperty' )
    } );

    this.wavelengthProperty = new NumberProperty( INITIAL_WAVELENGTH, {
      range: WAVELENGTH_RANGE,
      tandem: tandem.createTandem( 'wavelengthProperty' )
    } );
  }

  public reset(): void {
    this.intensityProperty.reset();
    this.wavelengthProperty.reset();
  }
}