// Copyright 2026, University of Colorado Boulder

/**
 * ElectronVelocityVectorsNode draws a velocity vector arrow in front of each emitted electron on the Energy screen.
 *
 * The Energy screen emits at most one electron per sample slot, so the number of on-screen electrons is capped at
 * EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES. We therefore pre-allocate a fixed pool of that many ArrowNodes once
 * and never create or dispose them at runtime: each update() repositions the arrows for the currently active electrons
 * and hides the rest.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Electron from '../../common/model/Electron.js';
import Material from '../../common/model/Material.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import { wavelengthToEnergy } from '../../common/model/PhotoelectricEffectUtils.js';
import EnergyGraphData from '../model/EnergyGraphData.js';

// The fastest electron the model can emit, in model units per second. The maximum kinetic energy is the most energetic
// photon (shortest wavelength) less the smallest possible work function; converting that to speed gives the upper end
// of the velocity range used to scale the arrows.
const MAX_ELECTRON_SPEED = Electron.determineNewElectronSpeed(
  wavelengthToEnergy( PhotoelectricEffectConstants.MIN_WAVELENGTH ) - Material.WORK_FUNCTION_RANGE.min
);

// View length, in pixels, of the arrow drawn for the fastest possible electron.
const MAX_ARROW_VIEW_LENGTH = 80;

// Pixels of arrow length per model unit of speed. Maps the velocity magnitude to a view length.
const VELOCITY_TO_VIEW_LENGTH_SCALE = MAX_ARROW_VIEW_LENGTH / MAX_ELECTRON_SPEED;

// Minimum view length for an arrow.
const MIN_ARROW_VIEW_LENGTH = 5;

// Distance, in view pixels, from the electron center to the arrow tail.
const ELECTRON_LEADING_EDGE_OFFSET = PhotoelectricEffectConstants.ELECTRON_RADIUS + 0.5;

export default class ElectronVelocityVectorsNode extends Node {

  // Fixed pool of arrows, one slot per possible electron. Reused every update.
  private readonly arrowNodes: ArrowNode[];

  public constructor(
    private readonly electrons: Electron[],
    private readonly modelViewTransform: ModelViewTransform2,
    visibleProperty: TReadOnlyProperty<boolean>
  ) {
    super( { visibleProperty: visibleProperty } );

    this.arrowNodes = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, () => new ArrowNode( 0, 0, 0, 0, {
      fill: PhotoelectricEffectColors.kineticEnergyColorProperty,
      stroke: PhotoelectricEffectColors.kineticEnergyColorProperty,
      headHeight: 8,
      headWidth: 8,
      tailWidth: 1,

      // Shrink the head for short arrows so slow electrons get proportional vectors instead of an all-head arrow.
      isHeadDynamic: true,
      visible: false
    } ) );

    this.children = this.arrowNodes;
  }

  /**
   * Syncs the arrow pool to the currently active electrons. Called every view step, so arrows appear, move, and
   * disappear in lockstep with their electrons.
   */
  public update(): void {

    // Skip the per-frame positioning work while the arrows are hidden (e.g. the Velocity Vectors checkbox is off).
    if ( !this.visible ) {
      return;
    }

    affirm( this.electrons.length <= this.arrowNodes.length,
      'more electrons than arrows in the pool; the Energy screen should emit at most one electron per sample slot' );

    this.arrowNodes.forEach( ( arrowNode, index ) => {
      const electron = this.electrons[ index ];

      // Hide pool arrows that have no electron this frame.
      if ( !electron ) {
        arrowNode.visible = false;
        return;
      }

      const velocity = electron.getVelocity();

      // Every shown electron gets an arrow: clamp slow electrons up to the minimum length.
      const viewLength = Math.max( velocity.magnitude * VELOCITY_TO_VIEW_LENGTH_SCALE, MIN_ARROW_VIEW_LENGTH );

      // Magnitude is normalized away so only the direction matters here. Electrons are emitted with positive speed
      // and nothing decelerates them on the Energy screen, so the velocity is never zero and the normalized direction
      // is always well-defined.
      const viewDirection = this.modelViewTransform.modelToViewDelta( velocity ).normalized();
      const tail = this.modelViewTransform.modelToViewPosition( electron.position )
        .plus( viewDirection.timesScalar( ELECTRON_LEADING_EDGE_OFFSET ) );
      const tip = tail.plus( viewDirection.timesScalar( viewLength ) );

      arrowNode.setTailAndTip( tail.x, tail.y, tip.x, tip.y );
      arrowNode.visible = true;
    } );
  }
}
