// Copyright 2026, University of Colorado Boulder

/**
 * Legend for the Energy screen graph displays. Shows color swatches and labels that identify each energy quantity
 * shown by the bar graph.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox, { type VBoxOptions } from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type TPaint from '../../../../scenery/js/util/TPaint.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type SelfOptions = EmptySelfOptions;
type EnergyGraphLegendNodeOptions = SelfOptions & VBoxOptions;

// Size of the square color samples in the graph legend.
const LEGEND_SWATCH_SIZE = 14;

// Vertical spacing between rows in the graph legend.
const LEGEND_ROW_SPACING = 8;

// Horizontal spacing between each swatch and its text label.
const LEGEND_ITEM_SPACING = 6;

export default class EnergyGraphLegendNode extends VBox {

  public constructor( providedOptions?: EnergyGraphLegendNodeOptions ) {

    const options = optionize<EnergyGraphLegendNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: LEGEND_ROW_SPACING,
      children: [
        EnergyGraphLegendNode.createLegendItem(
          PhotoelectricEffectColors.potentialEnergyGraphColorProperty,
          PhotoelectricEffectFluent.energy.graph.legend.potentialEnergyStringProperty
        ),
        EnergyGraphLegendNode.createLegendItem(
          PhotoelectricEffectColors.photonEnergyGraphColorProperty,
          PhotoelectricEffectFluent.energy.graph.legend.photonEnergyStringProperty
        ),
        EnergyGraphLegendNode.createLegendItem(
          PhotoelectricEffectColors.kineticEnergyGraphColorProperty,
          PhotoelectricEffectFluent.energy.graph.legend.kineticEnergyStringProperty
        )
      ]
    }, providedOptions );

    super( options );
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
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Text( labelStringProperty, {
          font: PhotoelectricEffectConstants.CONTENT_FONT
        } )
      ]
    } );
  }
}
