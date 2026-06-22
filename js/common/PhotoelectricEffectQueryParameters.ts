// Copyright 2026, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import Material from './model/Material.js';
import { PhotonModeValues } from './model/PhotonMode.js';

const PhotoelectricEffectQueryParameters = QueryStringMachine.getAll( {

  // Whether the mystery material is initially enabled.
  mysteryMaterial2Enabled: {
    public: true,
    type: 'flag'
  },

  // Initial work function (in eV) for mystery material 2.
  mysteryMaterial2WorkFunction: {
    public: true,
    type: 'number',
    defaultValue: 5,
    isValidValue: value => Material.WORK_FUNCTION_RANGE.contains( value )
  },

  // Initial band depth (in eV) for mystery material 2.
  mysteryMaterial2BandDepth: {
    public: true,
    type: 'number',
    defaultValue: 5,
    isValidValue: value => Material.BAND_DEPTH_RANGE.contains( value )
  },

  // Whether the photon source control directly sets the photon emission rate.
  photonMode: {
    public: true,
    type: 'string',
    validValues: PhotonModeValues,
    defaultValue: 'count'
  },

  // TODO: @design Is emitAllAbsorbedPhotons the right name for this preference?
  // Whether every photon with enough energy emits an electron, while preserving an emitted energy distribution.
  emitAllAbsorbedPhotons: {
    public: true,
    type: 'flag'
  },

  // Whether the light source emits visible photons.
  showPhotons: {
    public: true,
    type: 'flag'
  },

  // Whether experiment graph data returns every deterministic bin instead of only bins revealed by interaction.
  // This is just for testing, not sure if we want this feature for now. It may become a PreferencesDialog
  // setting.
  showAllGraphData: {
    public: false,
    type: 'flag'
  }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `PhotoelectricEffectQueryParameters: ${JSON.stringify( PhotoelectricEffectQueryParameters, null, 2 )}` );

export default PhotoelectricEffectQueryParameters;
