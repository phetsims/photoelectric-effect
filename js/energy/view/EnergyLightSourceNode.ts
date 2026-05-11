// Copyright 2026, University of Colorado Boulder

/**
 * EnergyLightSourceNode renders the photon light source for the Energy screen.
 * Unlike LightSourceNode (used in Intro and Experiment screens), this version has three smaller
 * lenses with numeric labels and a slightly shorter body.
 *
 * The node is drawn with the lens openings facing down in natural coordinates, then rotated to
 * align with the beam direction (same LAMP_ROTATION as LightSourceNode).
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import LightSourceNode from '../../common/view/LightSourceNode.js';

// TODO: Currently this matches the width of the LightSourceNode in Intro and Experiment. Is that important or are the
// dimensions between the two empirical?
const BODY_WIDTH = 125;
const BODY_HEIGHT = 50;
const LENS_COUNT = 3;
const SMALL_LENS_WIDTH = 28;
const SMALL_LENS_HEIGHT = 22;
const LENS_SPACING = ( BODY_WIDTH - LENS_COUNT * SMALL_LENS_WIDTH ) / ( LENS_COUNT + 1 );
const LABEL_FONT = new PhetFont( { size: 10, weight: 'bold' } );

export default class EnergyLightSourceNode extends Node {

  // Center of the back face of the lamp body in ScreenView coordinates — the wire attachment point.
  public readonly cordAttachmentPoint: Vector2;

  public constructor( beamStartCenter: Vector2 ) {
    super();

    // x-center positions of the three lenses, evenly distributed within the body width.
    // The container's local origin sits at the center of the middle lens aperture (x=0, y=0).
    const lensXPositions = [
      -BODY_WIDTH / 2 + LENS_SPACING + SMALL_LENS_WIDTH / 2,
      0,
      BODY_WIDTH / 2 - LENS_SPACING - SMALL_LENS_WIDTH / 2
    ];

    const lensRectangles: Rectangle[] = [];
    const lensLabels: Text[] = [];
    const apertures: Path[] = [];

    lensXPositions.forEach( ( lensX, index ) => {

      // Lens rectangle: protrudes from the body face toward the aperture.
      const lensRect = new Rectangle( 0, 0, SMALL_LENS_WIDTH, SMALL_LENS_HEIGHT, {
        fill: PhotoelectricEffectColors.lightSourceBodyColorProperty,
        stroke: PhotoelectricEffectColors.lightSourceBodyColorProperty,
        centerX: lensX,
        bottom: 0
      } );

      // Numeric label centered on the lens body.
      const label = new Text( `${index + 1}`, {
        font: LABEL_FONT,
        fill: 'white',
        center: lensRect.center
      } );

      // Aperture: ellipse at the face of the lens. Gradient and shape share the same center (lensX, 0).
      const apertureGradient = new RadialGradient( lensX, 0, 1, lensX, 0, 15 )
        .addColorStop( 0, PhotoelectricEffectColors.apertureGradientCenterColorProperty.value )
        .addColorStop( 0.5, PhotoelectricEffectColors.apertureGradientMidColorProperty.value )
        .addColorStop( 0.90, PhotoelectricEffectColors.apertureGradientEdgeColorProperty.value );
      const aperture = new Path( new Shape().ellipse( lensX, 0, SMALL_LENS_WIDTH / 2 - 1, 5, 0 ), {
        fill: apertureGradient,
        stroke: PhotoelectricEffectColors.lightSourceBodyColorProperty
      } );

      lensRectangles.push( lensRect );
      lensLabels.push( label );
      apertures.push( aperture );
    } );

    // Body: main housing of the light source, centered over all three lenses.
    const body = new Rectangle( 0, 0, BODY_WIDTH, BODY_HEIGHT, {
      cornerRadius: 5,
      fill: PhotoelectricEffectColors.lightSourceBodyColorProperty,
      centerX: 0,
      bottom: -SMALL_LENS_HEIGHT + 1 // overlap by 1px to eliminate finicky white space
    } );

    const container = new Node( {
      children: [ body, ...lensRectangles, ...lensLabels, ...apertures ],
      rotation: LightSourceNode.LAMP_ROTATION, // Same rotation as the light source in the intro and experiment screens
      x: beamStartCenter.x,
      y: beamStartCenter.y
    } );

    this.addChild( container );

    // Overlap by 1 pixel so the cord end appears to be coming out from the light source body.
    this.cordAttachmentPoint = container.localToParentPoint( body.centerTop.plusXY( 0, 1 ) );
  }
}
