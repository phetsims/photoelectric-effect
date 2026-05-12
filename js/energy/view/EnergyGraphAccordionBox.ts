// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for the energy graph. Displays color swatches and labels that identify each energy quantity shown
 * in the graph, along with display mode controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type TPaint from '../../../../scenery/js/util/TPaint.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import { wavelengthToEnergy } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type EnergyModel from '../model/EnergyModel.js';
import EnergyBarGraphNode from './EnergyBarGraphNode.js';
import EnergyGraphDisplayModeRadioButtonGroup from './EnergyGraphDisplayModeRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

export type EnergyGraphAccordionBoxOptions =
  SelfOptions & NodeTranslationOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

// Size of the square color samples in the graph legend.
const LEGEND_SWATCH_SIZE = 14;

// Vertical spacing between rows in the graph legend.
const LEGEND_ROW_SPACING = 8;

// Horizontal spacing between each swatch and its text label.
const LEGEND_ITEM_SPACING = 6;

// Vertical spacing between the legend and graph display radio buttons.
const CONTENT_SECTION_SPACING = 18;

// Vertical spacing between the plot and display mode controls.
const GRAPH_SECTION_SPACING = 8;

export default class EnergyGraphAccordionBox extends AccordionBox {

  public constructor( model: EnergyModel, providedOptions: EnergyGraphAccordionBoxOptions ) {

    const options = optionize<EnergyGraphAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 10,

      titleNode: new Text( PhotoelectricEffectFluent.screen.energyStringProperty, {
        font: PhotoelectricEffectConstants.PANEL_TITLE_FONT
      } )
    }, providedOptions );

    const legendNode = new VBox( {
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
    } );

    const barGraphNode = new EnergyBarGraphNode( model.target.workFunctionProperty, {
      visibleProperty: new DerivedProperty( [ model.energyGraphDisplayModeProperty ], displayMode => displayMode === 'barGraph' )
    } );

    // Show the current operating point until EnergyModel owns a sample history for this graph.
    Multilink.multilink( [ model.wavelengthProperty, model.target.workFunctionProperty ], ( wavelength, workFunction ) => {
      const potentialEnergy = -workFunction;
      const photonEnergy = wavelengthToEnergy( wavelength );
      const kineticEnergy = Math.max( 0, photonEnergy - workFunction );
      barGraphNode.setSampleData( 0, {
        potentialEnergy: potentialEnergy,
        photonEnergy: photonEnergy,
        kineticEnergy: kineticEnergy
      } );
      barGraphNode.setSampleData( 1, 'no-emit' );
      barGraphNode.setSampleData( 2, null );
    } );

    const displayModeRadioButtonGroup = new EnergyGraphDisplayModeRadioButtonGroup( model.energyGraphDisplayModeProperty, {
      tandem: options.tandem.createTandem( 'displayModeRadioButtonGroup' )
    } );

    const graphControlsNode = new VBox( {
      align: 'center',
      spacing: GRAPH_SECTION_SPACING,
      children: [
        barGraphNode,
        displayModeRadioButtonGroup
      ]
    } );

    super( new VBox( {
      align: 'left',
      spacing: CONTENT_SECTION_SPACING,
      children: [
        legendNode,
        graphControlsNode
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
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Text( labelStringProperty, {
          font: PhotoelectricEffectConstants.CONTENT_FONT
        } )
      ]
    } );
  }
}
