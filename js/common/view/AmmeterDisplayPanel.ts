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
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import type { NodeBoundsBasedTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { ampsToMilliAmps } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = EmptySelfOptions;

export type AmmeterDisplayPanelOptions =
  SelfOptions &
  NodeBoundsBasedTranslationOptions &
  PickRequired<PanelOptions, 'tandem'>;

export default class AmmeterDisplayPanel extends Panel {

  public constructor( currentProperty: ReadOnlyProperty<number>, providedOptions: AmmeterDisplayPanelOptions ) {

    const options = optionize<AmmeterDisplayPanelOptions, SelfOptions, PanelOptions>()( {
      stroke: 'black',
      lineWidth: 3,
      cornerRadius: 8,
      fill: PhotoelectricEffectColors.ammeterPanelFillColorProperty,
      minWidth: 120,
      align: 'center',
      xMargin: 10,
      yMargin: 8,
      isDisposable: false
    }, providedOptions );

    const microampCurrentProperty = new DerivedProperty( [ currentProperty ], current => ampsToMilliAmps( current ) );

    const currentDisplay = new NumberDisplay(
      microampCurrentProperty,
      new Range( 0, ampsToMilliAmps( PhotoelectricEffectConstants.MAX_CURRENT ) ),
      {
        // TODO: @design What should this be? And the design doc describes units for this readout are still tbd.
        decimalPlaces: 3,
        cornerRadius: 3,
        backgroundStroke: 'black',
        valuePattern: PhotoelectricEffectFluent.current.readoutPatternStringProperty,
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT
        },
        tandem: options.tandem.createTandem( 'currentDisplay' )
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
