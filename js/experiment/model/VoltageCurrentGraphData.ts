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
import GraphData, { type GraphDataOptions, type GraphDataPhetioOptions } from './GraphData.js';

export default class VoltageCurrentGraphData extends GraphData {

  public constructor(
    model: PhotoelectricEffectModel,
    providedOptions: GraphDataPhetioOptions
  ) {
    super(
      model.battery.voltageProperty,
      voltage => new Vector2( voltage, model.getCurrentForVoltage( voltage ) ),
      model,
      PhotoelectricEffectFluent.wavelength.labelStringProperty,
      model.wavelengthProperty,
      ( value: number ) => toFixed( value, 2 ),
      PhotoelectricEffectFluent.intensity.labelStringProperty,
      model.photonSource.normalizedOutputPercentProperty,
      ( value: number ) => StringUtils.fillIn( PhotoelectricEffectFluent.intensity.percentReadoutPatternStringProperty.value, {
        value: toFixed( value, 0 )
      } ),
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
