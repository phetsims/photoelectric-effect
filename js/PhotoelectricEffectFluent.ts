// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from photoelectric-effect-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentContainer from '../../chipper/js/browser/FluentContainer.js';
import photoelectricEffect from './photoelectricEffect.js';
import PhotoelectricEffectStrings from './PhotoelectricEffectStrings.js';

// This map is used to create the fluent file and link to all StringProperties.
// Accessing StringProperties is also critical for including them in the built sim.
// However, if strings are unused in Fluent system too, they will be fully excluded from
// the build. So we need to only add actually used strings.
const fluentKeyToStringPropertyMap = new Map();

const addToMapIfDefined = ( key: string, path: string ) => {
  const sp = _.get( PhotoelectricEffectStrings, path );
  if ( sp ) {
    fluentKeyToStringPropertyMap.set( key, sp );
  }
};

addToMapIfDefined( 'photoelectric_effect_title', 'photoelectric-effect.titleStringProperty' );
addToMapIfDefined( 'screen_name', 'screen.nameStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterialLabel', 'preferences.mysteryMaterialLabelStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterialDescription', 'preferences.mysteryMaterialDescriptionStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterialWorkFunctionLabel', 'preferences.mysteryMaterialWorkFunctionLabelStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterialWorkFunctionDescription', 'preferences.mysteryMaterialWorkFunctionDescriptionStringProperty' );

// A function that creates contents for a new Fluent file, which will be needed if any string changes.
const createFluentFile = (): string => {
  let ftl = '';
  for (const [key, stringProperty] of fluentKeyToStringPropertyMap.entries()) {
    ftl += `${key} = ${FluentLibrary.formatMultilineForFtl( stringProperty.value )}\n`;
  }
  return ftl;
};

const fluentSupport = new FluentContainer( createFluentFile, Array.from(fluentKeyToStringPropertyMap.values()) );

const PhotoelectricEffectFluent = {
  "photoelectric-effect": {
    titleStringProperty: _.get( PhotoelectricEffectStrings, 'photoelectric-effect.titleStringProperty' )
  },
  screen: {
    nameStringProperty: _.get( PhotoelectricEffectStrings, 'screen.nameStringProperty' )
  },
  preferences: {
    mysteryMaterialLabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialLabelStringProperty' ),
    mysteryMaterialDescriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialDescriptionStringProperty' ),
    mysteryMaterialWorkFunctionLabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialWorkFunctionLabelStringProperty' ),
    mysteryMaterialWorkFunctionDescriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialWorkFunctionDescriptionStringProperty' )
  }
};

export default PhotoelectricEffectFluent;

photoelectricEffect.register('PhotoelectricEffectFluent', PhotoelectricEffectFluent);
