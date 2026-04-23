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
  mysteryMaterial: {
    public: true,
    type: 'flag'
  },

  // TODO: Do we want to keep this?
  // Initial work function (in eV) for the mystery material.
  mysteryMaterialWorkFunction: {
    public: true,
    type: 'number',
    defaultValue: 5
  }
} );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
phet.log && phet.log( `PhotoelectricEffectQueryParameters: ${JSON.stringify( PhotoelectricEffectQueryParameters, null, 2 )}` );

export default PhotoelectricEffectQueryParameters;
