// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from photoelectric-effect-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
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
addToMapIfDefined( 'screen_intro', 'screen.introStringProperty' );
addToMapIfDefined( 'screen_experiment', 'screen.experimentStringProperty' );
addToMapIfDefined( 'screen_energy', 'screen.energyStringProperty' );
addToMapIfDefined( 'experiment_graph_voltageCurrentTitle', 'experiment.graph.voltageCurrentTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_intensityCurrentTitle', 'experiment.graph.intensityCurrentTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_frequencyEnergyTitle', 'experiment.graph.frequencyEnergyTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_actionButton', 'experiment.graph.actionButtonStringProperty' );
addToMapIfDefined( 'experiment_graph_voltageAxisLabel', 'experiment.graph.voltageAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_currentAxisLabel', 'experiment.graph.currentAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_intensityAxisLabel', 'experiment.graph.intensityAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_frequencyAxisLabel', 'experiment.graph.frequencyAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_energyAxisLabel', 'experiment.graph.energyAxisLabelStringProperty' );
addToMapIfDefined( 'workFunction_label', 'workFunction.labelStringProperty' );
addToMapIfDefined( 'intensity_label', 'intensity.labelStringProperty' );
addToMapIfDefined( 'wavelength_label', 'wavelength.labelStringProperty' );
addToMapIfDefined( 'voltage_label', 'voltage.labelStringProperty' );
addToMapIfDefined( 'current_label', 'current.labelStringProperty' );
addToMapIfDefined( 'debugLegend_title', 'debugLegend.titleStringProperty' );
addToMapIfDefined( 'debugLegend_photons', 'debugLegend.photonsStringProperty' );
addToMapIfDefined( 'debugLegend_electrons', 'debugLegend.electronsStringProperty' );
addToMapIfDefined( 'debugLegend_target', 'debugLegend.targetStringProperty' );
addToMapIfDefined( 'debugLegend_sink', 'debugLegend.sinkStringProperty' );
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
    _comment_0: new FluentComment( {"comment":"Title","associatedKey":"photoelectric-effect.title"} ),
    titleStringProperty: _.get( PhotoelectricEffectStrings, 'photoelectric-effect.titleStringProperty' )
  },
  _comment_0: new FluentComment( {"comment":"Screens","associatedKey":"screen"} ),
  screen: {
    introStringProperty: _.get( PhotoelectricEffectStrings, 'screen.introStringProperty' ),
    _comment_0: new FluentComment( {"comment":"Experiment graphs","associatedKey":"experiment"} ),
    experimentStringProperty: _.get( PhotoelectricEffectStrings, 'screen.experimentStringProperty' ),
    energyStringProperty: _.get( PhotoelectricEffectStrings, 'screen.energyStringProperty' )
  },
  _comment_1: new FluentComment( {"comment":"Experiment graphs","associatedKey":"experiment"} ),
  experiment: {
    graph: {
      voltageCurrentTitleStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.voltageCurrentTitleStringProperty' ),
      intensityCurrentTitleStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.intensityCurrentTitleStringProperty' ),
      frequencyEnergyTitleStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.frequencyEnergyTitleStringProperty' ),
      actionButtonStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.actionButtonStringProperty' ),
      voltageAxisLabelStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.voltageAxisLabelStringProperty' ),
      currentAxisLabelStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.currentAxisLabelStringProperty' ),
      intensityAxisLabelStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.intensityAxisLabelStringProperty' ),
      frequencyAxisLabelStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.frequencyAxisLabelStringProperty' ),
      energyAxisLabelStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.energyAxisLabelStringProperty' )
    }
  },
  workFunction: {
    _comment_0: new FluentComment( {"comment":"FOR DEBUGGING","associatedKey":"workFunction.label"} ),
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'workFunction.labelStringProperty' )
  },
  intensity: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'intensity.labelStringProperty' )
  },
  wavelength: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'wavelength.labelStringProperty' )
  },
  voltage: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'voltage.labelStringProperty' )
  },
  current: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'current.labelStringProperty' )
  },
  debugLegend: {
    titleStringProperty: _.get( PhotoelectricEffectStrings, 'debugLegend.titleStringProperty' ),
    photonsStringProperty: _.get( PhotoelectricEffectStrings, 'debugLegend.photonsStringProperty' ),
    electronsStringProperty: _.get( PhotoelectricEffectStrings, 'debugLegend.electronsStringProperty' ),
    targetStringProperty: _.get( PhotoelectricEffectStrings, 'debugLegend.targetStringProperty' ),
    sinkStringProperty: _.get( PhotoelectricEffectStrings, 'debugLegend.sinkStringProperty' )
  },
  preferences: {
    _comment_0: new FluentComment( {"comment":"Preferences PLACEHOLDERS","associatedKey":"preferences.mysteryMaterialLabel"} ),
    mysteryMaterialLabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialLabelStringProperty' ),
    mysteryMaterialDescriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialDescriptionStringProperty' ),
    mysteryMaterialWorkFunctionLabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialWorkFunctionLabelStringProperty' ),
    mysteryMaterialWorkFunctionDescriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialWorkFunctionDescriptionStringProperty' )
  }
};

export default PhotoelectricEffectFluent;

photoelectricEffect.register('PhotoelectricEffectFluent', PhotoelectricEffectFluent);
