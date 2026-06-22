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
import { voltsUnit } from '../../../../scenery-phet/js/units/voltsUnit.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

export default class Battery {

  /**
   * Voltage across the plates, in volts.
   */
  public readonly voltageProperty: NumberProperty;

  public static readonly RANGE = new Range( PhotoelectricEffectConstants.MIN_VOLTAGE, PhotoelectricEffectConstants.MAX_VOLTAGE );

  public constructor( tandem: Tandem ) {
    this.voltageProperty = new NumberProperty( PhotoelectricEffectConstants.DEFAULT_BATTERY_VOLTAGE, {
      range: Battery.RANGE,
      units: voltsUnit,
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
