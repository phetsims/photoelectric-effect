// Copyright 2026, University of Colorado Boulder

/**
 * Defines query parameters that are specific to this simulation.
 * Run with ?log to print query parameters and their values to the browser console at startup.
 *
 * @author Marla A. Schulz
 */

import logGlobal from '../../../phet-core/js/logGlobal.js';
import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';
import photoelectricEffect from '../photoelectricEffect.js';

const PhotoelectricEffectQueryParameters = QueryStringMachine.getAll( {
  //TODO add schemas for query parameters
} );

photoelectricEffect.register( 'PhotoelectricEffectQueryParameters', PhotoelectricEffectQueryParameters );

// Log query parameters
logGlobal( 'phet.chipper.queryParameters' );
logGlobal( 'phet.preloads.phetio.queryParameters' );
logGlobal( 'phet.photoelectricEffect.PhotoelectricEffectQueryParameters' );

export default PhotoelectricEffectQueryParameters;