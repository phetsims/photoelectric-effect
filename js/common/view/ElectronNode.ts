// Copyright 2026, University of Colorado Boulder

/**
 * ElectronNode is the shaded-sphere visual representation of an electron, matching the appearance of ElectronNode in
 * Models of the Hydrogen Atom: a blue sphere with a specular highlight, lit from bottom center to match the sim's
 * light source.
 *
 * The play-area electrons are drawn on a canvas for performance (see ParticleCanvasNode), so this Node is used where
 * a Scenery electron is needed: the 'show electrons' checkbox icon and the Energy screen's energy-diagram markers.
 * The highlight offset and diameter-ratio constants are shared with ParticleCanvasNode so every electron rendering
 * stays visually identical.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import ShadedSphereNode, { ShadedSphereNodeOptions } from '../../../../scenery-phet/js/ShadedSphereNode.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';

type SelfOptions = EmptySelfOptions;

// The electron's colors and lighting are fixed; consumers only control size and outline (e.g. the energy diagram's
// failed-ejection marker adds a stroke).
export type ElectronNodeOptions = SelfOptions &
  StrictOmit<ShadedSphereNodeOptions, 'mainColor' | 'highlightColor' | 'highlightXOffset' | 'highlightYOffset' | 'highlightDiameterRatio'>;

export default class ElectronNode extends ShadedSphereNode {

  // Shaded-sphere lighting parameters, shared with ParticleCanvasNode's canvas drawing so the electron looks
  // identical whether rendered as a Node or painted on the canvas. Lit from bottom center to match the light source.
  public static readonly HIGHLIGHT_X_OFFSET = 0;
  public static readonly HIGHLIGHT_Y_OFFSET = 0.4;
  public static readonly HIGHLIGHT_DIAMETER_RATIO = 0.5;

  public constructor( diameter: number, providedOptions?: ElectronNodeOptions ) {

    const options = optionize<ElectronNodeOptions, SelfOptions, ShadedSphereNodeOptions>()( {
      mainColor: PhotoelectricEffectColors.electronColorProperty,
      highlightColor: PhotoelectricEffectColors.electronHighlightColorProperty,
      highlightXOffset: ElectronNode.HIGHLIGHT_X_OFFSET,
      highlightYOffset: ElectronNode.HIGHLIGHT_Y_OFFSET,
      highlightDiameterRatio: ElectronNode.HIGHLIGHT_DIAMETER_RATIO
    }, providedOptions );

    super( diameter, options );
  }

  /**
   * Creates an electron icon, e.g. for the 'show electrons' checkbox.
   */
  public static createIcon( diameter = 14 ): ElectronNode {
    return new ElectronNode( diameter, {
      isDisposable: false
    } );
  }
}
