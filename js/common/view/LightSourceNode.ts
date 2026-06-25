// Copyright 2026, University of Colorado Boulder

/**
 *
 * LightSourceNode renders the lamp from which photons emit. The light source is first drawn with the lens opening
 * facing down in natural coordinates and is then rotated to align with the beam direction.
 * After LAMP_ROTATION, the +y direction lands on the beam direction in view.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import { wavelengthToColorWithGradient } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// Constants
const BODY_WIDTH = PhotoelectricEffectConstants.PHOTON_SOURCE_WIDTH + 50;
const BODY_HEIGHT = 80;
const BODY_CORNER_RADIUS = 5;
export const LENS_WIDTH = PhotoelectricEffectConstants.PHOTON_SOURCE_WIDTH + 10;
const LENS_HEIGHT = 25;
export const LENS_Y_RADIUS = 5;

/**
 * Builds the radial gradient for the aperture. The bright center is always white, while the mid and edge stops
 * are tinted (either the default cool blue, or the wavelength color when the source is emitting visible light).
 */
const createApertureGradient = ( midColor: Color, edgeColor: Color ): RadialGradient => {
  return new RadialGradient( 0, 0, 1, 0, 0, 15 )
    .addColorStop( 0, PhotoelectricEffectColors.apertureGradientCenterColorProperty.value )
    .addColorStop( 0.5, midColor )
    .addColorStop( 0.90, edgeColor );
};

export default class LightSourceNode extends Node {

  // Center of the back face of the lamp body in ScreenView coordinates — the wire attachment point.
  public readonly cordAttachmentPoint: Vector2;

  // In view space (y-down), the beam direction angle is the negative of the model-space angle.
// Subtracting π/2 gives the orientation of the lamp's long faces (perpendicular to beam).
  public static readonly LAMP_ROTATION = -PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION_ANGLE - Math.PI / 2;

  public constructor( beamStartCenter: Vector2,
                      wavelengthProperty: TReadOnlyProperty<number>,
                      photonRateProperty: TReadOnlyProperty<number> ) {
    super();

    // Aperture: Defines the lens opening which is wide along the face (x-axis), thin along the beam (y-axis).
    const aperture = new Path( new Shape().ellipse( 0, 0, LENS_WIDTH / 2 - 1, LENS_Y_RADIUS, 0 ), {
      stroke: PhotoelectricEffectColors.lightSourceBodyColorProperty
    } );

    // The aperture glows with the emitted light's color: the wavelength color for visible light, and the matching
    // UV/IR photon "sparkle" color outside the visible spectrum. It falls back to the default cool gradient only
    // when the source is off (photon rate is 0).
    Multilink.multilink( [
      wavelengthProperty,
      photonRateProperty,
      PhotoelectricEffectColors.photonUVSparkleColorProperty,
      PhotoelectricEffectColors.photonIRSparkleColorProperty
    ], ( wavelength, photonRate, uvSparkleColor, irSparkleColor ) => {
      const sourceOff = photonRate === 0;

      const midColor = sourceOff ? PhotoelectricEffectColors.apertureGradientMidColorProperty.value :
                       VisibleColor.isUVWavelength( wavelength ) ? uvSparkleColor :
                       VisibleColor.isIRWavelength( wavelength ) ? irSparkleColor :
                       wavelengthToColorWithGradient( wavelength );

      const edgeColor = sourceOff ? PhotoelectricEffectColors.apertureGradientEdgeColorProperty.value :
                        midColor.colorUtilsDarker( 0.15 );

      aperture.fill = createApertureGradient( midColor, edgeColor );
    } );

    // Lens: Centered on the aperture and extends out from the body of the light source.
    const lens = new Rectangle( 0, 0, LENS_WIDTH, LENS_HEIGHT, {
      fill: PhotoelectricEffectColors.lightSourceBodyColorProperty,
      stroke: PhotoelectricEffectColors.lightSourceBodyColorProperty,
      centerBottom: aperture.center
    } );

    // Body: The main housing of the light source.
    const body = new Rectangle( 0, 0, BODY_WIDTH, BODY_HEIGHT, {
      cornerRadius: BODY_CORNER_RADIUS,
      fill: PhotoelectricEffectColors.lightSourceBodyColorProperty,
      centerBottom: lens.centerTop.plusXY( 0, 1 ) // overlap a bit to eliminate finicky white space.
    } );

    // Single rotation brings the whole lamp into screen orientation.
    // x/y places the aperture (local origin) at beamStartCenter in parent space.
    const container = new Node( {
      children: [ lens, body, aperture ],
      rotation: LightSourceNode.LAMP_ROTATION,
      x: beamStartCenter.x,
      y: beamStartCenter.y
    } );

    this.addChild( container );

    // Overlap by 1 pixel so the cord end appears to be coming out from the light source body
    this.cordAttachmentPoint = container.localToParentPoint( body.centerTop.plusXY( 0, 1 ) );
  }
}
