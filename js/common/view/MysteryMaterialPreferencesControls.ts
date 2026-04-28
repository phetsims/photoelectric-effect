// Copyright 2026, University of Colorado Boulder

/**
 * MysteryMaterialPreferencesControls groups the mystery material toggle and work function controls.
 * It extends VBox so a full mystery material section can be added to preferences content as a single child.
 *
 * TODO: This is a placeholder to test functionality until we know what the final look and behavior will be.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import type TProperty from '../../../../axon/js/TProperty.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import MysteryMaterialControl from './MysteryMaterialControl.js';
import MysteryMaterialWorkFunctionControl from './MysteryMaterialWorkFunctionControl.js';

export default class MysteryMaterialPreferencesControls extends VBox {

  /**
   * @param enabledProperty - Whether mystery material controls should be enabled.
   * @param workFunctionProperty - The mystery material work function, in eV.
   * @param labelStringProperty - Localized label for the mystery material toggle control.
   * @param tandem - Tandem for instrumenting this grouped preferences control.
   */
  public constructor(
    enabledProperty: Property<boolean>,
    workFunctionProperty: NumberProperty,
    labelStringProperty: TProperty<string>,
    tandem: Tandem
  ) {

    const mysteryMaterialControl = new MysteryMaterialControl(
      enabledProperty, labelStringProperty, {
        tandem: tandem.createTandem( 'mysteryMaterialControl' )
      } );

    const mysteryMaterialWorkFunctionControl = new MysteryMaterialWorkFunctionControl( workFunctionProperty, {
      tandem: tandem.createTandem( 'mysteryMaterialWorkFunctionControl' ),
      visibleProperty: enabledProperty
    } );

    super( {
      children: [ mysteryMaterialControl, mysteryMaterialWorkFunctionControl ],
      spacing: 10,
      excludeInvisibleChildrenFromBounds: false
    } );
  }
}
