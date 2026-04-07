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
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

export default class Battery {

  /**
   * Voltage across the plates, in model units.
   */
  public readonly voltageProperty: NumberProperty;

  /**
   * Creates a battery, using the provided voltage Property if supplied.
   */
  public constructor( tandem: Tandem ) {

    this.voltageProperty = new NumberProperty( PhotoelectricEffectConstants.DEFAULT_BATTERY_VOLTAGE, {
      range: new Range( PhotoelectricEffectConstants.MIN_VOLTAGE,
        PhotoelectricEffectConstants.MAX_VOLTAGE ),
      tandem: tandem.createTandem( 'voltageProperty' )
    } );
  }

  /**
   * Resets the voltage to its initial value.
   */
  public reset(): void {
    this.voltageProperty.reset();
  }
}
