// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for intensity (x) vs analytic current (y), driven by photon source intensity.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import GraphData, { type GraphDataOptions, type GraphDataPhetioOptions } from './GraphData.js';

export default class IntensityCurrentGraphData extends GraphData {

  public constructor(
    model: PhotoelectricEffectModel,
    providedOptions: GraphDataPhetioOptions
  ) {
    super(
      model.photonSource.intensityProperty,
      intensity => new Vector2( intensity, model.getCurrentForIntensity( intensity ) ),
      [
        model.battery.voltageProperty,
        model.wavelengthProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter,
      combineOptions<GraphDataOptions>( {}, providedOptions, {
        binCount: 100
      } )
    );
  }
}
