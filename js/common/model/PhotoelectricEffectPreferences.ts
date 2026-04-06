// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, affect all screens, and are not affected by Reset All.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Range from '../../../../dot/js/Range.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectQueryParameters from '../PhotoelectricEffectQueryParameters.js';
import PhotoelectricEffectMysteryMaterials from './PhotoelectricEffectMysteryMaterials.js';

// Range of valid work function values, in eV.
const MYSTERY_MATERIAL_WORK_FUNCTION_RANGE = new Range( 1.5, 7.0 );

const PhotoelectricEffectPreferences = {

  // Whether the mystery material is available in the materials list.
  mysteryMaterialEnabledProperty: new BooleanProperty( PhotoelectricEffectQueryParameters.mysteryMaterial, {
    tandem: Tandem.PREFERENCES.createTandem( 'mysteryMaterialEnabledProperty' ),
    phetioFeatured: true
  } ),

  // The work function of the preferences mystery material, in eV.
  // This is the workFunctionProperty of PREFERENCES_MYSTERY_MATERIAL, shared so that the
  // Preferences UI and the model operate on the same Property instance.
  mysteryMaterialWorkFunctionProperty: PhotoelectricEffectMysteryMaterials.PREFERENCES_MYSTERY_MATERIAL.workFunctionProperty
};

export { MYSTERY_MATERIAL_WORK_FUNCTION_RANGE };
export default PhotoelectricEffectPreferences;
