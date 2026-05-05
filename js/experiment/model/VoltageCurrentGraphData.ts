// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for plate voltage (x) vs analytic current (y), driven by voltageProperty.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
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
