// Copyright 2026, University of Colorado Boulder

/**
 * Resolves the localized display label for a material.
 * Prefers label-key overrides (for instance-specific mystery labels) and falls back to MaterialType defaults.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { MaterialType } from '../model/Material.js';

// Default labels keyed by MaterialType.
const MATERIAL_TYPE_LABELS = new Map<MaterialType, TReadOnlyProperty<string>>( [
  [ MaterialType.SODIUM, PhotoelectricEffectFluent.materials.sodiumStringProperty ],
  [ MaterialType.COPPER, PhotoelectricEffectFluent.materials.copperStringProperty ],
  [ MaterialType.CALCIUM, PhotoelectricEffectFluent.materials.calciumStringProperty ],
  [ MaterialType.PLATINUM, PhotoelectricEffectFluent.materials.platinumStringProperty ],
  [ MaterialType.ZINC, PhotoelectricEffectFluent.materials.zincStringProperty ],
  [ MaterialType.CUSTOM, PhotoelectricEffectFluent.materials.customStringProperty ],
  [ MaterialType.MYSTERY, PhotoelectricEffectFluent.materials.mysteryStringProperty ]
] );

// Instance-level overrides keyed by Material.labelKey.
const MATERIAL_LABEL_KEY_OVERRIDES: Record<string, TReadOnlyProperty<string>> = {
  mystery1: PhotoelectricEffectFluent.materials.mystery1StringProperty,
  mystery2: PhotoelectricEffectFluent.materials.mystery2StringProperty,
  mystery3: PhotoelectricEffectFluent.materials.mystery3StringProperty,
  mystery4: PhotoelectricEffectFluent.materials.mystery4StringProperty,
  mystery5: PhotoelectricEffectFluent.materials.mystery5StringProperty
};

/**
 * Gets the display label for a material, preferring label-key overrides and then falling back
 * to the material type.
 */
const getMaterialLabelStringProperty = ( materialType: MaterialType, materialLabelKey: string | null ): TReadOnlyProperty<string> => {
  const labelStringProperty = materialLabelKey !== null ?
                              MATERIAL_LABEL_KEY_OVERRIDES[ materialLabelKey ] :
                              MATERIAL_TYPE_LABELS.get( materialType );

  affirm( labelStringProperty, `No label for material type: ${materialType}, label key: ${materialLabelKey}` );
  return labelStringProperty;
};

export default getMaterialLabelStringProperty;