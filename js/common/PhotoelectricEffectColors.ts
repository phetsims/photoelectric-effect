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

import VisibleColor from '../../../scenery-phet/js/VisibleColor.js';
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

  public static readonly photonOrbInnerColorProperty = new ProfileColorProperty( photoelectricEffect, 'photonOrbInnerColor', {
    default: 'rgba(255, 255, 255, 0.7)'
  } );

  public static readonly photonVisibleSparkleColorProperty = new ProfileColorProperty( photoelectricEffect, 'photonVisibleSparkleColor', {
    default: 'rgba(255, 255, 255, 0.4)'
  } );

  public static readonly photonUVSparkleColorProperty = new ProfileColorProperty( photoelectricEffect, 'photonUVSparkleColor', {
    default: VisibleColor.wavelengthToColor( 400 )
  } );

  public static readonly photonIRSparkleColorProperty = new ProfileColorProperty( photoelectricEffect, 'photonIRSparkleColor', {
    default: VisibleColor.wavelengthToColor( 715 )
  } );

  public static readonly electronColorProperty = new ProfileColorProperty( photoelectricEffect, 'electronColor', {
    default: 'cyan'
  } );

  public static readonly electronBaseColorProperty = new ProfileColorProperty( photoelectricEffect, 'electronBaseColor', {
    default: 'rgb( 108, 186, 223 )'
  } );

  public static readonly electronHighlightColorProperty = new ProfileColorProperty( photoelectricEffect, 'electronHighlightColor', {
    default: 'rgb( 169, 214, 231 )'
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

  // Stroke color shared by panel borders and the slider gradient rectangle outline.
  public static readonly panelStrokeColorProperty = new ProfileColorProperty( photoelectricEffect, 'panelStroke', {
    default: 'black'
  } );

  // Stroke color shared by circuit visual elements (wires, plate material outline, ground symbol).
  public static readonly circuitStrokeColorProperty = new ProfileColorProperty( photoelectricEffect, 'circuitStroke', {
    default: 'black'
  } );

  // Stroke color for the experiment graph border.
  public static readonly graphBorderStrokeColorProperty = new ProfileColorProperty( photoelectricEffect, 'graphBorderStroke', {
    default: 'black'
  } );

  // Fill color for the experiment graph background mask (sits behind plotted data inside the chart area).
  public static readonly graphTickMaskColorProperty = new ProfileColorProperty( photoelectricEffect, 'graphTickMask', {
    default: 'white'
  } );

  // Stroke color for grid lines inside the experiment graph plot area.
  public static readonly graphGridLineColorProperty = new ProfileColorProperty( photoelectricEffect, 'graphGridLine', {
    default: 'rgb( 220, 220, 220 )'
  } );

  // Base color for the experiment graph action buttons (info, trash, snapshots gallery).
  public static readonly graphButtonBaseColorProperty = new ProfileColorProperty( photoelectricEffect, 'graphButtonBase', {
    default: 'white'
  } );

  // Color for potential energy in the Energy screen graph.
  public static readonly potentialEnergyGraphColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'potentialEnergyGraphColor', {
      default: '#417e23'
    } );

  // Color for photon energy in the Energy screen graph.
  public static readonly photonEnergyGraphColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'photonEnergyGraphColor', {
      default: '#974075'
    } );

  // Color for kinetic energy in the Energy screen graph.
  public static readonly kineticEnergyGraphColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'kineticEnergyGraphColor', {
      default: '#2a29f5'
    } );

  // Color for the conduction band in the Energy screen energy diagram.
  public static readonly conductionBandEnergyDiagramColorProperty = new ProfileColorProperty(
    photoelectricEffect, 'conductionBandEnergyDiagramColor', {
      default: '#5fabd7'
    } );
}
