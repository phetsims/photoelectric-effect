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

// Width of the lamp opening which will emit our photons.
// Defined here so that our model constant can derive the length of the line along which photons will emit.
const PHOTON_SOURCE_WIDTH = 40;
const PLATE_HEIGHT = 170;

export default class PhotoelectricEffectConstants {

  //--------------------------------------------------------------
  // MODEL CONSTANTS
  //--------------------------------------------------------------

  // X position of the target plate center in model coordinates.
  public static readonly TARGET_X = 0;

  // X position of the collector plate center in model coordinates.
  public static readonly COLLECTOR_X = 100;

  // Photon emission origin, positioned above and to the right of the target.
  public static readonly PHOTON_SOURCE_POSITION = new Vector2( 100, 80 );

  // Angle of the photon beam direction, in radians, counter-clockwise from the positive x-axis.
  // Adjust this single value to pixel-polish the beam direction (e.g. change to -2.3 to tilt slightly up).
  // Defaults to pointing from PHOTON_SOURCE_POSITION directly toward the target center (x=0, y=0).
  public static readonly PHOTON_SOURCE_DIRECTION_ANGLE = Math.atan2(
    -PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.y,
    -PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.x
  );

  // Direction unit vector for emitted photons, derived from PHOTON_SOURCE_DIRECTION_ANGLE.
  public static readonly PHOTON_SOURCE_DIRECTION = Vector2.createPolar( 1, PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION_ANGLE );

  // Half-length of the photon source line segment, in model units (approximately 5 view pixels at MODEL_VIEW_SCALE = 3).
  // Photons originate from random positions along this line, centered at PHOTON_SOURCE_POSITION and perpendicular
  // to PHOTON_SOURCE_DIRECTION, so the beam appears to come from a line rather than a single point.
  public static readonly PHOTON_SOURCE_LINE_HALF_LENGTH = ( PHOTON_SOURCE_WIDTH / 2 ) / 3;

  // Photon speed in model units per second.
  public static readonly PHOTON_SPEED = 80;

  // Distance between plate centers, used for potential/field calculations.
  public static readonly PLATE_SEPARATION = PhotoelectricEffectConstants.COLLECTOR_X - PhotoelectricEffectConstants.TARGET_X;

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
  public static readonly ELECTRON_SPEED_SCALE_FACTOR = 1.6e-14;

  // Minimum energy (in eV) for an emitted electron to be tracked and rendered.
  // Electrons below this threshold are discarded rather than shown hanging near the target.
  public static readonly MINIMUM_ELECTRON_ENERGY = 0.05;

  // Acceleration scale from voltage to model units (model units per V*s^2).
  public static readonly ELECTRON_ACCELERATION_SCALE = 100.2865;

  // Fixed time step for the step-forward button while paused, in seconds (one nominal animation frame).
  public static readonly MANUAL_STEP_DT = 1 / 60;

  //--------------------------------------------------------------
  // VIEW CONSTANTS
  //--------------------------------------------------------------

  // Bounds of the target and collector plate for rendering purposes only.
  public static readonly TARGET_PLATE_BOUNDS = new Bounds2( 0, 0, 8, PLATE_HEIGHT );
  public static readonly COLLECTOR_BOUNDS = new Bounds2( 0, 0, 25, PLATE_HEIGHT + 30 );

  // Width of the lamp opening which will emit our photons.
  public static readonly PHOTON_SOURCE_WIDTH = PHOTON_SOURCE_WIDTH;

  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;

  // Maximum text width used by dialogs for readable line lengths.
  public static readonly DIALOG_MAX_CONTENT_WIDTH = 480;

  // Common horizontal and vertical spacing used by dialogs.
  public static readonly DIALOG_SPACING = 30;

  // Corner radius for dialogs.
  public static readonly DIALOG_CORNER_RADIUS = 10;

  // Scale factor for the model-to-view transform, in view pixels per model unit.
  public static readonly MODEL_VIEW_SCALE = 3;

  // View x coordinate of model x=0 (the left edge of the target plate), in pixels from the left edge of the screen.
  // TODO: Adjust once the target plate artwork and layout are finalized. https://github.com/phetsims/photoelectric-effect/issues/1
  public static readonly VIEW_ORIGIN_X = 350;
  public static readonly DEFAULT_BATTERY_VOLTAGE = 0;

  //------------------------------------------------------------
  // Fonts
  //------------------------------------------------------------
  // Title font shared by dialogs.
  public static readonly DIALOG_TITLE_FONT = new PhetFont( { size: 18, weight: 'bold' } );

  // Font for subsection titles in control panels (e.g. photon source intensity label).
  public static readonly PANEL_TITLE_FONT = new PhetFont( 18 );

  // Fonts for general screen content
  public static readonly CONTENT_FONT = new PhetFont( 16 );

  // Font for numeric readouts (NumberDisplay) and experiment graph axis titles (shared 12 pt instance).
  public static readonly READOUT_FONT = new PhetFont( 12 );
}
