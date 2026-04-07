// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectPreferencesModel is the preferences model for the Photoelectric Effect sim.
 * It wires sim-specific Preferences dialog content into the shared PreferencesModel.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import PreferencesModel from '../../../../joist/js/preferences/PreferencesModel.js';

// eslint-disable-next-line phet/no-view-imported-from-model
import PhotoelectricEffectPreferencesNode from '../view/PhotoelectricEffectPreferencesNode.js';

export default class PhotoelectricEffectPreferencesModel extends PreferencesModel {

  /**
   * Creates the preferences model with sim-specific dialog content.
   */
  public constructor() {

    super( {
      isDisposable: false,

      // Preferences > Simulation
      simulationOptions: {
        customPreferences: [ {
          createContent: tandem => new PhotoelectricEffectPreferencesNode( {
            tandem: tandem
          } )
        } ]
      }
    } );
  }
}
