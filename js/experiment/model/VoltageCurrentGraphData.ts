// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for plate voltage (x) vs analytic current (y), driven by voltageProperty.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphData, { type GraphDataOptions, type GraphDataPhetioOptions, type GraphMetadataConfig } from './GraphData.js';

export default class VoltageCurrentGraphData extends GraphData {

  public constructor(
    model: PhotoelectricEffectModel,
    providedOptions: GraphDataPhetioOptions
  ) {
    const secondValueMetadata: GraphMetadataConfig = {
      labelProperty: PhotoelectricEffectFluent.wavelength.labelStringProperty,
      valueProperty: model.wavelengthProperty,
      formatValue: value => StringUtils.fillIn( PhotoelectricEffectFluent.wavelength.valueReadoutPatternStringProperty.value, {
        value: toFixed( value, 0 )
      } )
    };
    const thirdValueMetadata: GraphMetadataConfig = {
      labelProperty: PhotoelectricEffectFluent.intensity.labelStringProperty,
      valueProperty: model.photonSource.intensityPercentProperty,
      formatValue: value => StringUtils.fillIn( PhotoelectricEffectFluent.intensity.percentReadoutPatternStringProperty.value, {
        value: toFixed( value, 0 )
      } )
    };

    super(
      model.battery.voltageProperty,
      voltage => new Vector2( voltage, model.getCurrentForVoltage( voltage ) ),
      model,
      secondValueMetadata,
      thirdValueMetadata,
      [
        model.photonSource.photonRateProperty,
        model.wavelengthProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter,
      combineOptions<GraphDataOptions>( {}, providedOptions, {
        binCount: 400
      } )
    );
  }
}
