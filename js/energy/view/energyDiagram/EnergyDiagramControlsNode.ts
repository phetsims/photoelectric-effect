// Copyright 2026, University of Colorado Boulder

/**
 * Controls for optional labels in the Energy screen energy diagram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedStringProperty from '../../../../../axon/js/DerivedStringProperty.js';
import Property from '../../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import MathSymbols from '../../../../../scenery-phet/js/MathSymbols.js';
import HBox from '../../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { type VBoxOptions } from '../../../../../scenery/js/layout/nodes/VBox.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../PhotoelectricEffectFluent.js';

type SelfOptions = EmptySelfOptions;
type EnergyDiagramControlsNodeOptions = SelfOptions & VBoxOptions & PickRequired<VBoxOptions, 'tandem'>;

// Vertical spacing between diagram controls.
const CHECKBOX_SPACING = 10;

// Checkbox layout.
const CHECKBOX_LABEL_MAX_WIDTH = 130;
const CHECKBOX_BOX_WIDTH = 17;
const PHOTON_ARROW_ICON_LENGTH = 18;
const PHOTON_ARROW_ICON_SPACING = 6;
const PHOTON_ARROW_ICON_TAIL_WIDTH = 1.25;
const PHOTON_ARROW_ICON_HEAD_WIDTH = 8;
const PHOTON_ARROW_ICON_HEAD_HEIGHT = 8;
const PHOTON_ARROW_CHECKBOX_LABEL_MAX_WIDTH = CHECKBOX_LABEL_MAX_WIDTH - PHOTON_ARROW_ICON_HEAD_WIDTH -
                                              PHOTON_ARROW_ICON_SPACING;

/**
 * Stacks diagram-specific controls so they can be composed with shared graph controls in the accordion.
 */
export default class EnergyDiagramControlsNode extends VBox {

  private readonly disposeEnergyDiagramControlsNode: () => void;

  public constructor( labelsVisibleProperty: Property<boolean>,
                      workFunctionVisibleProperty: Property<boolean>,
                      photonArrowsVisibleProperty: Property<boolean>,
                      providedOptions: EnergyDiagramControlsNodeOptions ) {

    const workFunctionLabelStringProperty = new DerivedStringProperty(
      [ PhotoelectricEffectFluent.energy.graph.diagramControls.workFunctionStringProperty ],
      workFunctionLabel => `${workFunctionLabel} (${MathSymbols.PHI_SYMBOL})`,
      { tandem: Tandem.OPT_OUT }
    );

    const options = optionize<EnergyDiagramControlsNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: CHECKBOX_SPACING,
      children: [

        new Checkbox(
          workFunctionVisibleProperty,
          new Text( workFunctionLabelStringProperty, {
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
          new RichText( PhotoelectricEffectFluent.energy.graph.diagramControls.labelStringProperty, {
            font: PhotoelectricEffectConstants.CONTENT_FONT,
            maxWidth: CHECKBOX_LABEL_MAX_WIDTH
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4,
            tandem: providedOptions.tandem.createTandem( 'labelCheckbox' )
          }
        ),

        new Checkbox(
          photonArrowsVisibleProperty,
          new HBox( {
            spacing: PHOTON_ARROW_ICON_SPACING,
            align: 'center',
            children: [
              new Text( PhotoelectricEffectFluent.energy.graph.diagramControls.photonArrowStringProperty, {
                font: PhotoelectricEffectConstants.CONTENT_FONT,
                maxWidth: PHOTON_ARROW_CHECKBOX_LABEL_MAX_WIDTH
              } ),

              // Icon matching the photon arrows drawn in the energy diagram.
              // TODO: Factor out into some kind of icon factory, see https://github.com/phetsims/photoelectric-effect/issues/153
              new ArrowNode( 0, PHOTON_ARROW_ICON_LENGTH, 0, 0, {
                fill: PhotoelectricEffectColors.photonArrowEnergyDiagramColorProperty,
                stroke: PhotoelectricEffectColors.photonArrowEnergyDiagramColorProperty,
                tailWidth: PHOTON_ARROW_ICON_TAIL_WIDTH,
                headWidth: PHOTON_ARROW_ICON_HEAD_WIDTH,
                headHeight: PHOTON_ARROW_ICON_HEAD_HEIGHT
              } )
            ]
          } ), {
            boxWidth: CHECKBOX_BOX_WIDTH,
            spacing: 4,
            tandem: providedOptions.tandem.createTandem( 'photonArrowCheckbox' )
          }
        )
      ]
    }, providedOptions );

    super( options );

    this.disposeEnergyDiagramControlsNode = () => {
      workFunctionLabelStringProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeEnergyDiagramControlsNode();
    super.dispose();
  }
}
