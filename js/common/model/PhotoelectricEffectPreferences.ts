// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferences contains sim-specific preferences that are shared across screens.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectQueryParameters from '../PhotoelectricEffectQueryParameters.js';

export default class PhotoelectricEffectPreferences {

  private constructor() {
    // This class is not intended to be instantiated.
  }

  // Whether the photon source output control directly sets photon rate instead of wavelength-scaled intensity.
  public static readonly photonCountModeEnabledProperty = new BooleanProperty( PhotoelectricEffectQueryParameters.photonCountMode, {
    tandem: Tandem.PREFERENCES.createTandem( 'photonCountModeEnabledProperty' ),
    phetioFeatured: true,
    phetioDocumentation: 'Whether the photon source output control directly sets photon emission rate'
  } );
}
