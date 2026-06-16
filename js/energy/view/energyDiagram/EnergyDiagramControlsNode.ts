// Copyright 2026, University of Colorado Boulder

/**
 * Controls for optional labels in the Energy screen energy diagram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import VBox, { type VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../PhotoelectricEffectFluent.js';

type SelfOptions = EmptySelfOptions;
type EnergyDiagramControlsNodeOptions = SelfOptions & VBoxOptions & PickRequired<VBoxOptions, 'tandem'>;

// Vertical spacing between diagram controls.
const CHECKBOX_SPACING = 10;

// Checkbox layout.
const CHECKBOX_LABEL_MAX_WIDTH = 110;
const CHECKBOX_BOX_WIDTH = 17;

/**
 * Stacks diagram-specific controls so they can be composed with shared graph controls in the accordion.
 */
export default class EnergyDiagramControlsNode extends VBox {

  public constructor( labelsVisibleProperty: Property<boolean>,
                      workFunctionVisibleProperty: Property<boolean>,
                      photonArrowsVisibleProperty: Property<boolean>,
                      providedOptions: EnergyDiagramControlsNodeOptions ) {

    const options = optionize<EnergyDiagramControlsNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: CHECKBOX_SPACING,
      children: [

        new Checkbox(
          workFunctionVisibleProperty,
          new Text( PhotoelectricEffectFluent.energy.graph.diagramControls.workFunctionStringProperty, {
            font: PhotoelectricEffectConstants.CONTENT_FONT,
            maxWidth: CHECKBOX_LABEL_MAX_WIDTH
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4,
            tandem: providedOptions.tandem.createTandem( 'workFunctionCheckbox' )
          }
        ),

        new Checkbox(
          labelsVisibleProperty,
          new Text( PhotoelectricEffectFluent.energy.graph.diagramControls.labelStringProperty, {
            font: PhotoelectricEffectConstants.CONTENT_FONT,
            maxWidth: CHECKBOX_LABEL_MAX_WIDTH
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4,
            tandem: providedOptions.tandem.createTandem( 'labelsCheckbox' )
          }
        ),

        new Checkbox(
          photonArrowsVisibleProperty,
          new Text( PhotoelectricEffectFluent.energy.graph.diagramControls.photonArrowStringProperty, {
            font: PhotoelectricEffectConstants.CONTENT_FONT,
            maxWidth: CHECKBOX_LABEL_MAX_WIDTH
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4,
            tandem: providedOptions.tandem.createTandem( 'photonArrowCheckbox' )
          }
        )
      ]
    }, providedOptions );

    super( options );
  }
}
