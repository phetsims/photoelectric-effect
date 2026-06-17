// Copyright 2026, University of Colorado Boulder

/**
 * CanvasNode that renders photon and electron particles for the photoelectric effect simulation.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toRadians } from '../../../../dot/js/util/toRadians.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import CanvasNode, { CanvasNodeOptions } from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import Electron from '../model/Electron.js';
import Particle from '../model/Particle.js';
import { wavelengthToColor } from '../model/PhotoelectricEffectUtils.js';
import Photon from '../model/Photon.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';

const PHOTON_RADIUS = 10;
const ELECTRON_RADIUS = 2.5;

type SelfOptions = EmptySelfOptions;

type ParticleCanvasNodeOptions = SelfOptions & WithRequired<CanvasNodeOptions, 'canvasBounds'>;

export default class ParticleCanvasNode extends CanvasNode {

  public constructor(
    private readonly photons: Photon[],
    private readonly electrons: Electron[],
    private readonly showElectronsProperty: TReadOnlyProperty<boolean>,
    private readonly showPhotonsProperty: TReadOnlyProperty<boolean>,
    private readonly modelViewTransform: ModelViewTransform2,
    providedOptions: ParticleCanvasNodeOptions ) {
    super( providedOptions );

    // Repaint when photon visibility is toggled while the sim is paused, so the change is immediate.
    showPhotonsProperty.link( () => this.invalidatePaint() );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {

    // When photons are hidden, a LightBeamNode stands in for the beam instead.
    if ( this.showPhotonsProperty.value ) {
      this.drawPhotons( context );
    }

    if ( this.showElectronsProperty.value ) {
      this.drawParticles( context, this.electrons, ELECTRON_RADIUS, PhotoelectricEffectColors.electronColorProperty.value );
    }
  }

  private drawParticles( context: CanvasRenderingContext2D, particles: Particle[],
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

  public step(): void {
    this.invalidatePaint();
  }

  // Photons match the style of PhotonNode in Models of the Hydrogen Atom. They must be drawn on canvas for
  // performance. There is an orb surrounded by a halo gradient, and a sparkle of two pairs of crosshair ellipses.
  // The halo and orb colors are based on the wavelength of the photon, and the sparkle color is based on whether
  // the wavelength is visible, UV, or IR.
  private drawPhotons( context: CanvasRenderingContext2D ): void {
    this.photons.forEach( photon => {
      const x = this.modelViewTransform.modelToViewX( photon.position.x );
      const y = this.modelViewTransform.modelToViewY( photon.position.y );
      const baseColor = wavelengthToColor( photon.wavelength );

      // Halo: wavelength color for visible photons, gray for non-visible photons, fading to transparent at edge.
      const haloColor = getHaloColor( photon.wavelength, baseColor );
      const haloGradient = context.createRadialGradient( x, y, 0, x, y, PHOTON_RADIUS );
      haloGradient.addColorStop( 0.4, haloColor.toCSS() );
      haloGradient.addColorStop( 1, haloColor.withAlpha( 0 ).toCSS() );
      context.beginPath();
      context.arc( x, y, PHOTON_RADIUS, 0, 2 * Math.PI );
      context.fillStyle = haloGradient;
      context.fill();

      // Orb: white-core gradient fading to wavelength color.
      const orbRadius = 0.5 * PHOTON_RADIUS;
      const orbGradient = context.createRadialGradient( x, y, 0, x, y, orbRadius );
      orbGradient.addColorStop( 0.25, PhotoelectricEffectColors.photonOrbInnerColorProperty.value.toCSS() );
      orbGradient.addColorStop( 1, baseColor.withAlpha( 0.5 ).toCSS() );
      context.beginPath();
      context.arc( x, y, orbRadius, 0, 2 * Math.PI );
      context.fillStyle = orbGradient;
      context.fill();

      // Sparkle: two pairs of crosshair ellipses, offset by 45 degrees
      const sparkleRadius = 0.575 * PHOTON_RADIUS;
      const sparkleColor = getSparkleColor( photon.wavelength );
      drawCrosshairs( context, x, y, sparkleRadius, sparkleColor, toRadians( 18 ) );
      drawCrosshairs( context, x, y, 0.7 * sparkleRadius, sparkleColor, toRadians( 63 ) );
    } );
  }
}

// The halo follows the photon wavelength for visible photons. UV and IR wavelengths map to white in
// wavelengthToColor, so use a neutral halo that remains visible without making non-visible photons look white.
// TODO: It is possible that this halo color is the same as the UV/IR color on the UI control in the
//   LabeledWavelengthNumberControl. If so, make sure the same color/logic is used there.
function getHaloColor( wavelength: number, baseColor: Color ): Color {
  return VisibleColor.isUVWavelength( wavelength ) || VisibleColor.isIRWavelength( wavelength ) ?
         PhotoelectricEffectColors.photonNonVisibleHaloColorProperty.value :
         baseColor;
}

// The sparkle will be one color for visible wavelengths and different colors for UV and IR, so that it is visible
// even when the orb and halo are very faint.
function getSparkleColor( wavelength: number ): string {
  if ( wavelength < VisibleColor.MIN_WAVELENGTH ) {
    return PhotoelectricEffectColors.photonUVSparkleColorProperty.value.toCSS();
  }
  else if ( wavelength > VisibleColor.MAX_WAVELENGTH ) {
    return PhotoelectricEffectColors.photonIRSparkleColorProperty.value.toCSS();
  }
  else {
    return PhotoelectricEffectColors.photonVisibleSparkleColorProperty.value.toCSS();
  }
}

// The crosshairs are two ellipses that intersect. Used to create the "sparkle" of the photon drawing.
function drawCrosshairs( context: CanvasRenderingContext2D, cx: number, cy: number,
                         radius: number, color: string, rotation: number ): void {
  context.fillStyle = color;

  // Horizontal ellipse
  context.beginPath();
  context.ellipse( cx, cy, radius, 0.1 * radius, rotation, 0, 2 * Math.PI );
  context.fill();

  // Vertical ellipse (90-degree rotation of the horizontal)
  context.beginPath();
  context.ellipse( cx, cy, 0.1 * radius, radius, rotation, 0, 2 * Math.PI );
  context.fill();
}
