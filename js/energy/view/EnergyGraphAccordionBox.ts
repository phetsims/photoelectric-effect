// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for the energy graph. Displays color swatches and labels that identify each energy quantity shown
 * in the graph, along with display mode controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type TPaint from '../../../../scenery/js/util/TPaint.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type { EnergyGraphDisplayMode } from '../model/EnergyModel.js';

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
const CONTENT_SECTION_SPACING = 14;

// Size of the icons in the graph display radio buttons.
const DISPLAY_MODE_ICON_SIZE = 36;

export default class EnergyGraphAccordionBox extends AccordionBox {

  public constructor( energyGraphDisplayModeProperty: PhetioProperty<EnergyGraphDisplayMode>,
                      providedOptions: EnergyGraphAccordionBoxOptions ) {

    const options = optionize<EnergyGraphAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 10
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

    const displayModeRadioButtonGroup = new RectangularRadioButtonGroup<EnergyGraphDisplayMode>(
      energyGraphDisplayModeProperty,
      EnergyGraphAccordionBox.createDisplayModeRadioButtonItems(), {

        // Match the Intro screen representation radio buttons.
        orientation: 'horizontal',
        radioButtonOptions: {
          baseColor: PhotoelectricEffectColors.screenBackgroundColorProperty,
          minWidth: 64,
          minHeight: 64
        },
        isDisposable: false,
        tandem: options.tandem.createTandem( 'displayModeRadioButtonGroup' )
      } );

    super( new VBox( {
      align: 'center',
      spacing: CONTENT_SECTION_SPACING,
      children: [
        legendNode,
        displayModeRadioButtonGroup
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

  /**
   * Creates the radio button items for energy graph display modes.
   */
  private static createDisplayModeRadioButtonItems(): RectangularRadioButtonGroupItem<EnergyGraphDisplayMode>[] {
    return [
      {
        value: 'barGraph',
        createNode: () => EnergyGraphAccordionBox.createBarGraphIcon(),
        tandemName: 'barGraphRadioButton'
      },
      {
        value: 'energyDiagram',
        createNode: () => EnergyGraphAccordionBox.createEnergyDiagramIcon(),
        tandemName: 'energyDiagramRadioButton'
      }
    ];
  }

  /**
   * Creates an icon with bars for potential, photon, and kinetic energy.
   */
  private static createBarGraphIcon(): Node {
    const barBaselineY = DISPLAY_MODE_ICON_SIZE / 2;
    const energyBarWidth = 7;

    return new Node( {
      children: [
        new Line( 1, barBaselineY, DISPLAY_MODE_ICON_SIZE - 1, barBaselineY, {
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
          lineWidth: 1.5
        } ),
        new Rectangle( 4, barBaselineY, energyBarWidth, 17, {
          fill: PhotoelectricEffectColors.potentialEnergyGraphColorProperty,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Rectangle( 15, 2, energyBarWidth, barBaselineY - 2, {
          fill: PhotoelectricEffectColors.photonEnergyGraphColorProperty,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Rectangle( 26, 12, energyBarWidth, barBaselineY - 12, {
          fill: PhotoelectricEffectColors.kineticEnergyGraphColorProperty,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } )
      ]
    } );
  }

  /**
   * Creates an icon for the energy diagram display mode.
   */
  private static createEnergyDiagramIcon(): Node {
    const zeroEnergyLineLeftX = 0;
    const zeroEnergyLineRightX = DISPLAY_MODE_ICON_SIZE;
    const energyAxisX = 1;
    const plotRightX = DISPLAY_MODE_ICON_SIZE - 1;
    const lowerEnergyLevelY = DISPLAY_MODE_ICON_SIZE;
    const conductionBandBottomY = DISPLAY_MODE_ICON_SIZE - 3;
    const conductionBandTopY = 26;
    const zeroEnergyLineY = 14;

    return new Node( {
      children: [
        new Rectangle(
          energyAxisX,
          conductionBandTopY,
          plotRightX - energyAxisX,
          conductionBandBottomY - conductionBandTopY, {
            fill: PhotoelectricEffectColors.conductionBandEnergyDiagramColorProperty
        } ),
        new ArrowNode( energyAxisX, lowerEnergyLevelY, energyAxisX, 2, {
          fill: PhotoelectricEffectColors.iconStrokeColorProperty,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
          lineWidth: 1,
          tailWidth: 0.5,
          headWidth: 8,
          headHeight: 8
        } ),
        new Line( energyAxisX, lowerEnergyLevelY, plotRightX, lowerEnergyLevelY, {
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
          lineWidth: 1.5
        } ),
        new Line( energyAxisX, conductionBandBottomY, plotRightX, conductionBandBottomY, {
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
          lineWidth: 1.5
        } ),
        new Line( zeroEnergyLineLeftX, zeroEnergyLineY, zeroEnergyLineRightX, zeroEnergyLineY, {
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
          lineWidth: 1.5,
          lineDash: [ 3, 3 ]
        } )
      ]
    } );
  }
}
