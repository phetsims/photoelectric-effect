// Copyright 2026, University of Colorado Boulder

/**
 * PhotoelectricEffectConstants is the set of constants used throughout the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';

export default class PhotoelectricEffectConstants {

  private constructor() {
    // Not intended for instantiation.
  }

  //--------------------------------------------------------------
  // MODEL CONSTANTS
  //--------------------------------------------------------------

  // X position of the target plate center in model coordinates.
  public static readonly TARGET_X = 0;

  // X position of the sink plate center in model coordinates.
  public static readonly SINK_X = 100;

  // TODO: MODEL_BOUNDS is used only as a culling boundary for photons and electrons. The current values are
  //   overly generous and don't reflect the actual physics space (target at x=0–5, sink at x=150–155, plates
  //   at y=±40). Consider replacing with more specific culling conditions per particle type — e.g. cull photons
  //   that pass x=0 without hitting the target, and cull electrons that leave the inter-plate region — rather
  //   than a single large rectangle. Discuss with team before changing. https://github.com/phetsims/photoelectric-effect/issues/1
  public static readonly MODEL_BOUNDS = new Bounds2( -200, -120, 200, 120 );

  // Photon emission origin, positioned above and to the right of the target.
  public static readonly PHOTON_SOURCE_POSITION = new Vector2( 120, 80 );

  // Direction from the source toward the target center.
  public static readonly PHOTON_SOURCE_DIRECTION = new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 )
    .minus( PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION ).normalized();

  // Half-angle fan-out (in radians) for emitted photon directions.
  public static readonly PHOTON_SOURCE_FANOUT_ANGLE = 45 * Math.PI / 180;

  // Photon speed in model units per second.
  public static readonly PHOTON_SPEED = 200;

  // Distance between plate centers, used for potential/field calculations.
  public static readonly PLATE_SEPARATION = PhotoelectricEffectConstants.SINK_X - PhotoelectricEffectConstants.TARGET_X;

  // Factor to scale analytically reported current from photons-per-second.
  public static readonly CURRENT_JIMMY_FACTOR = 0.015;

  // Factor to scale voltage across electrodes for display.
  public static readonly VOLTAGE_SCALE_FACTOR = 1;

  // Minimum voltage in the model range (volts).
  public static readonly MIN_VOLTAGE = -8;

  // Maximum voltage in the model range (volts).
  public static readonly MAX_VOLTAGE = 8;

  // Minimum wavelength in the model range (nm).
  public static readonly MIN_WAVELENGTH = 100;

  // Maximum wavelength used by the model (nm).
  public static readonly MAX_WAVELENGTH = 800;

  // Maximum wavelength used by the UI slider (nm).
  public static readonly MAX_WAVELENGTH_UI = 850;

  // Maximum photon emission rate (photons per second).
  public static readonly MAX_PHOTONS_PER_SECOND = 500;

  // Maximum expected current for the ammeter display, derived from max rate.
  public static readonly MAX_CURRENT = PhotoelectricEffectConstants.MAX_PHOTONS_PER_SECOND *
                                       PhotoelectricEffectConstants.CURRENT_JIMMY_FACTOR / 8;

  // Electron mass in kilograms, used for kinetic energy conversions.
  public static readonly ELECTRON_MASS = 9.11e-31;

  // Scale factor applied to computed electron speeds for model tuning.
  public static readonly ELECTRON_SPEED_SCALE_FACTOR = 5e-16;

  // Minimum electron speed for randomized emission (model units per second).
  public static readonly MINIMUM_ELECTRON_SPEED = 0.1;

  // Acceleration scale from voltage to model units (model units per V*s^2).
  public static readonly ELECTRON_ACCELERATION_SCALE = 100.2865;

  //--------------------------------------------------------------
  // VIEW CONSTANTS
  //--------------------------------------------------------------

  // Bounds of the target plate for rendering purposes only.
  public static readonly TARGET_BOUNDS = new Bounds2( 0, 0, 5, 80 );

  // Bounds of the sink plate for rendering purposes only.
  public static readonly SINK_BOUNDS = new Bounds2( 0, 0, 5, 80 );

  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;

  // Maximum text width used by dialogs for readable line lengths.
  public static readonly DIALOG_MAX_CONTENT_WIDTH = 480;

  // Title font shared by dialogs.
  public static readonly DIALOG_TITLE_FONT = new PhetFont( {
    size: 18,
    weight: 'bold'
  } );

  // Body text font shared by dialogs.
  public static readonly DIALOG_CONTENT_FONT = new PhetFont( 14 );

  // Common horizontal and vertical spacing used by dialogs.
  public static readonly DIALOG_SPACING = 30;

  // Corner radius for dialogs.
  public static readonly DIALOG_CORNER_RADIUS = 10;

  // Scale factor for the model-to-view transform, in view pixels per model unit.
  public static readonly MODEL_VIEW_SCALE = 3;

  // View x coordinate of model x=0 (the left edge of the target plate), in pixels from the left edge of the screen.
  // TODO: Adjust once the target plate artwork and layout are finalized. https://github.com/phetsims/photoelectric-effect/issues/1
  public static readonly VIEW_ORIGIN_X = 150;
  public static readonly DEFAULT_BATTERY_VOLTAGE = 0;
}
