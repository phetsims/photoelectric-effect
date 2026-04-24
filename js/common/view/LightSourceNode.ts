// Copyright 2026, University of Colorado Boulder

/**
 * TODO: This needs a big cleanup.
 *
 * LightSourceNode renders the photon light source lamp using Scenery primitives,
 * faithfully reproducing the SVG design provided in the project assets. The local
 * origin (0, 0) is positioned at the aperture center (where photons exit), so
 * placing this node at the beam-start view position aligns the emitter correctly.
 *
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

// Body — main lamp housing.
const BODY_WIDTH = 125;
const BODY_HEIGHT = 100;
const BODY_CORNER_RADIUS = 5;

// Mount — aperture housing on the left side of the body.
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

    // All parts are drawn in natural coordinates, then a single rotation on the
    // container maps them to screen space:
    //   - aperture at (0, 0)
    //   - lamp face runs along the x-axis
    //   - beam exits in the +y direction; lamp body extends in -y
    // After LAMP_ROTATION, the +y direction lands on the beam direction in view.

    // Lens: wide along the face (x-axis), thin along the beam (y-axis).
    const apertureGradient = new RadialGradient( 0, 0, 1, 0, 0, 15 )
      .addColorStop( 0, '#ffffff' )
      .addColorStop( 0.5, '#80c3ec' )
      .addColorStop( 0.90, '#6ea4c6' );
    const aperture = new Path( new Shape().ellipse( 0, 0, LENS_WIDTH / 2 - 1, 5, 0 ), {
      fill: apertureGradient,
      stroke: 'black'
    } );

    // Mount: centered on the aperture, depth extending into the lamp (-y).
    const lens = new Rectangle( 0, 0, LENS_WIDTH, LENS_HEIGHT, {
      fill: 'black',
      stroke: 'black',
      centerBottom: aperture.center
    } );

    // Body: directly behind the lens.
    const body = new Rectangle( 0, 0, BODY_WIDTH, BODY_HEIGHT, {
      cornerRadius: BODY_CORNER_RADIUS,
      fill: 'black',
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
