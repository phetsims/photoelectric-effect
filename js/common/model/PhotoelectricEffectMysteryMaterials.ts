// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectMysteryMaterials defines all global mystery material instances for the sim.
 *
 * TODO: @design, are you OK with all of these materials being globals (state shared across all screens,
 *   not reset from ResetAllButton, will have different location in the phetio tree, and so on...)
 *
 * TODO: Now that mystery material 1 acts more like a "typical" material (always enabled, static work function),
 *   should it still live in this file? Is this file for "globals" or "mystery" materials?
 * TODO: @design - to answer the above, how would you like phet-io customization to work? Should a single Property
 *   drive the work function for mystery material on all screens? If so, it should stay here.
 * PREFERENCES_MYSTERY_MATERIAL_1 is always enabled and its work function cannot change from Preferences,
 * but it can change from PhET-iO.
 *
 * PREFERENCES_MYSTERY_MATERIAL_2 is enabled and user-configurable via the Preferences dialog. Its work function
 * is exposed through PhotoelectricEffectPreferences and persists across sessions.
 *
 * PHET_IO_MYSTERY_MATERIAL_1 through _3 are reserved for PhET-iO clients (e.g. Studio)
 * who need additional controllable mystery materials. Their work functions are set exclusively
 * through the PhET-iO API and are not configurable in the sim UI. They are hidden unless explicitly
 * enabled with PhET-iO.
 *
 * All mystery materials are passed down to the sim's screens via photoelectric-effect-main.ts.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import Material, { MaterialType } from './Material.js';

// The mystery materials whose work functions are user-configurable via the Preferences dialog.
const PREFERENCES_MYSTERY_MATERIAL_1 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterial1' ),
  labelKey: 'mystery1',
  enabled: true
} );
const PREFERENCES_MYSTERY_MATERIAL_2 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterial2' ),
  labelKey: 'mystery2',
  enabled: false
} );

// Mystery materials reserved for PhET-iO client control. Work functions are not exposed in the sim UI.
const PHET_IO_MYSTERY_MATERIAL_1 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial1' ),
  labelKey: 'mystery3',
  enabled: false
} );
const PHET_IO_MYSTERY_MATERIAL_2 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial2' ),
  labelKey: 'mystery4',
  enabled: false
} );
const PHET_IO_MYSTERY_MATERIAL_3 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial3' ),
  labelKey: 'mystery5',
  enabled: false
} );

const PhotoelectricEffectMysteryMaterials = {
  PREFERENCES_MYSTERY_MATERIAL_1: PREFERENCES_MYSTERY_MATERIAL_1,
  PREFERENCES_MYSTERY_MATERIAL_2: PREFERENCES_MYSTERY_MATERIAL_2,
  MYSTERY_MATERIAL_1: PHET_IO_MYSTERY_MATERIAL_1,
  MYSTERY_MATERIAL_2: PHET_IO_MYSTERY_MATERIAL_2,
  MYSTERY_MATERIAL_3: PHET_IO_MYSTERY_MATERIAL_3,

  // All mystery materials in display order. Pass this array to each screen so they all share
  // the same global instances.
  ALL_MYSTERY_MATERIALS: [
    PREFERENCES_MYSTERY_MATERIAL_1,
    PREFERENCES_MYSTERY_MATERIAL_2,
    PHET_IO_MYSTERY_MATERIAL_1,
    PHET_IO_MYSTERY_MATERIAL_2,
    PHET_IO_MYSTERY_MATERIAL_3
  ]
};

export default PhotoelectricEffectMysteryMaterials;
