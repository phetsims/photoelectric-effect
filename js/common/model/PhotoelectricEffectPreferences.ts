// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, affect all screens, and are not affected by Reset All. The properties here are
 * shared with the model so that Preferences UI updates propagate to all screens.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectQueryParameters from '../PhotoelectricEffectQueryParameters.js';
import PhotoelectricEffectMysteryMaterials from './PhotoelectricEffectMysteryMaterials.js';

// Range of valid work function values, in eV.
// TODO: Should this be assigned to the work function NumberProperty?
const MYSTERY_MATERIAL_WORK_FUNCTION_RANGE = new Range( 1.5, 7.0 );

export default class PhotoelectricEffectPreferences {
  private constructor() {
    // Do not instantiate.
  }

  // Whether the mystery material is available in the materials list.
  // TODO: Wondering if we should keep this. Should materials have an enabled Property? Then we could get
  //   rid of this file, and that enabledProperty would also work for the phet-io materials.
  //   https://github.com/phetsims/photoelectric-effect/issues/38
  //   How will phet-io clients ideally customize these?
  public static readonly mysteryMaterial1EnabledProperty = new BooleanProperty( PhotoelectricEffectQueryParameters.mysteryMaterial1Enabled, {
    tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterial1EnabledProperty' ),
    phetioFeatured: true
  } );

  public static readonly mysteryMaterial2EnabledProperty = new BooleanProperty( PhotoelectricEffectQueryParameters.mysteryMaterial2Enabled, {
    tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterial2EnabledProperty' ),
    phetioFeatured: true
  } );

  // The work function of the preferences mystery materials, in eV.
  // This is the workFunctionProperty of PREFERENCES_MYSTERY_MATERIAL, shared so that the
  // Preferences UI and the model operate on the same Property instance.
  public static readonly mysteryMaterial1WorkFunctionProperty =
    PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_1.workFunctionProperty;
  public static readonly mysteryMaterial2WorkFunctionProperty =
    PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL_2.workFunctionProperty;
}

export { MYSTERY_MATERIAL_WORK_FUNCTION_RANGE };
