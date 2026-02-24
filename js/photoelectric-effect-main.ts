// Copyright 2026, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Marla A. Schulz
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import PhotoelectricEffectScreen from './photoelectric-effect/PhotoelectricEffectScreen.js';
import PhotoelectricEffectFluent from './PhotoelectricEffectFluent.js';
import './common/PhotoelectricEffectQueryParameters.js';

// Launch the sim. Beware that scenery Image nodes created outside simLauncher.launch() will have zero bounds
// until the images are fully loaded. See https://github.com/phetsims/coulombs-law/issues/70#issuecomment-429037461
simLauncher.launch( () => {

  const titleStringProperty = PhotoelectricEffectFluent[ 'photoelectric-effect' ].titleStringProperty;

  const screens = [
    new PhotoelectricEffectScreen( { tandem: Tandem.ROOT.createTandem( 'photoelectricEffectScreen' ) } )
  ];

  const options: SimOptions = {

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