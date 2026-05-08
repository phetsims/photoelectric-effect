// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for the energy graph legend. Displays color swatches and labels that identify each energy quantity
 * shown in the graph.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type TPaint from '../../../../scenery/js/util/TPaint.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type SelfOptions = EmptySelfOptions;
export type EnergyGraphAccordionBoxOptions =
  SelfOptions & NodeTranslationOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

// Size of the square color samples in the graph legend.
const LEGEND_SWATCH_SIZE = 14;

// Vertical spacing between rows in the graph legend.
const LEGEND_ROW_SPACING = 8;

// Horizontal spacing between each swatch and its text label.
const LEGEND_ITEM_SPACING = 6;

export default class EnergyGraphAccordionBox extends AccordionBox {

  public constructor( providedOptions: EnergyGraphAccordionBoxOptions ) {

    const options = optionize<EnergyGraphAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 10
    }, providedOptions );

    super( new VBox( {
      align: 'left',
      spacing: LEGEND_ROW_SPACING,
      children: [
        EnergyGraphAccordionBox.createLegendItem(
          PhotoelectricEffectColors.potentialEnergyGraphColorProperty,
          PhotoelectricEffectFluent.energy.graph.legend.potentialEnergyStringProperty
        ),
        EnergyGraphAccordionBox.createLegendItem(
          PhotoelectricEffectColors.photonEnergyGraphColorProperty,
          PhotoelectricEffectFluent.energy.graph.legend.photonEnergyStringProperty
        ),
        EnergyGraphAccordionBox.createLegendItem(
          PhotoelectricEffectColors.kineticEnergyGraphColorProperty,
          PhotoelectricEffectFluent.energy.graph.legend.kineticEnergyStringProperty
        )
      ]
    } ), options );
  }

  /**
   * Creates one row for the energy graph legend, with a colored swatch and the associated energy label.
   */
  private static createLegendItem( color: TPaint, labelStringProperty: TReadOnlyProperty<string> ): Node {
    return new HBox( {
      align: 'center',
      spacing: LEGEND_ITEM_SPACING,
      children: [
        new Rectangle( 0, 0, LEGEND_SWATCH_SIZE, LEGEND_SWATCH_SIZE, {
          fill: color,
          stroke: 'black'
        } ),
        new Text( labelStringProperty, {
          font: PhotoelectricEffectConstants.CONTENT_FONT
        } )
      ]
    } );
  }
}
