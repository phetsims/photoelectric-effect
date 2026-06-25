// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for photon frequency (x) vs energy above work function (y), driven by photon wavelength.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Range from '../../../../dot/js/Range.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import { frequencyToWavelength, wavelengthToEnergy, wavelengthToFrequency } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphData, { type GraphDataOptions, type GraphDataPhetioOptions, type GraphMetadataConfig } from './GraphData.js';

export default class FrequencyEnergyGraphData extends GraphData {

  public constructor( model: PhotoelectricEffectModel, providedOptions: GraphDataPhetioOptions ) {

    // The driving Property is wavelength, but we need to map that to the plotted frequency range.
    const wavelengthRange = model.photonSource.wavelengthProperty.range;
    const frequencyAtMinWavelength = wavelengthToFrequency( wavelengthRange.min );
    const frequencyAtMaxWavelength = wavelengthToFrequency( wavelengthRange.max );
    const frequencyXDomain = new Range(
      Math.min( frequencyAtMinWavelength, frequencyAtMaxWavelength ),
      Math.max( frequencyAtMinWavelength, frequencyAtMaxWavelength )
    );

    // Map the frequency to the plotted energy, returning an x,y data point.
    const createDataPointAtFrequency = ( frequency: number ): Vector2 => {
      const wavelength = frequencyToWavelength( frequency );
      const energy = Math.max( 0, wavelengthToEnergy( wavelength ) - model.target.workFunctionProperty.value );
      return new Vector2( frequency, energy );
    };

    const secondValueMetadata: GraphMetadataConfig = {
      labelProperty: PhotoelectricEffectFluent.intensity.labelStringProperty,
      valueProperty: model.photonSource.intensityPercentProperty,
      formatValue: value => StringUtils.fillIn( PhotoelectricEffectFluent.intensity.percentReadoutPatternStringProperty.value, {
        value: toFixed( value, 0 )
      } )
    };
    const thirdValueMetadata: GraphMetadataConfig = {
      labelProperty: PhotoelectricEffectFluent.voltage.labelStringProperty,
      valueProperty: model.battery.voltageProperty,
      formatValue: value => StringUtils.fillIn( PhotoelectricEffectFluent.voltage.valueReadoutPatternStringProperty.value, {
        value: toFixed( value, 2 )
      } )
    };

    super(
      model.photonSource.wavelengthProperty,
      createDataPointAtFrequency,
      model,
      secondValueMetadata,
      thirdValueMetadata,
      [

        // Changing the material changes the relationship and should clear teh data. Customizing the work
        // function is effectively changing the material.
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter,
      combineOptions<GraphDataOptions>( {}, providedOptions, {

        // The user controls wavelength. But we plot with frequency.
        xDomain: frequencyXDomain,
        drivingValueToChartX: wavelength => wavelengthToFrequency( wavelength ),

        // KEmax is only measurable while the source emits photons, so no new data plots while the source intensity
        // is at 0% (mimics the Java sim), see https://github.com/phetsims/photoelectric-effect/issues/102
        samplingEnabledProperty: new DerivedProperty(
          [ model.photonSource.normalizedIntensityProperty ],
          normalizedIntensity => normalizedIntensity > 0
        )
      } )
    );
  }
}
