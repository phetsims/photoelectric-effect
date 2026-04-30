// Copyright 2026, University of Colorado Boulder

/**
 * View for the Energy screen of the photoelectric effect simulation.
 * Uses the Intro screen view implementation so the Energy screen matches
 * the current UI until it diverges.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import PhotoelectricEffectScreenView from '../../common/view/PhotoelectricEffectScreenView.js';
import EnergyModel from '../model/EnergyModel.js';

type SelfOptions = {
  //TODO add options that are specific to EnergyScreenView here
};

type EnergyScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class EnergyScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: EnergyModel, providedOptions: EnergyScreenViewOptions ) {
    super( model, providedOptions );

    // TODO: Define order for screen specific components
    this.setScreenPDOMOrder( [], [] );
  }
}
