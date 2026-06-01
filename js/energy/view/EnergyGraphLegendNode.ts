// Copyright 2026, University of Colorado Boulder

/**
 * Legend for the Energy screen graph displays. Shows color swatches and labels that identify graph-specific
 * quantities. The legend is a vertical stack of rows. Each row is supplied as an array of legend items; rows with
 * one item add that item directly, while rows with multiple items are wrapped in a horizontal layout so related
 * entries can share one line.
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

export type EnergyGraphLegendItem = {
  fill: TPaint;
  labelStringProperty: TReadOnlyProperty<string>;
};

type SelfOptions = EmptySelfOptions;
export type EnergyGraphLegendNodeOptions = SelfOptions & VBoxOptions;

// Size of the square color samples in the graph legend.
const LEGEND_SWATCH_SIZE = 14;

// Vertical spacing between rows in the graph legend.
const LEGEND_ROW_SPACING = 8;

// Horizontal spacing between legend items in the top row.
const LEGEND_COLUMN_SPACING = 16;

// Horizontal spacing between each swatch and its text label.
const LEGEND_ITEM_SPACING = 6;

export default class EnergyGraphLegendNode extends VBox {

  /**
   * @param rows - Outer array defines vertical rows. Inner arrays define the items within a row, arranged
   * horizontally when there is more than one item.
   * @param providedOptions
   */
  public constructor( rows: EnergyGraphLegendItem[][], providedOptions?: EnergyGraphLegendNodeOptions ) {
    const options = optionize<EnergyGraphLegendNodeOptions, SelfOptions, VBoxOptions>()( {
      align: 'left',
      spacing: LEGEND_ROW_SPACING,
      children: rows.map( row => row.length === 1 ?
                           EnergyGraphLegendNode.createLegendItem( row[ 0 ] ) :
                           new HBox( {
                             align: 'center',
                             spacing: LEGEND_COLUMN_SPACING,
                             children: row.map( item => EnergyGraphLegendNode.createLegendItem( item ) )
                           } ) )
    }, providedOptions );

    super( options );
  }

  /**
   * Creates one legend item with a colored swatch and the associated energy label.
   */
  private static createLegendItem( item: EnergyGraphLegendItem ): Node {
    return new HBox( {
      align: 'center',
      spacing: LEGEND_ITEM_SPACING,
      children: [
        new Rectangle( 0, 0, LEGEND_SWATCH_SIZE, LEGEND_SWATCH_SIZE, {
          fill: item.fill,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Text( item.labelStringProperty, {
          font: PhotoelectricEffectConstants.CONTENT_FONT
        } )
      ]
    } );
  }
}
