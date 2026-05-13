// Copyright 2026, University of Colorado Boulder
// AUTOMATICALLY GENERATED – DO NOT EDIT.
// Generated from photoelectric-effect-strings_en.yaml

/* eslint-disable */
/* @formatter:off */

import FluentLibrary from '../../chipper/js/browser-and-node/FluentLibrary.js';
import FluentComment from '../../chipper/js/browser/FluentComment.js';
import FluentConstant from '../../chipper/js/browser/FluentConstant.js';
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
addToMapIfDefined( 'photonQuantity_single', 'photonQuantity.singleStringProperty' );
addToMapIfDefined( 'photonQuantity_burst', 'photonQuantity.burstStringProperty' );
addToMapIfDefined( 'photonQuantity_fire', 'photonQuantity.fireStringProperty' );
addToMapIfDefined( 'showElectrons', 'showElectronsStringProperty' );
addToMapIfDefined( 'highestEnergyOnly', 'highestEnergyOnlyStringProperty' );
addToMapIfDefined( 'spectrumTrack_uvLabel', 'spectrumTrack.uvLabelStringProperty' );
addToMapIfDefined( 'spectrumTrack_irLabel', 'spectrumTrack.irLabelStringProperty' );
addToMapIfDefined( 'workFunction_label', 'workFunction.labelStringProperty' );
addToMapIfDefined( 'intensity_label', 'intensity.labelStringProperty' );
addToMapIfDefined( 'photonRate_label', 'photonRate.labelStringProperty' );
addToMapIfDefined( 'wavelength_label', 'wavelength.labelStringProperty' );
addToMapIfDefined( 'voltage_label', 'voltage.labelStringProperty' );
addToMapIfDefined( 'current_label', 'current.labelStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterial_label', 'preferences.mysteryMaterial.labelStringProperty' );
addToMapIfDefined( 'preferences_mysteryMaterial_description', 'preferences.mysteryMaterial.descriptionStringProperty' );
addToMapIfDefined( 'a11y_introScreen_screenSummary_playArea', 'a11y.introScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_introScreen_screenSummary_controlArea', 'a11y.introScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_introScreen_screenSummary_currentDetails_leadingParagraph', 'a11y.introScreen.screenSummary.currentDetails.leadingParagraphStringProperty' );
addToMapIfDefined( 'a11y_introScreen_screenSummary_interactionHint', 'a11y.introScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_experimentScreen_screenSummary_playArea', 'a11y.experimentScreen.screenSummary.playAreaStringProperty' );
addToMapIfDefined( 'a11y_experimentScreen_screenSummary_controlArea', 'a11y.experimentScreen.screenSummary.controlAreaStringProperty' );
addToMapIfDefined( 'a11y_experimentScreen_screenSummary_currentDetails_leadingParagraph', 'a11y.experimentScreen.screenSummary.currentDetails.leadingParagraphStringProperty' );
addToMapIfDefined( 'a11y_experimentScreen_screenSummary_interactionHint', 'a11y.experimentScreen.screenSummary.interactionHintStringProperty' );
addToMapIfDefined( 'a11y_photonSourcePanel_accessibleHeading', 'a11y.photonSourcePanel.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_photonSourcePanel_intensitySlider_accessibleName', 'a11y.photonSourcePanel.intensitySlider.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_photonSourcePanel_wavelengthNumberControl_accessibleName', 'a11y.photonSourcePanel.wavelengthNumberControl.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_ammeterDisplayPanel_accessibleName', 'a11y.ammeterDisplayPanel.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_materialsComboBox_accessibleName', 'a11y.materialsComboBox.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_representationRadioButtonGroup_accessibleName', 'a11y.representationRadioButtonGroup.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_representationRadioButtonGroup_groundedRadioButton_accessibleName', 'a11y.representationRadioButtonGroup.groundedRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_representationRadioButtonGroup_circuitRadioButton_accessibleName', 'a11y.representationRadioButtonGroup.circuitRadioButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_voltageNumberControl_accessibleName', 'a11y.voltageNumberControl.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_accessibleHeading', 'a11y.intensityCurrentGraphNode.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_expandCollapseButton_accessibleName', 'a11y.intensityCurrentGraphNode.expandCollapseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_infoButton_accessibleName', 'a11y.intensityCurrentGraphNode.infoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_cameraButton_accessibleName', 'a11y.intensityCurrentGraphNode.cameraButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_trashButton_accessibleName', 'a11y.intensityCurrentGraphNode.trashButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_snapshotsGalleryButton_accessibleName', 'a11y.intensityCurrentGraphNode.snapshotsGalleryButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_intensityCurrentGraphNode_snapshotsGalleryButton_accessibleHelpText', 'a11y.intensityCurrentGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_accessibleHeading', 'a11y.frequencyEnergyGraphNode.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_expandCollapseButton_accessibleName', 'a11y.frequencyEnergyGraphNode.expandCollapseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_infoButton_accessibleName', 'a11y.frequencyEnergyGraphNode.infoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_cameraButton_accessibleName', 'a11y.frequencyEnergyGraphNode.cameraButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_trashButton_accessibleName', 'a11y.frequencyEnergyGraphNode.trashButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_snapshotsGalleryButton_accessibleName', 'a11y.frequencyEnergyGraphNode.snapshotsGalleryButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_frequencyEnergyGraphNode_snapshotsGalleryButton_accessibleHelpText', 'a11y.frequencyEnergyGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_accessibleHeading', 'a11y.voltageCurrentGraphNode.accessibleHeadingStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_expandCollapseButton_accessibleName', 'a11y.voltageCurrentGraphNode.expandCollapseButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_infoButton_accessibleName', 'a11y.voltageCurrentGraphNode.infoButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_cameraButton_accessibleName', 'a11y.voltageCurrentGraphNode.cameraButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_trashButton_accessibleName', 'a11y.voltageCurrentGraphNode.trashButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_snapshotsGalleryButton_accessibleName', 'a11y.voltageCurrentGraphNode.snapshotsGalleryButton.accessibleNameStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_snapshotsGalleryButton_accessibleHelpText', 'a11y.voltageCurrentGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_workFunction_label', 'a11y.voltageCurrentGraphNode.workFunction.labelStringProperty' );
addToMapIfDefined( 'a11y_voltageCurrentGraphNode_workFunction_description', 'a11y.voltageCurrentGraphNode.workFunction.descriptionStringProperty' );
addToMapIfDefined( 'a11y_photonMode_label', 'a11y.photonMode.labelStringProperty' );
addToMapIfDefined( 'a11y_photonMode_description', 'a11y.photonMode.descriptionStringProperty' );

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
      snapshotSavedStringProperty: _.get( PhotoelectricEffectStrings, 'experiment.graph.snapshotSavedStringProperty' )
    }
  },
  photonQuantity: {
    singleStringProperty: _.get( PhotoelectricEffectStrings, 'photonQuantity.singleStringProperty' ),
    burstStringProperty: _.get( PhotoelectricEffectStrings, 'photonQuantity.burstStringProperty' ),
    fireStringProperty: _.get( PhotoelectricEffectStrings, 'photonQuantity.fireStringProperty' )
  },
  showElectronsStringProperty: _.get( PhotoelectricEffectStrings, 'showElectronsStringProperty' ),
  highestEnergyOnlyStringProperty: _.get( PhotoelectricEffectStrings, 'highestEnergyOnlyStringProperty' ),
  spectrumTrack: {
    uvLabelStringProperty: _.get( PhotoelectricEffectStrings, 'spectrumTrack.uvLabelStringProperty' ),
    irLabelStringProperty: _.get( PhotoelectricEffectStrings, 'spectrumTrack.irLabelStringProperty' )
  },
  _comment_2: new FluentComment( {"comment":"TODO: @design What should these be?","associatedKey":"workFunction"} ),
  workFunction: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'workFunction.labelStringProperty' )
  },
  intensity: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'intensity.labelStringProperty' ),
    percentReadoutPatternStringProperty: _.get( PhotoelectricEffectStrings, 'intensity.percentReadoutPatternStringProperty' )
  },
  photonRate: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'photonRate.labelStringProperty' )
  },
  sourceOutput: {
    percentReadoutPatternStringProperty: _.get( PhotoelectricEffectStrings, 'sourceOutput.percentReadoutPatternStringProperty' )
  },
  wavelength: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'wavelength.labelStringProperty' ),
    valueReadoutPatternStringProperty: _.get( PhotoelectricEffectStrings, 'wavelength.valueReadoutPatternStringProperty' )
  },
  voltage: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'voltage.labelStringProperty' )
  },
  current: {
    labelStringProperty: _.get( PhotoelectricEffectStrings, 'current.labelStringProperty' ),
    readoutPatternStringProperty: _.get( PhotoelectricEffectStrings, 'current.readoutPatternStringProperty' )
  },
  preferences: {
    mysteryMaterial: {
      labelStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterial.labelStringProperty' ),
      descriptionStringProperty: _.get( PhotoelectricEffectStrings, 'preferences.mysteryMaterial.descriptionStringProperty' )
    }
  },
  a11y: {
    _comment_0: new FluentComment( {"comment":"Intro screen summary","associatedKey":"introScreen"} ),
    introScreen: {
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_introScreen_screenSummary_playArea', _.get( PhotoelectricEffectStrings, 'a11y.introScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_introScreen_screenSummary_controlArea', _.get( PhotoelectricEffectStrings, 'a11y.introScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: {
          leadingParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_introScreen_screenSummary_currentDetails_leadingParagraph', _.get( PhotoelectricEffectStrings, 'a11y.introScreen.screenSummary.currentDetails.leadingParagraphStringProperty' ) )
        },
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_introScreen_screenSummary_interactionHint', _.get( PhotoelectricEffectStrings, 'a11y.introScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    _comment_1: new FluentComment( {"comment":"Experiment screen summary","associatedKey":"experimentScreen"} ),
    experimentScreen: {
      screenSummary: {
        playAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_experimentScreen_screenSummary_playArea', _.get( PhotoelectricEffectStrings, 'a11y.experimentScreen.screenSummary.playAreaStringProperty' ) ),
        controlAreaStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_experimentScreen_screenSummary_controlArea', _.get( PhotoelectricEffectStrings, 'a11y.experimentScreen.screenSummary.controlAreaStringProperty' ) ),
        currentDetails: {
          leadingParagraphStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_experimentScreen_screenSummary_currentDetails_leadingParagraph', _.get( PhotoelectricEffectStrings, 'a11y.experimentScreen.screenSummary.currentDetails.leadingParagraphStringProperty' ) )
        },
        interactionHintStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_experimentScreen_screenSummary_interactionHint', _.get( PhotoelectricEffectStrings, 'a11y.experimentScreen.screenSummary.interactionHintStringProperty' ) )
      }
    },
    _comment_2: new FluentComment( {"comment":"Photon source panel and its inner controls","associatedKey":"photonSourcePanel"} ),
    photonSourcePanel: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photonSourcePanel_accessibleHeading', _.get( PhotoelectricEffectStrings, 'a11y.photonSourcePanel.accessibleHeadingStringProperty' ) ),
      intensitySlider: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photonSourcePanel_intensitySlider_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.photonSourcePanel.intensitySlider.accessibleNameStringProperty' ) )
      },
      wavelengthNumberControl: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photonSourcePanel_wavelengthNumberControl_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.photonSourcePanel.wavelengthNumberControl.accessibleNameStringProperty' ) )
      }
    },
    _comment_3: new FluentComment( {"comment":"Ammeter current readout","associatedKey":"ammeterDisplayPanel"} ),
    ammeterDisplayPanel: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_ammeterDisplayPanel_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.ammeterDisplayPanel.accessibleNameStringProperty' ) )
    },
    _comment_4: new FluentComment( {"comment":"Material selection","associatedKey":"materialsComboBox"} ),
    materialsComboBox: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_materialsComboBox_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.materialsComboBox.accessibleNameStringProperty' ) )
    },
    _comment_5: new FluentComment( {"comment":"Intro screen: representation toggle","associatedKey":"representationRadioButtonGroup"} ),
    representationRadioButtonGroup: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_representationRadioButtonGroup_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.representationRadioButtonGroup.accessibleNameStringProperty' ) ),
      groundedRadioButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_representationRadioButtonGroup_groundedRadioButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.representationRadioButtonGroup.groundedRadioButton.accessibleNameStringProperty' ) )
      },
      circuitRadioButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_representationRadioButtonGroup_circuitRadioButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.representationRadioButtonGroup.circuitRadioButton.accessibleNameStringProperty' ) )
      }
    },
    _comment_6: new FluentComment( {"comment":"Experiment screen: battery voltage control","associatedKey":"voltageNumberControl"} ),
    voltageNumberControl: {
      accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageNumberControl_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.voltageNumberControl.accessibleNameStringProperty' ) )
    },
    _comment_7: new FluentComment( {"comment":"Experiment screen: graphs","associatedKey":"intensityCurrentGraphNode"} ),
    intensityCurrentGraphNode: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_accessibleHeading', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.accessibleHeadingStringProperty' ) ),
      expandCollapseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_expandCollapseButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.expandCollapseButton.accessibleNameStringProperty' ) )
      },
      infoButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_infoButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.infoButton.accessibleNameStringProperty' ) )
      },
      cameraButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_cameraButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.cameraButton.accessibleNameStringProperty' ) )
      },
      trashButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_trashButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.trashButton.accessibleNameStringProperty' ) )
      },
      snapshotsGalleryButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_snapshotsGalleryButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.snapshotsGalleryButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_intensityCurrentGraphNode_snapshotsGalleryButton_accessibleHelpText', _.get( PhotoelectricEffectStrings, 'a11y.intensityCurrentGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty' ) )
      }
    },
    frequencyEnergyGraphNode: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_accessibleHeading', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.accessibleHeadingStringProperty' ) ),
      expandCollapseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_expandCollapseButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.expandCollapseButton.accessibleNameStringProperty' ) )
      },
      infoButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_infoButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.infoButton.accessibleNameStringProperty' ) )
      },
      cameraButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_cameraButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.cameraButton.accessibleNameStringProperty' ) )
      },
      trashButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_trashButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.trashButton.accessibleNameStringProperty' ) )
      },
      snapshotsGalleryButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_snapshotsGalleryButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.snapshotsGalleryButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_frequencyEnergyGraphNode_snapshotsGalleryButton_accessibleHelpText', _.get( PhotoelectricEffectStrings, 'a11y.frequencyEnergyGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty' ) )
      }
    },
    voltageCurrentGraphNode: {
      accessibleHeadingStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_accessibleHeading', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.accessibleHeadingStringProperty' ) ),
      expandCollapseButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_expandCollapseButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.expandCollapseButton.accessibleNameStringProperty' ) )
      },
      infoButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_infoButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.infoButton.accessibleNameStringProperty' ) )
      },
      cameraButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_cameraButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.cameraButton.accessibleNameStringProperty' ) )
      },
      trashButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_trashButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.trashButton.accessibleNameStringProperty' ) )
      },
      snapshotsGalleryButton: {
        accessibleNameStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_snapshotsGalleryButton_accessibleName', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.snapshotsGalleryButton.accessibleNameStringProperty' ) ),
        accessibleHelpTextStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_snapshotsGalleryButton_accessibleHelpText', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.snapshotsGalleryButton.accessibleHelpTextStringProperty' ) )
      },
      _comment_0: new FluentComment( {"comment":"TODO: @design What should these be?","associatedKey":"workFunction"} ),
      workFunction: {
        labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_workFunction_label', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.workFunction.labelStringProperty' ) ),
        descriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_voltageCurrentGraphNode_workFunction_description', _.get( PhotoelectricEffectStrings, 'a11y.voltageCurrentGraphNode.workFunction.descriptionStringProperty' ) )
      }
    },
    photonMode: {
      labelStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photonMode_label', _.get( PhotoelectricEffectStrings, 'a11y.photonMode.labelStringProperty' ) ),
      descriptionStringProperty: new FluentConstant( fluentSupport.bundleProperty, 'a11y_photonMode_description', _.get( PhotoelectricEffectStrings, 'a11y.photonMode.descriptionStringProperty' ) )
    }
  }
};

export default PhotoelectricEffectFluent;

photoelectricEffect.register('PhotoelectricEffectFluent', PhotoelectricEffectFluent);
