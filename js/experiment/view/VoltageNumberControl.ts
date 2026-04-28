// Copyright 2026, University of Colorado Boulder

/**
 * VoltageNumberControl is the NumberControl used to set battery voltage in the Experiment screen.
 * It centralizes slider range, tick labels, and sizing.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberControl, { type NumberControlOptions } from '../../../../scenery-phet/js/NumberControl.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';

export type VoltageNumberControlOptions = PickRequired<NumberControlOptions, 'tandem'>;

export default class VoltageNumberControl extends NumberControl {

  /**
   * @param model - Provides the voltage Property controlled by this UI.
   * @param providedOptions - NumberControl options and required instrumentation tandem.
   */
  public constructor( model: ExperimentModel, providedOptions: VoltageNumberControlOptions ) {
    super(
      PhotoelectricEffectFluent.voltage.labelStringProperty,
      model.battery.voltageProperty,
      model.battery.voltageProperty.range,
      combineOptions<NumberControlOptions>( {
        delta: 0.01,
        titleNodeOptions: {

          // TODO: Use new PhetFont in constants when available in main
          font: new PhetFont( 16 )
        },
        layoutFunction: NumberControl.createLayoutFunction1( {
          arrowButtonsXSpacing: 0
        } ),
        numberDisplayOptions: {
          visible: false
        },
        sliderOptions: {
          trackSize: new Dimension2( 140, 2 ),
          majorTicks: [
            {
              value: PhotoelectricEffectConstants.MIN_VOLTAGE,
              label: new Text( toFixed( PhotoelectricEffectConstants.MIN_VOLTAGE, 2 ), {
                font: PhotoelectricEffectConstants.READOUT_FONT
              } )
            },
            {
              value: PhotoelectricEffectConstants.MAX_VOLTAGE,
              label: new Text( toFixed( PhotoelectricEffectConstants.MAX_VOLTAGE, 2 ), {
                font: PhotoelectricEffectConstants.READOUT_FONT
              } )
            }
          ],
          majorTickLength: 8,

          // To produce one minor tick at 0.
          minorTickSpacing: model.battery.voltageProperty.range.getLength() / 2
        }
      }, providedOptions )
    );
  }
}
