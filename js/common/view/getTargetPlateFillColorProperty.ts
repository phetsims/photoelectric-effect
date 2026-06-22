// Copyright 2026, University of Colorado Boulder

/**
 * Resolves the target-plate material-strip color for a material.
 * Prefers instance-level label-key overrides and falls back to MaterialType defaults.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import type Color from '../../../../scenery/js/util/Color.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import type Material from '../model/Material.js';
import { MaterialType } from '../model/Material.js';

// Default target-plate colors keyed by MaterialType.
const MATERIAL_TYPE_COLORS = new Map<MaterialType, TReadOnlyProperty<Color>>( [
  [ MaterialType.SODIUM, PhotoelectricEffectColors.targetPlateSodiumFillColorProperty ],
  [ MaterialType.COPPER, PhotoelectricEffectColors.targetPlateCopperFillColorProperty ],
  [ MaterialType.CALCIUM, PhotoelectricEffectColors.targetPlateCalciumFillColorProperty ],
  [ MaterialType.PLATINUM, PhotoelectricEffectColors.targetPlatePlatinumFillColorProperty ],
  [ MaterialType.ZINC, PhotoelectricEffectColors.targetPlateZincFillColorProperty ],
  [ MaterialType.CUSTOM, PhotoelectricEffectColors.targetPlateFillColorProperty ],
  [ MaterialType.MYSTERY, PhotoelectricEffectColors.targetPlateFillColorProperty ]
] );

// Instance-level color overrides keyed by Material.labelKey.
const MATERIAL_LABEL_KEY_OVERRIDES: Record<string, TReadOnlyProperty<Color>> = {
  mystery1: PhotoelectricEffectColors.targetPlateMagnesiumFillColorProperty
};

/**
 * Gets the target-plate color for a material, preferring label-key overrides and then falling back
 * to the material type.
 */
const getTargetPlateFillColorProperty = ( material: Material ): TReadOnlyProperty<Color> => {
  const labelKeyColorProperty = material.labelKey !== null ? MATERIAL_LABEL_KEY_OVERRIDES[ material.labelKey ] : null;
  const colorProperty = labelKeyColorProperty || MATERIAL_TYPE_COLORS.get( material.materialType );

  affirm( colorProperty, `No target plate color for material type: ${material.materialType}, label key: ${material.labelKey}` );
  return colorProperty;
};

export default getTargetPlateFillColorProperty;
