// Copyright 2026, University of Colorado Boulder

/**
 * View for the Experiment screen of the photoelectric effect simulation.
 * Uses the Intro screen view implementation so the Experiment screen matches
 * the current UI until it diverges.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import IntroScreenView from '../../intro/view/IntroScreenView.js';
import ExperimentModel from '../model/ExperimentModel.js';

type SelfOptions = {
  //TODO add options that are specific to ExperimentScreenView here
};

type ExperimentScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class ExperimentScreenView extends IntroScreenView {

  public constructor( model: ExperimentModel, providedOptions: ExperimentScreenViewOptions ) {
    super( model, providedOptions );
  }
}
