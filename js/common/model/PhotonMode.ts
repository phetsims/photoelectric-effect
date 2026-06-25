// Copyright 2026, University of Colorado Boulder

/**
 * PhotonMode describes how the normalized photon source intensity is interpreted.
 * This is factored out into a separate file to avoid a circular dependency between
 * PhotonSource, PhotoelectricEffectQueryParameters, and PhotoelectricEffectPreferences.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

export const PhotonModeValues = [ 'count', 'intensity' ] as const;
export type PhotonMode = typeof PhotonModeValues[number];
