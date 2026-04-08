// Copyright 2026, University of Colorado Boulder

/**
 * Geometry and placement constants for the photoelectric effect model.
 * Values are placeholders until view-aligned geometry is finalized.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';

// Bounds of the target plate in model coordinates.
const TARGET_BOUNDS = new Bounds2( 0, -40, 5, 40 );

// Bounds of the sink plate in model coordinates.
const SINK_BOUNDS = new Bounds2( 150, -40, 155, 40 );

// Overall model bounds for the play area.
const MODEL_BOUNDS = new Bounds2( -200, -120, 200, 120 );

// Photon emission origin, positioned above and to the right of the target.
const PHOTON_SOURCE_POSITION = new Vector2( 120, 80 );

// Direction from the source toward the target center.
const PHOTON_SOURCE_DIRECTION = TARGET_BOUNDS.getCenter().minus( PHOTON_SOURCE_POSITION ).normalized();

// Half-angle fan-out (in radians) for emitted photon directions.
const PHOTON_SOURCE_FANOUT_ANGLE = 45 * Math.PI / 180;

// Photon speed in model units per second.
const PHOTON_SPEED = 200;

// Distance between plate centers, used for potential/field calculations.
const PLATE_SEPARATION = SINK_BOUNDS.getCenterX() - TARGET_BOUNDS.getCenterX();

export default class PhotoelectricEffectModelConfig {

  /**
   * Static container for model configuration constants.
   * Not intended for instantiation.
   */
  private constructor() {
    // Not intended for instantiation.
  }

  // Bounds of the target plate in model coordinates.
  public static readonly TARGET_BOUNDS = TARGET_BOUNDS;

  // Bounds of the sink plate in model coordinates.
  public static readonly SINK_BOUNDS = SINK_BOUNDS;

  // Overall model bounds for the play area.
  public static readonly MODEL_BOUNDS = MODEL_BOUNDS;

  // Photon emission origin, positioned above and to the right of the target.
  public static readonly PHOTON_SOURCE_POSITION = PHOTON_SOURCE_POSITION;

  // Direction from the source toward the target center.
  public static readonly PHOTON_SOURCE_DIRECTION = PHOTON_SOURCE_DIRECTION;

  // Half-angle fan-out (in radians) for emitted photon directions.
  public static readonly PHOTON_SOURCE_FANOUT_ANGLE = PHOTON_SOURCE_FANOUT_ANGLE;

  // Photon speed in model units per second.
  public static readonly PHOTON_SPEED = PHOTON_SPEED;

  // Distance between plate centers, used for potential/field calculations.
  public static readonly PLATE_SEPARATION = PLATE_SEPARATION;
}
