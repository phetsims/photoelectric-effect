// Copyright 2026, University of Colorado Boulder

/**
 * CanvasNode that renders photon particles for the photoelectric effect simulation.
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

type SelfOptions = EmptySelfOptions;

type PhotonCanvasNodeOptions = SelfOptions & WithRequired<CanvasNodeOptions, 'canvasBounds'>;

// TODO: Render electrons here as well.
// TODO: Move this file into the common directory now.
export default class PhotonCanvasNode extends CanvasNode {

  private readonly photonImage: HTMLImageElement | HTMLCanvasElement;

  public constructor(
    private readonly model: PhotoelectricEffectModel,
    private readonly modelViewTransform: ModelViewTransform2,
    providedOptions: PhotonCanvasNodeOptions ) {
    super( providedOptions );

    // TODO: Keep an eye out for pixelation. In that case we may want to draw using Canvas functions.
    const photonNode = new Circle( PHOTON_RADIUS, { fill: 'yellow', stroke: 'black', lineWidth: 0.5 } );
    this.photonImage = rasterizeNode( photonNode, { useCanvas: true, wrap: false } ).image;
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    const halfWidth = this.photonImage.width / 2;
    const halfHeight = this.photonImage.height / 2;

    // Set the position of each photon defined in the model.
    this.model.photons.forEach( photon => {
      const position = photon.position;
      const x = this.modelViewTransform.modelToViewX( position.x );
      const y = this.modelViewTransform.modelToViewY( position.y );
      context.drawImage( this.photonImage, x - halfWidth, y - halfHeight );
    } );
  }

  public step( _dt: number ): void {
    this.invalidatePaint();
  }
}
