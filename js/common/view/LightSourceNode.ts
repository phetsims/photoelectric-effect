// Copyright 2026, University of Colorado Boulder

/**
 *
 * LightSourceNode renders the lamp from which photons emit. The light source is first drawn with the lens opening
 * facing down in natural coordinates and is then rotated to align with the beam direction.
 * After LAMP_ROTATION, the +y direction lands on the beam direction in view.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// Constants
const BODY_WIDTH = 125;
const BODY_HEIGHT = 100;
const BODY_CORNER_RADIUS = 5;
const LENS_WIDTH = PhotoelectricEffectConstants.PHOTON_SOURCE_WIDTH + 10;
const LENS_HEIGHT = 30;

// In view space (y-down), the beam direction angle is the negative of the model-space angle.
// Subtracting π/2 gives the orientation of the lamp's long faces (perpendicular to beam).
const LAMP_ROTATION = -PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION_ANGLE - Math.PI / 2;

export default class LightSourceNode extends Node {

  // Center of the back face of the lamp body in ScreenView coordinates — the wire attachment point.
  public readonly cordAttachmentPoint: Vector2;

  public constructor( beamStartCenter: Vector2 ) {
    super();

    // Aperture: Defines the lens opening which is wide along the face (x-axis), thin along the beam (y-axis).
    const apertureGradient = new RadialGradient( 0, 0, 1, 0, 0, 15 )
      .addColorStop( 0, PhotoelectricEffectColors.apertureGradientCenterColorProperty.value )
      .addColorStop( 0.5, PhotoelectricEffectColors.apertureGradientMidColorProperty.value )
      .addColorStop( 0.90, PhotoelectricEffectColors.apertureGradientEdgeColorProperty.value );
    const aperture = new Path( new Shape().ellipse( 0, 0, LENS_WIDTH / 2 - 1, 5, 0 ), {
      fill: apertureGradient,
      stroke: PhotoelectricEffectColors.lightSourceBodyColorProperty
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
      rotation: LAMP_ROTATION,
      x: beamStartCenter.x,
      y: beamStartCenter.y
    } );

    this.addChild( container );

    // Overlap by 1 pixel so the cord end appears to be coming out from the light source body
    this.cordAttachmentPoint = container.localToParentPoint( body.centerTop.plusXY( 0, 1 ) );
  }
}
