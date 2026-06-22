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

// Width of the lamp opening which will emit our photons in view units.
// Defined here so that our model constant can derive the length of the line along which photons will emit.
const PHOTON_SOURCE_WIDTH = 70;

// view units
const PLATE_HEIGHT = 150;

const MODEL_VIEW_SCALE = 3.5;

export default class PhotoelectricEffectConstants {

  //--------------------------------------------------------------
  // MODEL CONSTANTS
  //--------------------------------------------------------------

  // X position of the target plate center in model coordinates.
  public static readonly TARGET_X = 0;

  // X position of the collector plate center in model coordinates.
  public static readonly COLLECTOR_X = 100;

  // Photon emission origin, positioned above and to the right of the target.
  public static readonly PHOTON_SOURCE_POSITION = new Vector2( 70, 50 );

  // Angle of the photon beam direction, in radians, counter-clockwise from the positive x-axis.
  // Defaults to pointing from PHOTON_SOURCE_POSITION directly toward the target center (x=0, y=0).
  public static readonly PHOTON_SOURCE_DIRECTION_ANGLE = Math.atan2(
    -PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.y,
    -PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION.x
  );

  // Direction unit vector for emitted photons, derived from PHOTON_SOURCE_DIRECTION_ANGLE.
  public static readonly PHOTON_SOURCE_DIRECTION = Vector2.createPolar( 1, PhotoelectricEffectConstants.PHOTON_SOURCE_DIRECTION_ANGLE );

  // Half-length of the photon source line segment, in model units.
  // Photons originate from random positions along this line, centered at PHOTON_SOURCE_POSITION and perpendicular
  // to PHOTON_SOURCE_DIRECTION, so the beam appears to come from a line rather than a single point.
  public static readonly PHOTON_SOURCE_LINE_HALF_LENGTH = ( PHOTON_SOURCE_WIDTH / 2 ) / MODEL_VIEW_SCALE;

  // Photon speed in model units per second.
  public static readonly PHOTON_SPEED = 80;

  // Distance between plate centers, used for potential/field calculations.
  public static readonly PLATE_SEPARATION = PhotoelectricEffectConstants.COLLECTOR_X - PhotoelectricEffectConstants.TARGET_X;

  //------------------------------------------------
  // KNOBS
  // ------------------------------------------------

  // TODO: Our most powerful lever?
  // Number of physical photons each on-screen photon represents (and therefore the number of physical
  // electrons each visible ejection contributes to the ammeter reading). Visible photons are a sampled
  // subset of the actual photon flux, since a realistic flux would be orders of magnitude denser than
  // would be useful to draw on screen.
  public static readonly PHYSICAL_PHOTONS_PER_VISIBLE_PHOTON = 3.33e12;

  // Scale factor applied to computed electron speeds for model tuning.
  // This is the primary visual-speed knob. ELECTRON_ACCELERATION_SCALE is derived from it so
  // the two are always consistent: the model stopping potential equals KE_max in eV.
  public static readonly ELECTRON_SPEED_SCALE_FACTOR = 1.6e-14;

  // -----------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------
  // Physical constants that should not change, unless you have good reason to.
  // --------------------------------------------------------------------------------------

  // Elementary charge in coulombs (SI 2019 exact value).
  public static readonly ELEMENTARY_CHARGE = 1.602176634e-19;

  // Physical photon emission rate (photons per second) at 100% source output. This is the actual flux used
  // by the analytical current calculation. The on-screen photon density is derived from this by sampling
  // one in every PHYSICAL_PHOTONS_PER_VISIBLE_PHOTON. Some flexibility for tuning since there is a range of reasonable
  // values for "typical" photon sources
  public static readonly MAX_PHOTONS_PER_SECOND = 5e14;


  // Electron mass in kilograms, used for kinetic energy conversions.
  public static readonly ELECTRON_MASS = 9.11e-31;

  // -----------------------------------------------------------------------------------


  // Minimum voltage in the model range (volts).
  public static readonly MIN_VOLTAGE = -8;

  // Maximum voltage in the model range (volts).
  public static readonly MAX_VOLTAGE = 8;

  // Minimum wavelength in the model range (nm).
  public static readonly MIN_WAVELENGTH = 100;

  // Maximum wavelength used by the model (nm).
  public static readonly MAX_WAVELENGTH = 1000;

  // Maximum wavelength used by the UI slider (nm).
  public static readonly MAX_WAVELENGTH_UI = 1000;

  // Maximum expected current for the ammeter display, graphs, and model when in photon rate mode. When the photon rate
  // is normalized the ceiling will be about 6% lower than this calculated number, however we only need this one constant
  // since it covers the expected max current for both modes. Derived from the max photon rate.
  public static readonly MAX_CURRENT = PhotoelectricEffectConstants.MAX_PHOTONS_PER_SECOND *
    PhotoelectricEffectConstants.ELEMENTARY_CHARGE;

  // Acceleration scale from voltage to model units (model units per V·s²).
  // Derived from ELECTRON_SPEED_SCALE_FACTOR and ELECTRON_MASS so the particle simulation's
  // stopping potential matches the analytical formula: V_stop(model) = KE_max(eV).
  // Invariant: ELECTRON_SPEED_SCALE_FACTOR² == ELECTRON_MASS × ELECTRON_ACCELERATION_SCALE.
  public static readonly ELECTRON_ACCELERATION_SCALE =
    ( PhotoelectricEffectConstants.ELECTRON_SPEED_SCALE_FACTOR *
      PhotoelectricEffectConstants.ELECTRON_SPEED_SCALE_FACTOR ) /
    PhotoelectricEffectConstants.ELECTRON_MASS;

  // Fixed time step for the step-forward button while paused, in seconds (one nominal animation frame).
  public static readonly MANUAL_STEP_DT = 1 / 60;

  //--------------------------------------------------------------
  // VIEW CONSTANTS
  //--------------------------------------------------------------

  // Bounds of the target and collector plate for rendering purposes only.

  public static readonly PLATE_MATERIAL_BOUNDS = new Bounds2( 0, 0, 8, PLATE_HEIGHT );
  public static readonly PLATE_BOUNDS = new Bounds2( 0, 0, 25, PLATE_HEIGHT + 30 );

  // Width of the lamp opening which will emit our photons.
  public static readonly PHOTON_SOURCE_WIDTH = PHOTON_SOURCE_WIDTH;

  public static readonly SCREEN_VIEW_X_MARGIN = 15;
  public static readonly SCREEN_VIEW_Y_MARGIN = 15;

  // Shared visual styling for the photon source panels on all screens.
  public static readonly PHOTON_SOURCE_PANEL_LINE_WIDTH = 3;
  public static readonly PHOTON_SOURCE_PANEL_CORNER_RADIUS = 4;

  // Maximum text width used by dialogs for readable line lengths.
  public static readonly DIALOG_MAX_CONTENT_WIDTH = 480;

  // Common horizontal and vertical spacing used by dialogs.
  public static readonly DIALOG_SPACING = 30;

  // Corner radius for dialogs.
  public static readonly DIALOG_CORNER_RADIUS = 10;

  // Scale factor for the model-to-view transform, in view pixels per model unit.
  // Empirically determined.
  public static readonly MODEL_VIEW_SCALE = MODEL_VIEW_SCALE;

  public static readonly DEFAULT_BATTERY_VOLTAGE = 0;

  //------------------------------------------------------------
  // Fonts
  //------------------------------------------------------------
  // Title font shared by dialogs.
  public static readonly DIALOG_TITLE_FONT = new PhetFont( { size: 24, weight: 'bold' } );

  // Font for subsection titles in control panels (e.g. photon source intensity label).
  public static readonly PANEL_TITLE_FONT = new PhetFont( 18 );

  // Fonts for general screen content
  public static readonly CONTENT_FONT = new PhetFont( 16 );

  // Font for numeric readouts (NumberDisplay) and experiment graph axis titles (shared 12 pt instance).
  public static readonly READOUT_FONT = new PhetFont( 12 );

  // Font for small numeric tick labels on experiment graph axes.
  public static readonly GRAPH_TICK_LABEL_FONT = new PhetFont( 10 );
}
