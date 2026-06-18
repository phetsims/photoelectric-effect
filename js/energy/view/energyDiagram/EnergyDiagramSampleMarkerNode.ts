// Copyright 2026, University of Colorado Boulder

/**
 * Marker display for one sample slot in the Energy screen energy diagram.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import ShadedSphereNode from '../../../../../scenery-phet/js/ShadedSphereNode.js';
import Circle from '../../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import EnergyGraphLayout from '../EnergyGraphLayout.js';
import NoElectronEjectedIconNode from '../NoElectronEjectedIconNode.js';

// constants
const ELECTRON_MARKER_RADIUS = 5;
const INITIAL_ENERGY_MARKER_LINE_WIDTH = 1.5;
const FAILED_EJECTION_MARKER_LINE_WIDTH = 3;
const NO_ELECTRON_EJECTED_ICON_WIDTH = 22;
const NO_ELECTRON_EJECTED_ICON_MODEL_Y = 6;

/**
 * Owns the persistent marker Nodes for one sample: the photon arrow, initial-energy marker, and emitted-electron
 * marker. The parent controls sample visibility from model state, while this class updates marker geometry.
 */
export default class EnergyDiagramSampleMarkerNode extends Node {

  // Arrow from the electron's initial binding energy to its emitted kinetic energy.
  private readonly photonArrowNode: ArrowNode;

  // White circle that marks the electron's initial energy in the conduction band.
  private readonly initialEnergyMarker: Circle;

  // Shaded blue marker that represents the emitted electron's kinetic energy.
  private readonly emittedEnergyMarker: ShadedSphereNode;

  // Shaded electron marker shown at binding energy when the photon does not eject an electron.
  private readonly failedInitialEnergyMarker: ShadedSphereNode;

  // Icon shown next to the binding-energy marker when the photon does not eject an electron.
  private readonly noElectronEjectedIconNode: NoElectronEjectedIconNode;

  // This is cached view state for icon visibility and should not need to be independently phet-io instrumented.
  // They are controlled by instrumented stateful Properties.
  private electronEmitted = false;
  private photonArrowsVisible = false;

  /**
   * @param chartTransform - Translates sample and energy coordinates into the shared chart view.
   * @param sampleIndex - Zero-based sample slot index represented by this marker.
   * @param photonArrowsVisibleProperty - Whether arrows showing photon energy transfer are visible.
   */
  public constructor( private readonly chartTransform: ChartTransform,
                      private readonly sampleIndex: number,
                      photonArrowsVisibleProperty: TReadOnlyProperty<boolean> ) {

    const sampleCenterX = chartTransform.modelToViewX( EnergyGraphLayout.getSampleCenterX( sampleIndex ) );
    const sampleInitialY = chartTransform.modelToViewY( 0 );

    const photonArrowNode = new ArrowNode( sampleCenterX, sampleInitialY, sampleCenterX, sampleInitialY, {
      fill: PhotoelectricEffectColors.photonArrowEnergyDiagramColorProperty,
      stroke: PhotoelectricEffectColors.photonArrowEnergyDiagramColorProperty,
      tailWidth: 1.25,
      headWidth: 8,
      headHeight: 8
    } );

    const initialEnergyMarker = new Circle( ELECTRON_MARKER_RADIUS, {
      fill: PhotoelectricEffectColors.initialEnergyMarkerColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: INITIAL_ENERGY_MARKER_LINE_WIDTH
    } );

    const emittedEnergyMarker = EnergyDiagramSampleMarkerNode.createElectronMarker( true );
    const failedInitialEnergyMarker = EnergyDiagramSampleMarkerNode.createElectronMarker( false );
    const noElectronEjectedIconNode = new NoElectronEjectedIconNode( NO_ELECTRON_EJECTED_ICON_WIDTH, {
      visible: false
    } );

    super( {
      visible: false,
      children: [
        photonArrowNode,
        initialEnergyMarker,
        failedInitialEnergyMarker,
        emittedEnergyMarker,
        noElectronEjectedIconNode
      ]
    } );

    this.photonArrowNode = photonArrowNode;
    this.initialEnergyMarker = initialEnergyMarker;
    this.emittedEnergyMarker = emittedEnergyMarker;
    this.failedInitialEnergyMarker = failedInitialEnergyMarker;
    this.noElectronEjectedIconNode = noElectronEjectedIconNode;

    initialEnergyMarker.center = new Vector2( sampleCenterX, sampleInitialY );
    failedInitialEnergyMarker.center = new Vector2( sampleCenterX, sampleInitialY );
    failedInitialEnergyMarker.visible = false;
    emittedEnergyMarker.center = new Vector2( sampleCenterX, sampleInitialY );
    noElectronEjectedIconNode.center = new Vector2(
      sampleCenterX,
      chartTransform.modelToViewY( NO_ELECTRON_EJECTED_ICON_MODEL_Y )
    );

    photonArrowsVisibleProperty.link( photonArrowsVisible => {
      this.photonArrowsVisible = photonArrowsVisible;
      this.updatePhotonArrowVisibility();
    } );
  }

  /**
   * Repositions and update visibility for persistent marker component Nodes from the latest sample energies.
   */
  public updateMarkerState( bindingEnergy: number, kineticEnergy: number, electronEmitted: boolean ): void {
    this.electronEmitted = electronEmitted;

    const sampleCenterX = this.chartTransform.modelToViewX( EnergyGraphLayout.getSampleCenterX( this.sampleIndex ) );
    const bindingEnergyY = this.chartTransform.modelToViewY( bindingEnergy );
    const kineticEnergyY = this.chartTransform.modelToViewY( kineticEnergy );

    this.initialEnergyMarker.center = new Vector2( sampleCenterX, bindingEnergyY );
    this.initialEnergyMarker.visible = electronEmitted;

    this.failedInitialEnergyMarker.center = new Vector2( sampleCenterX, bindingEnergyY );
    this.failedInitialEnergyMarker.visible = !electronEmitted;

    this.emittedEnergyMarker.center = new Vector2( sampleCenterX, kineticEnergyY );
    this.emittedEnergyMarker.visible = electronEmitted;

    this.noElectronEjectedIconNode.visible = !electronEmitted;
    this.noElectronEjectedIconNode.center = new Vector2(
      sampleCenterX,
      this.chartTransform.modelToViewY( NO_ELECTRON_EJECTED_ICON_MODEL_Y )
    );

    this.photonArrowNode.setTailAndTip(
      sampleCenterX,
      bindingEnergyY,
      sampleCenterX,
      kineticEnergyY + ELECTRON_MARKER_RADIUS
    );
    this.updatePhotonArrowVisibility();
  }

  /**
   * Updates photon-arrow visibility from both graph control state and the current sample state.
   */
  private updatePhotonArrowVisibility(): void {
    this.photonArrowNode.visible = this.electronEmitted && this.photonArrowsVisible;
  }

  /**
   * Creates a shaded electron marker, matching the light direction used by ElectronNode in Models of the Hydrogen Atom.
   */
  private static createElectronMarker( ejected: boolean ): ShadedSphereNode {
    return new ShadedSphereNode( 2 * ELECTRON_MARKER_RADIUS, {
      mainColor: PhotoelectricEffectColors.electronColorProperty,
      highlightColor: PhotoelectricEffectColors.electronHighlightColorProperty,
      highlightXOffset: 0,
      highlightYOffset: 0.4,
      stroke: ejected ? null : PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: ejected ? 1 : FAILED_EJECTION_MARKER_LINE_WIDTH,
      isDisposable: false
    } );
  }
}
