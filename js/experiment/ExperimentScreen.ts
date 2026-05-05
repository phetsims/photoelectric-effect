// Copyright 2026, University of Colorado Boulder

/**
 * Screen class for the Experiment screen in the photoelectric effect simulation.
 * Currently reuses the Intro screen model and view while keeping a separate screen
 * entry for future Experiment-specific features.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Screen, { ScreenOptions } from '../../../joist/js/Screen.js';
import optionize, { EmptySelfOptions } from '../../../phet-core/js/optionize.js';
import Material from '../common/model/Material.js';
import PhotoelectricEffectColors from '../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectFluent from '../PhotoelectricEffectFluent.js';
import ExperimentModel from './model/ExperimentModel.js';
import ExperimentScreenView from './view/ExperimentScreenView.js';

type SelfOptions = EmptySelfOptions;
type ExperimentScreenOptions = SelfOptions & ScreenOptions;

export default class ExperimentScreen extends Screen<ExperimentModel, ExperimentScreenView> {

  public constructor( mysteryMaterials: Material[], providedOptions: ExperimentScreenOptions ) {

    const options = optionize<ExperimentScreenOptions, SelfOptions, ScreenOptions>()( {
      name: PhotoelectricEffectFluent.screen.experimentStringProperty,
      backgroundColorProperty: PhotoelectricEffectColors.screenBackgroundColorProperty
    }, providedOptions );

    super(
      () => new ExperimentModel( mysteryMaterials, { tandem: options.tandem.createTandem( 'model' ) } ),
      model => new ExperimentScreenView( model, { tandem: options.tandem.createTandem( 'view' ) } ),
      options
    );
  }
}
