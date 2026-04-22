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
addToMapIfDefined( 'materials_sodium', 'materials.sodiumStringProperty' );
addToMapIfDefined( 'materials_copper', 'materials.copperStringProperty' );
addToMapIfDefined( 'materials_calcium', 'materials.calciumStringProperty' );
addToMapIfDefined( 'materials_magnesium', 'materials.magnesiumStringProperty' );
addToMapIfDefined( 'materials_platinum', 'materials.platinumStringProperty' );
addToMapIfDefined( 'materials_zinc', 'materials.zincStringProperty' );
addToMapIfDefined( 'materials_custom', 'materials.customStringProperty' );
addToMapIfDefined( 'materials_mystery', 'materials.mysteryStringProperty' );
addToMapIfDefined( 'materials_mystery1', 'materials.mystery1StringProperty' );
addToMapIfDefined( 'materials_mystery2', 'materials.mystery2StringProperty' );
addToMapIfDefined( 'materials_mystery3', 'materials.mystery3StringProperty' );
addToMapIfDefined( 'materials_mystery4', 'materials.mystery4StringProperty' );
addToMapIfDefined( 'materials_mystery5', 'materials.mystery5StringProperty' );
addToMapIfDefined( 'experiment_graph_voltageCurrentTitle', 'experiment.graph.voltageCurrentTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_intensityCurrentTitle', 'experiment.graph.intensityCurrentTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_frequencyEnergyTitle', 'experiment.graph.frequencyEnergyTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_actionButton', 'experiment.graph.actionButtonStringProperty' );
addToMapIfDefined( 'experiment_graph_voltageAxisLabel', 'experiment.graph.voltageAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_currentAxisLabel', 'experiment.graph.currentAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_intensityAxisLabel', 'experiment.graph.intensityAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_frequencyAxisLabel', 'experiment.graph.frequencyAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_energyAxisLabel', 'experiment.graph.energyAxisLabelStringProperty' );
addToMapIfDefined( 'experiment_graph_infoDialogTitle', 'experiment.graph.infoDialogTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_infoDialogPlaceholder', 'experiment.graph.infoDialogPlaceholderStringProperty' );
addToMapIfDefined( 'experiment_graph_snapshotsDialogTitle', 'experiment.graph.snapshotsDialogTitleStringProperty' );
addToMapIfDefined( 'experiment_graph_snapshotSaved', 'experiment.graph.snapshotSavedStringProperty' );
addToMapIfDefined( 'experiment_graph_snapshotsGalleryButtonAccessibleName', 'experiment.graph.snapshotsGalleryButtonAccessibleNameStringProperty' );
addToMapIfDefined( 'experiment_graph_snapshotsGalleryButtonAccessibleHelpText', 'experiment.graph.snapshotsGalleryButtonAccessibleHelpTextStringProperty' );
addToMapIfDefined( 'workFunction_label', 'workFunction.labelStringProperty' );
addToMapIfDefined( 'intensity_label', 'intensity.labelStringProperty' );
addToMapIfDefined( 'wavelength_label', 'wavelength.labelStringProperty' );
addToMapIfDefined( 'spectrumTrack_uvLabel', 'spectrumTrack.uvLabelStringProperty' );
addToMapIfDefined( 'spectrumTrack_irLabel', 'spectrumTrack.irLabelStringProperty' );
addToMapIfDefined( 'voltage_label', 'voltage.labelStringProperty' );
addToMapIfDefined( 'current_label', 'current.labelStringProperty' );
addToMapIfDefined( 'debugLegend_title', 'debugLegend.titleStringProperty' );
addToMapIfDefined( 'debugLegend_photons', 'debugLegend.photonsStringProperty' );
addToMapIfDefined( 'debugLegend_electrons', 'debugLegend.electronsStringProperty' );
addToMapIfDefined( 'debugLegend_target', 'debugLegend.targetStringProperty' );
addToMapIfDefined( 'debugLegend_collector', 'debugLegend.collectorStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterial1Label', 'preferences.mysteryMaterial1LabelStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterial2Label', 'preferences.mysteryMaterial2LabelStringProperty' );
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
  materials: {
    sodiumStringProperty: _.get( PhotoelectricEffectStrings, 'materials.sodiumStringProperty' ),
    copperStringProperty: _.get( PhotoelectricEffectStrings, 'materials.copperStringProperty' ),
    calciumStringProperty: _.get( PhotoelectricEffectStrings, 'materials.calciumStringProperty' ),
    magnesiumStringProperty: _.get( PhotoelectricEffectStrings, 'materials.magnesiumStringProperty' ),
    platinumStringProperty: _.get( PhotoelectricEffectStrings, 'materials.platinumStringProperty' ),
    zincStringProperty: _.get( PhotoelectricEffectStrings, 'materials.zincStringProperty' ),
    customStringProperty: _.get( PhotoelectricEffectStrings, 'materials.customStringProperty' ),
    mysteryStringProperty: _.get( PhotoelectricEffectStrings, 'materials.mysteryStringProperty' ),
    mystery1StringProperty: _.get( PhotoelectricEffectStrings, 'materials.mystery1StringProperty' ),
    mystery2StringProperty: _.get( PhotoelectricEffectStrings, 'materials.mystery2StringProperty' ),
    mystery3StringProperty: _.get( PhotoelectricEffectStrings, 'materials.mystery3StringProperty' ),
    mystery4StringProperty: _.get( PhotoelectricEffectStrings, 'materials.mystery4StringProperty' ),
    mystery5StringProperty: _.get( PhotoelectricEffectStrings, 'materials.mystery5StringProperty' )
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
      energyAxisLabelStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.energyAxisLabelStringProperty' ),
      _comment_0: new FluentComment( {"comment":"Just placeholders","associatedKey":"infoDialogTitle"} ),
      infoDialogTitleStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.infoDialogTitleStringProperty' ),
      infoDialogPlaceholderStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.infoDialogPlaceholderStringProperty' ),
      snapshotsDialogTitleStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.snapshotsDialogTitleStringProperty' ),
      snapshotSavedStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.snapshotSavedStringProperty' ),
      snapshotsGalleryButtonAccessibleNameStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.snapshotsGalleryButtonAccessibleNameStringProperty' ),
      snapshotsGalleryButtonAccessibleHelpTextStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.snapshotsGalleryButtonAccessibleHelpTextStringProperty' )
    }
  },
  workFunction: {
    _comment_0: new FluentComment( {"comment":"FOR DEBUGGING","associatedKey":"workFunction.label"} ),
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'workFunction.labelStringProperty' )
  },
  intensity: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'intensity.labelStringProperty' ),
    percentReadoutPatternStringProperty: _.get( PhotoelectricEffectStrings, 'intensity.percentReadoutPatternStringProperty' )
  },
  wavelength: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'wavelength.labelStringProperty' ),
    valueReadoutPatternStringProperty: _.get( PhotoelectricEffectStrings, 'wavelength.valueReadoutPatternStringProperty' )
  },
  spectrumTrack: {
    uvLabelStringProperty: _.get( PhotoelectricEffectStrings, 'spectrumTrack.uvLabelStringProperty' ),
    irLabelStringProperty: _.get( PhotoelectricEffectStrings, 'spectrumTrack.irLabelStringProperty' )
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
    collectorStringProperty: _.get( PhotoelectricEffectStrings, 'debugLegend.collectorStringProperty' )
  },
  preferences: {
    _comment_0: new FluentComment( {"comment":"Preferences PLACEHOLDERS","associatedKey":"preferences.mysteryMaterial1Label"} ),
    mysteryMaterial1LabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterial1LabelStringProperty' ),
    mysteryMaterial2LabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterial2LabelStringProperty' ),
    mysteryMaterialDescriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialDescriptionStringProperty' ),
    mysteryMaterialWorkFunctionLabelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialWorkFunctionLabelStringProperty' ),
    mysteryMaterialWorkFunctionDescriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterialWorkFunctionDescriptionStringProperty' )
  }
};

export default PhotoelectricEffectFluent;

photoelectricEffect.register('PhotoelectricEffectFluent', PhotoelectricEffectFluent);
