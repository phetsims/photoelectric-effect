// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for photon frequency (x) vs energy above work function (y), driven by photon wavelength.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import { wavelengthToEnergy, wavelengthToFrequency } from '../../common/model/PhotoelectricEffectUtils.js';
import GraphData from './GraphData.js';

export default class FrequencyEnergyGraphData extends GraphData {

  public constructor( model: PhotoelectricEffectModel ) {
    super(
      model.photonSource.wavelengthProperty,
      wavelength => {
        const frequency = wavelengthToFrequency( wavelength );
        const energy = Math.max( 0, wavelengthToEnergy( wavelength ) - model.target.workFunctionProperty.value );
        return new Vector2( frequency, energy );
      },
      [
        model.photonSource.intensityProperty,
        model.voltageProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter
    );
  }
}
