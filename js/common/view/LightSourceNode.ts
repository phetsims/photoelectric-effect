// Copyright 2026, University of Colorado Boulder

/**
 * TODO: This needs a big cleanup.
 *
 * LightSourceNode renders the photon light source lamp using Scenery primitives,
 * faithfully reproducing the SVG design provided in the project assets. The local
 * origin (0, 0) is positioned at the aperture center (where photons exit), so
 * placing this node at the beam-start view position aligns the emitter correctly.
 *
 * Visual structure (back to front):
 *   1. Body — main housing, dark gradient Rectangle
 *   2. Mount — aperture housing, near-black gradient Rectangle
 *   3. Lens glow — radial gradient Rectangle (same geometry as mount)
 *   4. Lens outline — stroked ellipse marking the aperture opening
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Shape from '../../../../kite/js/Shape.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';

// Scale factor from SVG coordinate space to view pixels.
// The lens ellipse in SVG has ry ≈ 33 (diameter ≈ 66 px). At SVG_SCALE = 0.6
// the rendered face is ~40 px, matching PhotoelectricEffectConstants.PHOTON_SOURCE_WIDTH.
const SVG_SCALE = 0.6;

// Aperture center in SVG space (cx/cy of the lens ellipse in the source file).
// All shape coordinates are expressed relative to this point so the aperture lands
// at (0, 0) in the node's local space, which is used for positioning in ScreenView.
const APERTURE_SVG_X = 26.79;
const APERTURE_SVG_Y = 141.99;

// Stroke style shared by all outline paths.
const OUTLINE_STROKE = '#333333';
const BODY_LINE_WIDTH = 0.8;
const LENS_LINE_WIDTH = 0.6;

// Rotation of the lens ellipse, matching the SVG transform attribute.
const LENS_ROTATION = -39.46 * Math.PI / 180;

// -----------------------------------------------------------------------
// Body — main lamp housing.
//
// The SVG path forms a shape that is well-approximated as a rectangle.
// Dimensions measured from the SVG corners (aperture-relative, SVG units):
//   top (73, -129) · left (-1, -72) · bottom (70, 17) · right (147, -36)
//
// Long sides (C→D and A→E) have length ≈ 116, direction (71, 87) → ~50.8°.
// Short sides have length ≈ 94. Center ≈ (72, -55) in aperture-relative space.
// -----------------------------------------------------------------------
const BODY_WIDTH = 116;
const BODY_HEIGHT = 94;
const BODY_CORNER_RADIUS = 6;

// Long-side direction vector derived from the SVG corner positions.
const BODY_ROTATION = Math.atan2( 87, 71 ); // ≈ 50.8°

// Center of the body in aperture-relative SVG space.
const BODY_CENTER_X = 99 - APERTURE_SVG_X;  // ≈ 72
const BODY_CENTER_Y = 87 - APERTURE_SVG_Y;  // ≈ -55

// -----------------------------------------------------------------------
// Mount — aperture housing on the left side of the body.
//
// Corners (aperture-relative, SVG units):
//   (18, -55) · (-21, -25) · (21, 25) · (59, -4)
//
// Long sides (length ≈ 65) run at ~50°; short sides (length ≈ 48) at ~-40°.
// Center ≈ (19, -15) in aperture-relative space.
// -----------------------------------------------------------------------
const MOUNT_WIDTH = 65;
const MOUNT_HEIGHT = 48;
const MOUNT_CORNER_RADIUS = 4;

const MOUNT_ROTATION = Math.atan2( 50, 42 ); // ≈ 49.9°

// Center of the mount in aperture-relative SVG space.
const MOUNT_CENTER_X = 46 - APERTURE_SVG_X;  // ≈ 19
const MOUNT_CENTER_Y = 127 - APERTURE_SVG_Y; // ≈ -15

// Aperture position in the mount's local coordinate space, derived by applying
// the inverse of the mount transform to (0, 0) in parent space.
// Used to anchor the radial lens-glow gradient at the aperture opening.
const LENS_GLOW_CENTER_X = -0.7;
const LENS_GLOW_CENTER_Y = 24.2;

// Radius of the lens glow gradient in SVG units. Corners of the mount beyond
// this radius receive the last (darkest) gradient stop, keeping the housing dark.
const LENS_GLOW_RADIUS = 35;

type SelfOptions = EmptySelfOptions;
type LightSourceNodeOptions = SelfOptions & NodeOptions;

export default class LightSourceNode extends Node {

  public constructor( providedOptions?: LightSourceNodeOptions ) {
    super( optionize<LightSourceNodeOptions, SelfOptions, NodeOptions>()( {}, providedOptions ) );

    // -----------------------------------------------------------------------
    // Body rectangle — main lamp housing.
    // Gradient runs along the local x-axis (width direction). After the
    // rotation is applied, this produces a diagonal sweep from the upper-left
    // corner to the lower-right corner of the housing.
    // -----------------------------------------------------------------------
    const bodyGradient = new LinearGradient( -BODY_WIDTH / 2, 0, BODY_WIDTH / 2, 0 )
      .addColorStop( 0, '#333132' )
      .addColorStop( 0.81, '#0a0909' )
      .addColorStop( 1, '#000000' );

    const bodyRect = new Rectangle( -BODY_WIDTH / 2, -BODY_HEIGHT / 2, BODY_WIDTH, BODY_HEIGHT, {
      cornerRadius: BODY_CORNER_RADIUS,
      fill: bodyGradient,
      stroke: OUTLINE_STROKE,
      lineWidth: BODY_LINE_WIDTH,
      x: BODY_CENTER_X,
      y: BODY_CENTER_Y,
      rotation: BODY_ROTATION
    } );

    // -----------------------------------------------------------------------
    // Mount rectangle — aperture housing on the left side of the body.
    // -----------------------------------------------------------------------
    const mountGradient = new LinearGradient( -MOUNT_WIDTH / 2, 0, MOUNT_WIDTH / 2, 0 )
      .addColorStop( 0, '#000000' )
      .addColorStop( 0.27, '#0c0c0c' )
      .addColorStop( 0.61, '#161616' )
      .addColorStop( 1, '#1a1a1a' );

    const mountRect = new Rectangle( -MOUNT_WIDTH / 2, -MOUNT_HEIGHT / 2, MOUNT_WIDTH, MOUNT_HEIGHT, {
      cornerRadius: MOUNT_CORNER_RADIUS,
      fill: mountGradient,
      stroke: OUTLINE_STROKE,
      lineWidth: BODY_LINE_WIDTH,
      x: MOUNT_CENTER_X,
      y: MOUNT_CENTER_Y,
      rotation: MOUNT_ROTATION
    } );

    // -----------------------------------------------------------------------
    // Lens glow — radial gradient overlaid on the mount using the same
    // geometry. The gradient origin is the aperture position expressed in the
    // mount's local space, so the glow emanates from the aperture opening.
    // Corners beyond LENS_GLOW_RADIUS receive the darkest stop (#231f20),
    // keeping the upper housing near-black.
    // -----------------------------------------------------------------------
    const lensGradient = new RadialGradient( LENS_GLOW_CENTER_X, LENS_GLOW_CENTER_Y, 0,
      LENS_GLOW_CENTER_X, LENS_GLOW_CENTER_Y, LENS_GLOW_RADIUS )
      .addColorStop( 0, '#ffffff' )
      .addColorStop( 0.78, '#80c3ec' )
      .addColorStop( 0.87, '#7fc1ea' )
      .addColorStop( 0.90, '#7cbce3' )
      .addColorStop( 0.94, '#6ea4c6' )
      .addColorStop( 0.97, '#587d95' )
      .addColorStop( 1, '#231f20' );

    const lensGlowRect = new Rectangle( -MOUNT_WIDTH / 2, -MOUNT_HEIGHT / 2, MOUNT_WIDTH, MOUNT_HEIGHT, {
      cornerRadius: MOUNT_CORNER_RADIUS,
      fill: lensGradient,
      x: MOUNT_CENTER_X,
      y: MOUNT_CENTER_Y,
      rotation: MOUNT_ROTATION
    } );

    // -----------------------------------------------------------------------
    // Lens outline — stroked ellipse marking the physical aperture opening.
    // SVG source: cx=26.79, cy=141.99 → (0, 0) after aperture offset.
    // rx=4.24, ry=33.02, rotation=-39.46° (from the SVG transform attribute).
    // -----------------------------------------------------------------------
    const lensOutlineShape = new Shape().ellipse( 0, 0, 4.24, 33.02, 0 );
    const lensOutline = new Path( lensOutlineShape, {
      fill: null,
      stroke: OUTLINE_STROKE,
      lineWidth: LENS_LINE_WIDTH,
      rotation: LENS_ROTATION
    } );

    // -----------------------------------------------------------------------
    // Compose and scale. All shapes are in SVG units; the container scale
    // converts them to view pixels.
    // -----------------------------------------------------------------------
    const container = new Node( {
      children: [ bodyRect, mountRect, lensGlowRect, lensOutline ],
      scale: SVG_SCALE
    } );

    this.addChild( container );
  }
}