// Copyright 2026, University of Colorado Boulder

/* eslint-disable */
/* @formatter:off */

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */

import getStringModule from '../../chipper/js/browser/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/browser/LocalizedStringProperty.js';
import photoelectricEffect from './photoelectricEffect.js';

type StringsType = {
  'photoelectric-effect': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'introStringProperty': LocalizedStringProperty;
    'experimentStringProperty': LocalizedStringProperty;
    'energyStringProperty': LocalizedStringProperty;
  };
  'experiment': {
    'graph': {
      'voltageCurrentTitleStringProperty': LocalizedStringProperty;
      'intensityCurrentTitleStringProperty': LocalizedStringProperty;
      'frequencyEnergyTitleStringProperty': LocalizedStringProperty;
      'actionButtonStringProperty': LocalizedStringProperty;
      'voltageAxisLabelStringProperty': LocalizedStringProperty;
      'currentAxisLabelStringProperty': LocalizedStringProperty;
      'intensityAxisLabelStringProperty': LocalizedStringProperty;
      'frequencyAxisLabelStringProperty': LocalizedStringProperty;
      'energyAxisLabelStringProperty': LocalizedStringProperty;
      'infoDialogTitleStringProperty': LocalizedStringProperty;
      'infoDialogPlaceholderStringProperty': LocalizedStringProperty;
    }
  };
  'workFunction': {
    'labelStringProperty': LocalizedStringProperty;
  };
  'intensity': {
    'labelStringProperty': LocalizedStringProperty;
  };
  'wavelength': {
    'labelStringProperty': LocalizedStringProperty;
  };
  'voltage': {
    'labelStringProperty': LocalizedStringProperty;
  };
  'current': {
    'labelStringProperty': LocalizedStringProperty;
  };
  'debugLegend': {
    'titleStringProperty': LocalizedStringProperty;
    'photonsStringProperty': LocalizedStringProperty;
    'electronsStringProperty': LocalizedStringProperty;
    'targetStringProperty': LocalizedStringProperty;
    'sinkStringProperty': LocalizedStringProperty;
  };
  'preferences': {
    'mysteryMaterialLabelStringProperty': LocalizedStringProperty;
    'mysteryMaterialDescriptionStringProperty': LocalizedStringProperty;
    'mysteryMaterialWorkFunctionLabelStringProperty': LocalizedStringProperty;
    'mysteryMaterialWorkFunctionDescriptionStringProperty': LocalizedStringProperty;
  }
};

const PhotoelectricEffectStrings = getStringModule( 'PHOTOELECTRIC_EFFECT' ) as StringsType;

photoelectricEffect.register( 'PhotoelectricEffectStrings', PhotoelectricEffectStrings );

export default PhotoelectricEffectStrings;
