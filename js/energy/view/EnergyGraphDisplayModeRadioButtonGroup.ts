// Copyright 2026, University of Colorado Boulder

/**
 * Radio button group for switching between Energy screen graph display modes.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type PhetioProperty from '../../../../axon/js/PhetioProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RectangularRadioButtonGroup, { RectangularRadioButtonGroupItem, RectangularRadioButtonGroupOptions } from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import type { EnergyGraphDisplayMode } from '../model/EnergyGraphDisplayProperties.js';

type SelfOptions = EmptySelfOptions;

export type EnergyGraphDisplayModeRadioButtonGroupOptions =
  SelfOptions & PickRequired<RectangularRadioButtonGroupOptions, 'tandem'>;

// Size of the icons in the graph display radio buttons.
const DISPLAY_MODE_ICON_SIZE = 36;

export default class EnergyGraphDisplayModeRadioButtonGroup extends RectangularRadioButtonGroup<EnergyGraphDisplayMode> {

  public constructor( energyGraphDisplayModeProperty: PhetioProperty<EnergyGraphDisplayMode>,
                      providedOptions: EnergyGraphDisplayModeRadioButtonGroupOptions ) {

    const options = optionize<
      EnergyGraphDisplayModeRadioButtonGroupOptions,
      SelfOptions,
      RectangularRadioButtonGroupOptions
    >()( {
      orientation: 'horizontal',
      radioButtonOptions: PhotoelectricEffectConstants.SQUARE_RADIO_BUTTON_OPTIONS,
      isDisposable: false
    }, providedOptions );

    super(
      energyGraphDisplayModeProperty,
      EnergyGraphDisplayModeRadioButtonGroup.createDisplayModeRadioButtonItems(),
      options
    );
  }

  /**
   * Creates the radio button items for energy graph display modes.
   */
  private static createDisplayModeRadioButtonItems(): RectangularRadioButtonGroupItem<EnergyGraphDisplayMode>[] {
    return [
      {
        value: 'barGraph',
        createNode: () => EnergyGraphDisplayModeRadioButtonGroup.createBarGraphIcon(),
        tandemName: 'barGraphRadioButton'
      },
      {
        value: 'energyDiagram',
        createNode: () => EnergyGraphDisplayModeRadioButtonGroup.createEnergyDiagramIcon(),
        tandemName: 'energyDiagramRadioButton'
      }
    ];
  }

  /**
   * Creates an icon with bars for binding, photon, and kinetic energy.
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
          fill: PhotoelectricEffectColors.bindingEnergyGraphColorProperty,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Rectangle( 15, 2, energyBarWidth, barBaselineY - 2, {
          fill: PhotoelectricEffectColors.photonEnergyGraphColorProperty,
          stroke: PhotoelectricEffectColors.iconStrokeColorProperty
        } ),
        new Rectangle( 26, 12, energyBarWidth, barBaselineY - 12, {
          fill: PhotoelectricEffectColors.kineticEnergyColorProperty,
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
    const lowerEnergyLevelY = DISPLAY_MODE_ICON_SIZE - 5;
    const conductionBandBottomY = DISPLAY_MODE_ICON_SIZE - 10;
    const zeroEnergyLineY = 18;

    return new Node( {
      children: [
        new Rectangle(
          energyAxisX,
          zeroEnergyLineY,
          plotRightX - energyAxisX,
          lowerEnergyLevelY - zeroEnergyLineY, {
            fill: PhotoelectricEffectColors.emptyStatesEnergyDiagramColorProperty
          } ),
        new Rectangle(
          energyAxisX,
          conductionBandBottomY,
          plotRightX - energyAxisX,
          lowerEnergyLevelY - conductionBandBottomY, {
            fill: PhotoelectricEffectColors.electronColorProperty
          } ),
        new ArrowNode( energyAxisX, DISPLAY_MODE_ICON_SIZE, energyAxisX, 2, {
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
