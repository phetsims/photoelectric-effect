// Copyright 2026, University of Colorado Boulder

/**
 * CanvasNode that renders photon and electron particles for the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CanvasNode, { CanvasNodeOptions } from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';

const PHOTON_RADIUS = 3.5;
const ELECTRON_RADIUS = 2.5;

type SelfOptions = EmptySelfOptions;

type ParticleCanvasNodeOptions = SelfOptions & WithRequired<CanvasNodeOptions, 'canvasBounds'>;

// TODO: Move this file into the common directory now.
export default class ParticleCanvasNode extends CanvasNode {

  public constructor(
    private readonly model: PhotoelectricEffectModel,
    private readonly modelViewTransform: ModelViewTransform2,
    providedOptions: ParticleCanvasNodeOptions ) {
    super( providedOptions );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    this.drawParticles( context, this.model.photons, PHOTON_RADIUS, PhotoelectricEffectColors.photonColorProperty.value );
    this.drawParticles( context, this.model.electrons, ELECTRON_RADIUS, PhotoelectricEffectColors.electronColorProperty.value );
  }

  private drawParticles( context: CanvasRenderingContext2D, particles: { position: { x: number; y: number } }[],
                         radius: number, fill: Color ): void {
    context.fillStyle = fill.toCSS();
    context.strokeStyle = 'black';
    context.lineWidth = 0.5;
    particles.forEach( particle => {
      const x = this.modelViewTransform.modelToViewX( particle.position.x );
      const y = this.modelViewTransform.modelToViewY( particle.position.y );
      context.beginPath();
      context.arc( x, y, radius, 0, 2 * Math.PI );
      context.fill();
      context.stroke();
    } );
  }

  public step( _dt: number ): void {
    this.invalidatePaint();
  }
}
