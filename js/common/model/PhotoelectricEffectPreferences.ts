// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferences contains sim-specific preferences that are shared across screens.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
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

  // TODO: @design Is emitAllAbsorbedPhotons the right name for this preference?
  // When true, photons with energy above the active material's work function always emit an electron. This differs
  // from the normal model, which samples across the full occupied band and may choose an energy level too deep to
  // escape. This also differs from "highestEnergyOnly", which collapses emitted electrons to the maximum kinetic
  // energy while preserving the normal probabilistic rejection behavior.
  //
  // With this preference enabled, the target samples only from the accessible portion of the occupied band,
  // [ workFunction, min( photonEnergy, workFunction + bandDepth ) ], so emitted electrons keep a continuous energy
  // distribution from near zero kinetic energy up to the maximum kinetic energy.
  public static readonly emitAllAbsorbedPhotonsProperty = new BooleanProperty(
    PhotoelectricEffectQueryParameters.emitAllAbsorbedPhotons,
    {
      tandem: Tandem.PREFERENCES.createTandem( 'emitAllAbsorbedPhotonsProperty' ),
      phetioFeatured: true,
      phetioDocumentation: 'Whether photons above the work-function threshold always emit an electron ' +
                           'with a sampled accessible-band energy'
    }
  );
}
