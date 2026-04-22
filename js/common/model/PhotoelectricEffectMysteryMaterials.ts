// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectMysteryMaterials defines all global mystery material instances for the sim.
 *
 * PREFERENCES_MYSTERY_MATERIAL is user-configurable via the Preferences dialog. Its work function
 * is exposed through PhotoelectricEffectPreferences and persists across sessions.
 *
 * MYSTERY_MATERIAL_1 through _4 are reserved for PhET-iO clients (e.g. Studio operators)
 * who need additional controllable mystery materials. Their work functions are set exclusively
 * through the PhET-iO API and are not configurable in the sim UI.
 *
 * All mystery materials are passed down to the sim's screens via photoelectric-effect-main.ts.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Material, { MaterialType } from './Material.js';

// The mystery material whose work function is user-configurable via the Preferences dialog.
const PREFERENCES_MYSTERY_MATERIAL = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.PREFERENCES,
  labelKey: 'mystery1'
} );

// Mystery materials reserved for PhET-iO client control. Work functions are not exposed in the sim UI.
const MYSTERY_MATERIAL_1 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial1' ),
  labelKey: 'mystery2'
} );
const MYSTERY_MATERIAL_2 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial2' ),
  labelKey: 'mystery3'
} );
const MYSTERY_MATERIAL_3 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial3' ),
  labelKey: 'mystery4'
} );
const MYSTERY_MATERIAL_4 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial4' ),
  labelKey: 'mystery5'
} );

const PhotoelectricEffectMysteryMaterials = {
  PREFERENCES_MYSTERY_MATERIAL: PREFERENCES_MYSTERY_MATERIAL,
  MYSTERY_MATERIAL_1: MYSTERY_MATERIAL_1,
  MYSTERY_MATERIAL_2: MYSTERY_MATERIAL_2,
  MYSTERY_MATERIAL_3: MYSTERY_MATERIAL_3,
  MYSTERY_MATERIAL_4: MYSTERY_MATERIAL_4,

  // All mystery materials in display order. Pass this array to each screen so they all share
  // the same global instances.
  ALL_MYSTERY_MATERIALS: [
    PREFERENCES_MYSTERY_MATERIAL,
    MYSTERY_MATERIAL_1,
    MYSTERY_MATERIAL_2,
    MYSTERY_MATERIAL_3,
    MYSTERY_MATERIAL_4
  ]
};

export default PhotoelectricEffectMysteryMaterials;
