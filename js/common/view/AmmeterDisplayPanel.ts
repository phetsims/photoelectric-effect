// Copyright 2026, University of Colorado Boulder

/**
 * Ammeter-style display panel for current readout in the photoelectric effect sim.
 * Shows a top "Current" label and a bottom numeric readout.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import type ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import { microamperesUnit } from '../../../../scenery-phet/js/units/microamperesUnit.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import type { NodeBoundsBasedTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { ampsToMicroamps } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

const MIN_DISPLAYED_MICROAMPS = 0.001;

type SelfOptions = EmptySelfOptions;

export type AmmeterDisplayPanelOptions =
  SelfOptions &
  NodeBoundsBasedTranslationOptions &
  PickRequired<PanelOptions, 'tandem'>;

export default class AmmeterDisplayPanel extends Panel {

  public constructor( currentProperty: ReadOnlyProperty<number>, providedOptions: AmmeterDisplayPanelOptions ) {

    const options = optionize<AmmeterDisplayPanelOptions, SelfOptions, PanelOptions>()( {
      stroke: PhotoelectricEffectColors.panelStrokeColorProperty,
      lineWidth: 3,
      cornerRadius: 8,
      fill: PhotoelectricEffectColors.ammeterPanelFillColorProperty,
      minWidth: 120,
      align: 'center',
      xMargin: 10,
      yMargin: 8,
      isDisposable: false,
      accessibleName: PhotoelectricEffectFluent.a11y.ammeterDisplayPanel.accessibleNameStringProperty
    }, providedOptions );

    const microampCurrentProperty = new DerivedProperty( [ currentProperty ], current => ampsToMicroamps( current ) );

    const currentDisplay = new NumberDisplay(
      microampCurrentProperty,

      // NumberDisplay uses displayRange to size the readout, so include a non-zero sub-threshold value to account
      // for the inequality formatter.
      new Range( MIN_DISPLAYED_MICROAMPS / 2, ampsToMicroamps( PhotoelectricEffectConstants.MAX_CURRENT ) ),
      {
        // Use an inequality readout for non-zero currents below the visible precision.
        numberFormatter: value => {
          if ( value > 0 && value < MIN_DISPLAYED_MICROAMPS ) {
            return {
              visualString: StringUtils.fillIn( microamperesUnit.visualSymbolPatternStringProperty!.value, {
                value: StringUtils.wrapLTR( '< 0.001' )
              } ),
              accessibleString: microamperesUnit.accessiblePattern!.format( {

                // TODO: a11y i18n? Or just remove this. Wait until we see a11y designs to implement.
                value: 'less than 0.001'
              } )
            };
          }
          else {
            return microamperesUnit.getDualString( value, { decimalPlaces: 3 } );
          }
        },
        numberFormatterDependencies: microamperesUnit.getDependentProperties(),
        cornerRadius: 3,
        backgroundStroke: 'black',
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT
        }
      }
    );

    const currentLabel = new Text( PhotoelectricEffectFluent.current.labelStringProperty, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      maxWidth: 120
    } );

    const content = new VBox( {
      spacing: 6,
      align: 'center',
      children: [
        currentLabel,
        currentDisplay
      ]
    } );

    super( content, options );

    this.addLinkedElement( currentProperty );
  }
}
