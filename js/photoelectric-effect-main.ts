// Copyright 2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PhotoelectricEffectMysteryMaterials from './common/model/PhotoelectricEffectMysteryMaterials.js';
import PhotoelectricEffectPreferencesModel from './common/PhotoelectricEffectPreferencesModel.js';
import EnergyScreen from './energy/EnergyScreen.js';
import ExperimentScreen from './experiment/ExperimentScreen.js';
import IntroScreen from './intro/IntroScreen.js';
import PhotoelectricEffectFluent from './PhotoelectricEffectFluent.js';
import './common/PhotoelectricEffectQueryParameters.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = PhotoelectricEffectFluent[ 'photoelectric-effect' ].titleStringProperty;

  const preferencesModel = new PhotoelectricEffectPreferencesModel();

  const screens = [
    new IntroScreen(
      PhotoelectricEffectMysteryMaterials.ALL_MYSTERY_MATERIALS,
      { tandem: Tandem.ROOT.createTandem( 'introScreen' ) }
    ),
    new ExperimentScreen(
      PhotoelectricEffectMysteryMaterials.ALL_MYSTERY_MATERIALS,
      { tandem: Tandem.ROOT.createTandem( 'experimentScreen' ) }
    ),
    new EnergyScreen(
      PhotoelectricEffectMysteryMaterials.ALL_MYSTERY_MATERIALS,
      { tandem: Tandem.ROOT.createTandem( 'energyScreen' ) }
    )
  ];

  const options: SimOptions = {
    preferencesModel: preferencesModel,

    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    credits: {
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      contributors: '',
      qualityAssurance: '',
      graphicArts: '',
      soundDesign: '',
      thanks: ''
    }
  };

  const sim = new Sim( titleStringProperty, screens, options );
  sim.start();
} );