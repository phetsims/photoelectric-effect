// Copyright 2026, University of Colorado Boulder

/**
 * Graph samples for plate voltage (x) vs analytic current (y), driven by voltageProperty.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import GraphData from './GraphData.js';

export default class VoltageCurrentGraphData extends GraphData {

  public constructor( model: PhotoelectricEffectModel ) {
    super(
      model.voltageProperty,
      voltage => new Vector2( voltage, model.currentProperty.value ),
      [
        model.photonSource.intensityProperty,
        model.wavelengthProperty,
        model.target.materialProperty,
        model.target.workFunctionProperty
      ],
      model.resetEmitter
    );
  }
}
