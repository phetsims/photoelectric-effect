// Copyright 2026, University of Colorado Boulder

/**
 * MaterialsComboBox is the combo box used to choose the active target material in the photoelectric effect screen.
 * It encapsulates item construction so the screen view can compose higher-level controls without owning combo box
 * details. Labels are currently hardcoded here and will move to translatable strings in a future cleanup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Property from '../../../../axon/js/Property.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node, { NodeBoundsBasedTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ComboBox, { ComboBoxItem, ComboBoxOptions } from '../../../../sun/js/ComboBox.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import Material, { MaterialType } from '../model/Material.js';

type SelfOptions = EmptySelfOptions;

type MaterialsComboBoxOptions = SelfOptions & PickRequired<ComboBoxOptions, 'tandem'> & NodeBoundsBasedTranslationOptions;

// Default labels for materials when no instance-level labelKey override is provided.
// Add one entry per MaterialType that can appear in the combo box. When a Material has
// labelKey === null, lookup will use this map and throw if the type is missing.
const MATERIAL_TYPE_LABELS = new Map<MaterialType, TReadOnlyProperty<string>>( [
  [ MaterialType.SODIUM, PhotoelectricEffectFluent.materials.sodiumStringProperty ],
  [ MaterialType.COPPER, PhotoelectricEffectFluent.materials.copperStringProperty ],
  [ MaterialType.CALCIUM, PhotoelectricEffectFluent.materials.calciumStringProperty ],
  [ MaterialType.MAGNESIUM, PhotoelectricEffectFluent.materials.magnesiumStringProperty ],
  [ MaterialType.PLATINUM, PhotoelectricEffectFluent.materials.platinumStringProperty ],
  [ MaterialType.ZINC, PhotoelectricEffectFluent.materials.zincStringProperty ],
  [ MaterialType.CUSTOM, PhotoelectricEffectFluent.materials.customStringProperty ],
  [ MaterialType.MYSTERY, PhotoelectricEffectFluent.materials.mysteryStringProperty ]
] );

// Instance-level label overrides keyed by Material.labelKey.
// Use this for cases where multiple Material instances share a MaterialType but need distinct labels
// (for example, mystery1 => "Mystery 1"). If a Material provides a non-null
// labelKey, it must exist here or label resolution will throw.
const MATERIAL_TYPE_LABEL_OVERRIDES: Record<string, TReadOnlyProperty<string>> = {
  mystery1: PhotoelectricEffectFluent.materials.mystery1StringProperty,
  mystery2: PhotoelectricEffectFluent.materials.mystery2StringProperty,
  mystery3: PhotoelectricEffectFluent.materials.mystery3StringProperty,
  mystery4: PhotoelectricEffectFluent.materials.mystery4StringProperty,
  mystery5: PhotoelectricEffectFluent.materials.mystery5StringProperty
};

export default class MaterialsComboBox extends ComboBox<Material> {

  /**
   * @param materialProperty - Property that stores the currently selected material.
   * @param materials - Available material options shown in the combo box list.
   * @param listParent - Parent node used for positioning the popup list.
   * @param providedOptions - Combo box options, with required tandem instrumentation.
   */
  public constructor( materialProperty: Property<Material>, materials: Material[], listParent: Node, providedOptions: MaterialsComboBoxOptions ) {
    const options = optionize<MaterialsComboBoxOptions, SelfOptions, ComboBoxOptions>()( {
      isDisposable: false
    }, providedOptions );

    const comboBoxItems: ComboBoxItem<Material>[] = materials.map( material => {
      return {
        value: material,
        createNode: () => new Text(
          MaterialsComboBox.getMaterialLabelStringProperty( material ),
          {

            // TODO: This should use font entries from constants when available.
            font: new PhetFont( 16 )
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


  /**
   * Gets the display label for a material, preferring label-key overrides and then falling back to material type.
   */
  private static getMaterialLabelStringProperty( material: Material ): TReadOnlyProperty<string> {
    const labelStringProperty = material.labelKey !== null ?
                                MATERIAL_TYPE_LABEL_OVERRIDES[ material.labelKey ] :
                                MATERIAL_TYPE_LABELS.get( material.materialType );

    affirm( labelStringProperty, `No label for material type: ${material.materialType}` );
    return labelStringProperty;
  }
}
