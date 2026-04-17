// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for photon frequency (x) vs energy above work function (y), driven by photon wavelength.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import { frequencyToWavelength, wavelengthToEnergy, wavelengthToFrequency } from '../../common/model/PhotoelectricEffectUtils.js';
import GraphData from './GraphData.js';

export default class FrequencyEnergyGraphData extends GraphData {

  public constructor( model: PhotoelectricEffectModel ) {

    // The driving Property is wavelength, but we need to map that to the plotted frequency range.
    const wavelengthRange = model.photonSource.wavelengthProperty.range;
    const frequencyAtMinWavelength = wavelengthToFrequency( wavelengthRange.min );
    const frequencyAtMaxWavelength = wavelengthToFrequency( wavelengthRange.max );
    const frequencyXDomain = new Range(
      Math.min( frequencyAtMinWavelength, frequencyAtMaxWavelength ),
      Math.max( frequencyAtMinWavelength, frequencyAtMaxWavelength )
    );

    // Map the frequency to the plotted energy, returning an x,y data point.
    const createFrequencyEnergyPointAtFrequency = ( frequency: number ): Vector2 => {
      const wavelength = frequencyToWavelength( frequency );
      const energy = Math.max( 0, wavelengthToEnergy( wavelength ) - model.target.workFunctionProperty.value );
      return new Vector2( frequency, energy );
    };

    super(
      model.photonSource.wavelengthProperty,
      createFrequencyEnergyPointAtFrequency,
      [
        model.photonSource.intensityProperty,
        model.voltageProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter,
      0.01,
      {
        // The user controls wavelength. But we plot with frequency.
        xDomain: frequencyXDomain,
        drivingValueToChartX: wavelength => wavelengthToFrequency( wavelength )
      }
    );
  }
}
