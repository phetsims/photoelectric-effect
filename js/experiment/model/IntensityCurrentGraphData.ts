// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for intensity (x) vs analytic current (y), driven by photon source intensity.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import GraphData from './GraphData.js';

export default class IntensityCurrentGraphData extends GraphData {

  public constructor(
    model: PhotoelectricEffectModel
  ) {
    super(
      model.photonSource.intensityProperty,
      voltage => new Vector2( voltage, model.getCurrentForVoltage( voltage ) ),
      [
        model.voltageProperty,
        model.wavelengthProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter
    );
  }
}
