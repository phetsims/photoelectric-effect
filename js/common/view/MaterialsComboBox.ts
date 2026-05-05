// Copyright 2026, University of Colorado Boulder

/**
 * MaterialsComboBox is the combo box used to choose the active target material.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import Node, { NodeBoundsBasedTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import Material from '../model/Material.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import getMaterialLabelStringProperty from './getMaterialLabelStringProperty.js';

type SelfOptions = EmptySelfOptions;

type MaterialsComboBoxOptions = SelfOptions & PickRequired<ComboBoxOptions, 'tandem'> & NodeBoundsBasedTranslationOptions;

export default class MaterialsComboBox extends ComboBox<Material> {

  /**
   * @param materialProperty - Property that stores the currently selected material.
   * @param materials - Available material options shown in the combo box list.
   * @param listParent - Parent node used for positioning the popup list.
   * @param providedOptions - Combo box options, with required tandem instrumentation.
   */
  public constructor( materialProperty: Property<Material>, materials: Material[], listParent: Node, providedOptions: MaterialsComboBoxOptions ) {
    const options = optionize<MaterialsComboBoxOptions, SelfOptions, ComboBoxOptions>()( {
      isDisposable: false,
      accessibleName: PhotoelectricEffectFluent.a11y.materialsComboBox.accessibleNameStringProperty
    }, providedOptions );

    const comboBoxItems: ComboBoxItem<Material>[] = materials.map( material => {
      return {
        value: material,
        createNode: () => new Text(
          getMaterialLabelStringProperty( material.materialType, material.labelKey ),
          {
            font: PhotoelectricEffectConstants.CONTENT_FONT
          }
        )
      };
    } );

    super( materialProperty, comboBoxItems, listParent, options );

    // Interface to hide specific items uses setItemVisible so we must loop again to manually link.
    materials.forEach( material => {
      material.enabledProperty.link( enabled => this.setItemVisible( material, enabled ) );
    } );
  }
}
