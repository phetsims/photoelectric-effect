// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for intensity (x) vs analytic current (y), driven by normalized photon source output.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectPreferences from '../../common/model/PhotoelectricEffectPreferences.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GraphData, { type GraphDataOptions, type GraphDataPhetioOptions } from './GraphData.js';

export default class IntensityCurrentGraphData extends GraphData {

  public constructor(
    model: PhotoelectricEffectModel,
    providedOptions: GraphDataPhetioOptions
  ) {
    super(
      model.photonSource.normalizedOutputProperty,
      normalizedOutput => new Vector2( normalizedOutput, model.getCurrentForNormalizedOutput( normalizedOutput ) ),
      model,
      PhotoelectricEffectFluent.wavelength.labelStringProperty,
      model.wavelengthProperty,
      ( value: number ) => toFixed( value, 2 ),
      PhotoelectricEffectFluent.voltage.labelStringProperty,
      model.battery.voltageProperty,
      ( value: number ) => StringUtils.fillIn( PhotoelectricEffectFluent.voltage.valueReadoutPatternStringProperty.value, {
        value: toFixed( value, 2 )
      } ),
      [
        model.battery.voltageProperty,
        model.wavelengthProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty,
        PhotoelectricEffectPreferences.photonModeProperty
      ],
      model.resetEmitter,
      combineOptions<GraphDataOptions>( {}, providedOptions, {
        binCount: 100
      } )
    );
  }
}
