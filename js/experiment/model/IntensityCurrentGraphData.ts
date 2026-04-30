// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for intensity (x) vs analytic current (y), driven by normalized photon source output.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectPreferences from '../../common/model/PhotoelectricEffectPreferences.js';
import GraphData, { type GraphDataOptions, type GraphDataPhetioOptions } from './GraphData.js';

export default class IntensityCurrentGraphData extends GraphData {

  public constructor(
    model: PhotoelectricEffectModel,
    providedOptions: GraphDataPhetioOptions
  ) {
    super(
      model.photonSource.normalizedOutputProperty,
      normalizedOutput => new Vector2( normalizedOutput, model.getCurrentForNormalizedOutput( normalizedOutput ) ),
      [
        model.battery.voltageProperty,
        model.wavelengthProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty,
        PhotoelectricEffectPreferences.photonCountModeEnabledProperty
      ],
      model.resetEmitter,
      combineOptions<GraphDataOptions>( {}, providedOptions, {
        binCount: 100
      } )
    );
  }
}
