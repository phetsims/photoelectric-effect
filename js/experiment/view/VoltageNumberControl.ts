// Copyright 2026, University of Colorado Boulder

/**
 * VoltageNumberControl is the NumberControl used to set plate voltage in the Experiment screen.
 * It centralizes slider range, tick labels, and sizing.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl, { type NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

export type VoltageNumberControlOptions = PickRequired<NumberControlOptions, 'tandem'> & NodeTranslationOptions;

// Number of evenly spaced major ticks across the voltage range, including both extremes. For the symmetric
// voltage range this places ticks at the extremes, the halfway points, and zero (-8, -4, 0, 4, 8 V).
const NUMBER_OF_MAJOR_TICKS = 5;

export default class VoltageNumberControl extends NumberControl {

  /**
   * @param voltageProperty - Voltage Property controlled by this UI.
   * @param providedOptions - NumberControl options and required instrumentation tandem.
   */
  public constructor( voltageProperty: NumberProperty, providedOptions: VoltageNumberControlOptions ) {

    // Evenly spaced, labeled major ticks across the voltage range.
    const majorTicks = _.times( NUMBER_OF_MAJOR_TICKS, tickIndex => {
      const tickValue = voltageProperty.range.expandNormalizedValue( tickIndex / ( NUMBER_OF_MAJOR_TICKS - 1 ) );
      return {
        value: tickValue,
        label: new Text( toFixed( tickValue, 0 ), {
          font: PhotoelectricEffectConstants.TICK_LABEL_FONT
        } )
      };
    } );

    const options = optionize<VoltageNumberControlOptions, EmptySelfOptions, NumberControlOptions>()( {
      delta: 0.01,
      accessibleName: PhotoelectricEffectFluent.a11y.voltageNumberControl.accessibleNameStringProperty,
      titleNodeOptions: {
        font: PhotoelectricEffectConstants.CONTENT_FONT
      },
      layoutFunction: NumberControl.createLayoutFunction1( {
        arrowButtonsXSpacing: 0
      } ),
      numberDisplayOptions: {
        visible: false
      },
      sliderOptions: {
        thumbSize: new Dimension2( 15, 30 ),
        trackSize: new Dimension2( 150, 1 ),
        majorTicks: majorTicks,
        majorTickLength: 8
      }
    }, providedOptions );

    super(
      PhotoelectricEffectFluent.voltage.labelStringProperty,
      voltageProperty,
      voltageProperty.range,
      options );
  }
}
