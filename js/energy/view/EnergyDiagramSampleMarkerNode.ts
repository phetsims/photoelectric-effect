// Copyright 2026, University of Colorado Boulder

/**
 * Marker display for one sample slot in the Energy screen energy diagram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';

// Horizontal layout in model x coordinates. Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;

// Radius for the initial-energy marker and emitted-electron marker.
const ELECTRON_MARKER_RADIUS = 5;

/**
 * Owns the persistent marker Nodes for one sample: the photon arrow, initial-energy marker, and emitted-electron
 * marker. The parent controls sample visibility from model state, while this class updates marker geometry.
 */
export default class EnergyDiagramSampleMarkerNode extends Node {

  // Arrow from the electron's initial potential energy to its emitted kinetic energy.
  private readonly photonArrowNode: ArrowNode;

  // White circle that marks the electron's initial energy in the conduction band.
  private readonly initialEnergyMarker: Circle;

  // Shaded blue marker that represents the emitted electron's kinetic energy.
  private readonly emittedEnergyMarker: ShadedSphereNode;

  // TODO: JSDoc, https://github.com/phetsims/photoelectric-effect/issues/78
  public constructor( private readonly chartTransform: ChartTransform,
                      private readonly sampleIndex: number,
                      photonArrowsVisibleProperty: TReadOnlyProperty<boolean> ) {

    const sampleCenterX = chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) );
    const sampleInitialY = chartTransform.modelToViewY( 0 );

    const photonArrowNode = new ArrowNode( sampleCenterX, sampleInitialY, sampleCenterX, sampleInitialY, {
      fill: PhotoelectricEffectColors.photonArrowEnergyDiagramColorProperty,
      stroke: PhotoelectricEffectColors.photonArrowEnergyDiagramColorProperty,
      tailWidth: 1.25,
      headWidth: 8,
      headHeight: 8,
      visibleProperty: photonArrowsVisibleProperty
    } );

    const initialEnergyMarker = new Circle( ELECTRON_MARKER_RADIUS, {
      fill: PhotoelectricEffectColors.initialEnergyMarkerColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5
    } );

    const emittedEnergyMarker = EnergyDiagramSampleMarkerNode.createElectronMarker();

    super( {
      visible: false,
      children: [ photonArrowNode, initialEnergyMarker, emittedEnergyMarker ]
    } );

    this.photonArrowNode = photonArrowNode;
    this.initialEnergyMarker = initialEnergyMarker;
    this.emittedEnergyMarker = emittedEnergyMarker;

    initialEnergyMarker.center = new Vector2( sampleCenterX, sampleInitialY );
    emittedEnergyMarker.center = new Vector2( sampleCenterX, sampleInitialY );
  }

  /**
   * Repositions persistent marker Nodes from the latest sample energies.
   */
  public updateMarkerPositions( potentialEnergy: number, kineticEnergy: number ): void {
    const sampleCenterX = this.chartTransform.modelToViewX( getSampleCenterX( this.sampleIndex ) );
    const potentialEnergyY = this.chartTransform.modelToViewY( potentialEnergy );
    const kineticEnergyY = this.chartTransform.modelToViewY( kineticEnergy );

    this.initialEnergyMarker.center = new Vector2( sampleCenterX, potentialEnergyY );
    this.emittedEnergyMarker.center = new Vector2( sampleCenterX, kineticEnergyY );
    this.photonArrowNode.setTailAndTip(
      sampleCenterX,
      potentialEnergyY,
      sampleCenterX,
      kineticEnergyY + ELECTRON_MARKER_RADIUS
    );
  }

  /**
   * Creates a shaded electron marker, matching the light direction used by ElectronNode in Models of the Hydrogen Atom.
   */
  private static createElectronMarker(): ShadedSphereNode {
    return new ShadedSphereNode( 2 * ELECTRON_MARKER_RADIUS, {
      mainColor: PhotoelectricEffectColors.electronColorProperty,
      highlightColor: PhotoelectricEffectColors.electronHighlightColorProperty,
      highlightXOffset: 0,
      highlightYOffset: 0.4,
      isDisposable: false
    } );
  }
}
