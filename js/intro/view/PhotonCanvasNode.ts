// Copyright 2026, University of Colorado Boulder

/**
 * CanvasNode that renders photon particles for the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import { rasterizeNode } from '../../../../scenery/js/util/rasterizeNode.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';

const PHOTON_RADIUS = 3;

export default class PhotonCanvasNode extends CanvasNode {

  private readonly model: PhotoelectricEffectModel;
  private readonly modelViewTransform: ModelViewTransform2;
  private readonly photonImage: HTMLImageElement | HTMLCanvasElement;

  public constructor( model: PhotoelectricEffectModel, modelViewTransform: ModelViewTransform2, canvasBounds: Bounds2 ) {
    super( { canvasBounds: canvasBounds } );

    this.model = model;
    this.modelViewTransform = modelViewTransform;

    const photonNode = new Circle( PHOTON_RADIUS, { fill: 'yellow', stroke: 'black', lineWidth: 0.5 } );
    this.photonImage = rasterizeNode( photonNode, { useCanvas: true, wrap: false } ).image;
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    const halfWidth = this.photonImage.width / 2;
    const halfHeight = this.photonImage.height / 2;

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
