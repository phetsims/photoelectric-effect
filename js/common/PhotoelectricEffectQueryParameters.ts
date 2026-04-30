// Copyright 2026, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const PhotoelectricEffectQueryParameters = QueryStringMachine.getAll( {

  // Whether the mystery material is initially enabled.
  // TODO: @design, do we want to keep this?
  mysteryMaterial1Enabled: {
    public: true,
    type: 'flag'
  },

  // Whether the mystery material is initially enabled.
  // TODO: @design, do we want to keep this?
  mysteryMaterial2Enabled: {
    public: true,
    type: 'flag'
  },

  // TODO: @design, Do we want to keep this?
  // Initial work function (in eV) mystery material 1.
  mysteryMaterial1WorkFunction: {
    public: true,
    type: 'number',
    defaultValue: 5
  },

  // TODO: @design, Do we want to keep this?
  // Initial work function (in eV) for mystery material 2.
  mysteryMaterial2WorkFunction: {
    public: true,
    type: 'number',
    defaultValue: 5
  },

  // todo: @design, do you want to keep this? Should it be public?
  // Whether the photon source control directly sets the photon emission rate.
  photonCountMode: {
    public: true,
    type: 'flag'
  }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `PhotoelectricEffectQueryParameters: ${JSON.stringify( PhotoelectricEffectQueryParameters, null, 2 )}` );

export default PhotoelectricEffectQueryParameters;
