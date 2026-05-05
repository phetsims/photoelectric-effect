// Copyright 2026, University of Colorado Boulder

/**
 * Defines the colors for this sim.
 *
 * All simulations should have a {{REPO}}Colors.ts file, see https://github.com/phetsims/scenery-phet/issues/642.
 *
 * For static colors that are used in more than one place, add them here.
 *
 * For dynamic colors that can be controlled via colorProfileProperty.js, add instances of ProfileColorProperty here,
 * each of which is required to have a default color. Note that dynamic colors can be edited by running the sim from
 * phetmarks using the "Color Editor" mode.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import ProfileColorProperty from '../../../scenery/js/util/ProfileColorProperty.js';
import photoelectricEffect from '../photoelectricEffect.js';

export default class PhotoelectricEffectColors {

  private constructor() {
    // Not intended for instantiation.
  }

  public static readonly screenBackgroundColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'screenBackgroundColor', {
      default: 'white'
    } );

  public static readonly photonColorProperty = new ProfileColorProperty( photoelectricEffect, 'photonColor', {
      default: 'purple'
    } );

  public static readonly electronColorProperty = new ProfileColorProperty( photoelectricEffect, 'electronColor', {
    default: 'cyan'
  } );

  public static readonly iconStrokeColorProperty = new ProfileColorProperty( photoelectricEffect, 'iconStroke', {
    default: 'black'
  } );

  public static readonly vacuumTubeColorProperty = new ProfileColorProperty( photoelectricEffect, 'vacuumTubeColor', {
    default: '#2284c5'
  } );

  public static readonly targetPlateFillColorProperty = new ProfileColorProperty( photoelectricEffect, 'targetPlateFill', {
    default: 'gray'
  } );

  public static readonly collectorColorProperty = new ProfileColorProperty( photoelectricEffect, 'collector', {
    default: 'black'
  } );

  public static readonly circuitWireColorProperty = new ProfileColorProperty( photoelectricEffect, 'circuitWire', {
    default: 'gray'
  } );

  public static readonly lightSourceBodyColorProperty = new ProfileColorProperty( photoelectricEffect, 'lightSourceBody', {
    default: 'black'
  } );

  public static readonly apertureGradientCenterColorProperty = new ProfileColorProperty( photoelectricEffect, 'apertureGradientCenter', {
    default: '#ffffff'
  } );

  public static readonly apertureGradientMidColorProperty = new ProfileColorProperty( photoelectricEffect, 'apertureGradientMid', {
    default: '#80c3ec'
  } );

  public static readonly apertureGradientEdgeColorProperty = new ProfileColorProperty( photoelectricEffect, 'apertureGradientEdge', {
    default: '#6ea4c6'
  } );

  public static readonly ammeterPanelFillColorProperty = new ProfileColorProperty( photoelectricEffect, 'ammeterPanelFill', {
    default: '#eab253'
  } );

  public static readonly frequencyEnergyGraphFillColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'frequencyEnergyGraphFillColor', {
      default: '#7090F5'
    } );

  public static readonly intensityCurrentGraphFillColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'intensityCurrentGraphFillColor', {
      default: '#4B853E'
    } );

  public static readonly voltageCurrentGraphFillColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'voltageCurrentGraphFillColor', {
      default: '#E03722'
    } );
}
