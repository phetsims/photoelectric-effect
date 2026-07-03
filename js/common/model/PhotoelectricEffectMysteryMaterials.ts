// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectMysteryMaterials defines all global mystery material instances for the sim.
 *
 * PREFERENCES_MYSTERY_MATERIAL_1 is always enabled and its work function cannot change from Preferences,
 * but it can change from PhET-iO. It is still global and when the work function is changed, it applies to
 * all screens.
 *
 * PREFERENCES_MYSTERY_MATERIAL_2 is user-configurable via the Preferences dialog. Its enabled state, work function,
 * and band depth are initialized by query parameters and persist across sessions as preferences.
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
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotoelectricEffectQueryParameters from '../PhotoelectricEffectQueryParameters.js';
import Material, { MaterialType } from './Material.js';

const PREFERENCES_MYSTERY_MATERIAL_1 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterial1' ),
  labelStringProperty: PhotoelectricEffectFluent.materials.mystery1StringProperty,
  enabled: true
} );
const PREFERENCES_MYSTERY_MATERIAL_2 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterial2' ),
  labelStringProperty: PhotoelectricEffectFluent.materials.mystery2StringProperty,
  workFunctionInitialValue: PhotoelectricEffectQueryParameters.mysteryMaterial2WorkFunction,
  bandDepthInitialValue: PhotoelectricEffectQueryParameters.mysteryMaterial2BandDepth,
  enabled: PhotoelectricEffectQueryParameters.mysteryMaterial2Enabled
} );
const PHET_IO_MYSTERY_MATERIAL_1 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial1' ),
  labelStringProperty: PhotoelectricEffectFluent.materials.mystery3StringProperty,
  enabled: false
} );
const PHET_IO_MYSTERY_MATERIAL_2 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial2' ),
  labelStringProperty: PhotoelectricEffectFluent.materials.mystery4StringProperty,
  enabled: false
} );
const PHET_IO_MYSTERY_MATERIAL_3 = new Material( MaterialType.MYSTERY, {
  tandem: Tandem.GLOBAL_MODEL.createTandem( 'mysteryMaterial3' ),
  labelStringProperty: PhotoelectricEffectFluent.materials.mystery5StringProperty,
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
