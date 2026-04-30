// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferences contains sim-specific preferences that are shared across screens.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import StringUnionProperty from '../../../../axon/js/StringUnionProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectQueryParameters from '../PhotoelectricEffectQueryParameters.js';
import { type PhotonMode, PhotonModeValues } from './PhotonMode.js';

export default class PhotoelectricEffectPreferences {

  private constructor() {
    // This class is not intended to be instantiated.
  }

  // How the photon source output control maps to photon emission rate.
  public static readonly photonModeProperty = new StringUnionProperty<PhotonMode>(
    PhotoelectricEffectQueryParameters.photonMode as PhotonMode,
    {
      validValues: PhotonModeValues,
      tandem: Tandem.PREFERENCES.createTandem( 'photonModeProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'How the photon source output control maps to photon emission rate'
    }
  );
}
