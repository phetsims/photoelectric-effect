// Copyright 2026, University of Colorado Boulder

/**
 * LightBeamNode renders a beam of light spanning from the light source aperture to the target plate. It stands
 * in for the individual rendered photons when the "Show photons" preference is disabled.
 *
 * The beam is a trapezoid: its near edge spans the aperture width (perpendicular to the beam direction) and its
 * far edge is vertical and aligned with the target plate face, so the beam appears to land flush on the plate.
 * The near edge is recessed back into the lens so its flat starting edge is occluded by the light source node,
 * making the beam appear to emerge from the aperture rather than showing a hard line across it.
 * Its color tracks the photon source wavelength (white for UV/IR), matching the rendered photons, and its
 * opacity tracks the normalized source output, so a dimmer source produces a fainter beam.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import Path, { PathOptions } from '../../../../scenery/js/nodes/Path.js';
import { wavelengthToColor } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import { LENS_WIDTH, LENS_Y_RADIUS } from './LightSourceNode.js';

// Opacity of the beam at maximum source output, so the target plate, vacuum tube, and electrons remain visible.
const MAX_BEAM_OPACITY = 0.6;

export default class LightBeamNode extends Path {

  /**
   * @param beamStart - view position of the light source aperture, where the beam begins
   * @param beamEnd - view position of the target plate face center, where the beam ends
   * @param wavelengthProperty - photon source wavelength, in nm
   * @param normalizedOutputProperty - normalized source output in [ 0, 1 ], controls the beam opacity
   * @param providedOptions
   */
  public constructor( beamStart: Vector2, beamEnd: Vector2,
                      wavelengthProperty: TReadOnlyProperty<number>,
                      normalizedOutputProperty: TReadOnlyProperty<number>,
                      providedOptions?: PathOptions ) {

    // Near edge: spans the aperture width, perpendicular to the beam direction. The origin is recessed back into
    // the lens so the flat starting edge is occluded by the light source node.
    const beamWidth = LENS_WIDTH;
    const direction = beamEnd.minus( beamStart ).normalized();
    const recessedStart = beamStart.minus( direction.timesScalar( LENS_Y_RADIUS ) );
    const perpendicular = direction.perpendicular.timesScalar( beamWidth / 2 );
    const beamStartCornerA = recessedStart.plus( perpendicular );
    const beamStartCornerB = recessedStart.minus( perpendicular );

    // Far edge: vertical, centered on the target plate face and spanning its full height, so the beam lands
    // flush on the plate.
    const endBeamScaleFactor = 0.8; // empirically determined
    const beamEndCornerA = beamEnd.plusXY( 0, -beamWidth * endBeamScaleFactor );
    const beamEndCornerB = beamEnd.plusXY( 0, beamWidth * endBeamScaleFactor );

    // Trapezoid with corner points aligned to light source opening (beam start) and target plate (beam end).
    const beamShape = Shape.polygon( [ beamStartCornerA, beamStartCornerB, beamEndCornerA, beamEndCornerB ] );

    super( beamShape, providedOptions );

    // Color tracks the wavelength. In UV/IR mode the fill is white, so the beam gets an outline matching the
    // corresponding UV/IR photon "sparkle" color to keep it distinct from the background.
    Multilink.multilink( [
      wavelengthProperty,
      PhotoelectricEffectColors.photonUVSparkleColorProperty,
      PhotoelectricEffectColors.photonIRSparkleColorProperty
    ], ( wavelength, uvSparkleColor, irSparkleColor ) => {
      this.fill = wavelengthToColor( wavelength );
      this.stroke = VisibleColor.isUVWavelength( wavelength ) ? uvSparkleColor :
                    VisibleColor.isIRWavelength( wavelength ) ? irSparkleColor :
                    null;
    } );

    // A dimmer source produces a fainter beam; no output means no visible beam.
    normalizedOutputProperty.link( normalizedOutput => {
      this.opacity = MAX_BEAM_OPACITY * normalizedOutput;
    } );
  }
}
