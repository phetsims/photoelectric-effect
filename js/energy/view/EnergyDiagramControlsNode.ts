// Copyright 2026, University of Colorado Boulder

/**
 * Controls for optional labels in the Energy screen energy diagram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import VBox, { type VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';

type SelfOptions = EmptySelfOptions;
type EnergyDiagramControlsNodeOptions = SelfOptions & VBoxOptions;

// Vertical spacing between diagram controls.
const CHECKBOX_SPACING = 10;

// Checkbox layout.
const CHECKBOX_LABEL_MAX_WIDTH = 110;
const CHECKBOX_BOX_WIDTH = 17;
const CHECKBOX_LABEL_FONT = new PhetFont( 14 );

/**
 * Stacks diagram-specific controls so they can be composed with shared graph controls in the accordion.
 */
export default class EnergyDiagramControlsNode extends VBox {

  public constructor( labelsVisibleProperty: BooleanProperty,
                      workFunctionVisibleProperty: BooleanProperty,
                      providedOptions?: EnergyDiagramControlsNodeOptions ) {

    const options = optionize<EnergyDiagramControlsNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: CHECKBOX_SPACING,
      children: [

        // TODO: i18n
        new Checkbox(
          labelsVisibleProperty,
          new Text( 'Labels', {
            font: CHECKBOX_LABEL_FONT,
            maxWidth: CHECKBOX_LABEL_MAX_WIDTH
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4
          }
        ),

        // TODO: i18n
        new Checkbox(
          workFunctionVisibleProperty,
          new Text( 'Work Function', {
            font: CHECKBOX_LABEL_FONT,
            maxWidth: CHECKBOX_LABEL_MAX_WIDTH
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4
          }
        )
      ]
    }, providedOptions );

    super( options );
  }
}
