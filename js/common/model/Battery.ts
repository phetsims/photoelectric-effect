// Copyright 2026, University of Colorado Boulder

/**
 * Model for the battery accessory that drives voltage between plates.
 * Owns the voltage Property shared with the model.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import PhotoelectricEffectModelConstants from './PhotoelectricEffectModelConstants.js';

export default class Battery {

  /**
   * Voltage across the plates, in model units.
   */
  public readonly voltageProperty: NumberProperty;

  public constructor( voltageProperty?: NumberProperty ) {
    this.voltageProperty = voltageProperty || new NumberProperty( 0, {
      range: new Range( PhotoelectricEffectModelConstants.MIN_VOLTAGE,
        PhotoelectricEffectModelConstants.MAX_VOLTAGE )
    } );
  }

  public reset(): void {
    this.voltageProperty.reset();
  }
}
