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
import Circle from '../../../../scenery/js/nodes/Circle.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';

const PHOTON_RADIUS = 3;
const ELECTRON_RADIUS = 2.5;

type SelfOptions = EmptySelfOptions;

type ParticleCanvasNodeOptions = SelfOptions & WithRequired<CanvasNodeOptions, 'canvasBounds'>;

// TODO: Render electrons here as well.
// TODO: Move this file into the common directory now.
export default class ParticleCanvasNode extends CanvasNode {

  private readonly photonImage: HTMLImageElement | HTMLCanvasElement;
  private readonly electronImage: HTMLImageElement | HTMLCanvasElement;

  public constructor(
    private readonly model: PhotoelectricEffectModel,
    private readonly modelViewTransform: ModelViewTransform2,
    providedOptions: ParticleCanvasNodeOptions ) {
    super( providedOptions );

    // TODO: Keep an eye out for pixelation. In that case we may want to draw using Canvas functions.
    const photonNode = new Circle( PHOTON_RADIUS, { fill: 'yellow', stroke: 'black', lineWidth: 0.5 } );
    this.photonImage = rasterizeNode( photonNode, { useCanvas: true, wrap: false } ).image;

    const electronNode = new Circle( ELECTRON_RADIUS, { fill: 'cyan', stroke: 'black', lineWidth: 0.5 } );
    this.electronImage = rasterizeNode( electronNode, { useCanvas: true, wrap: false } ).image;
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    this.drawParticles( context, this.model.photons, this.photonImage );
    this.drawParticles( context, this.model.electrons, this.electronImage );
  }

  private drawParticles( context: CanvasRenderingContext2D, particles: { position: { x: number; y: number } }[],
                         image: HTMLImageElement | HTMLCanvasElement ): void {
    const halfWidth = image.width / 2;
    const halfHeight = image.height / 2;
    particles.forEach( particle => {
      const x = this.modelViewTransform.modelToViewX( particle.position.x );
      const y = this.modelViewTransform.modelToViewY( particle.position.y );
      context.drawImage( image, x - halfWidth, y - halfHeight );
    } );
  }

  public step( _dt: number ): void {
    this.invalidatePaint();
  }
}
