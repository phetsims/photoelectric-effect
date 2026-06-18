// Copyright 2026, University of Colorado Boulder

/**
 * Red ban icon shown when a recorded photon absorption did not eject an electron.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import { combineOptions } from '../../../../phet-core/js/optionize.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Path, { type PathOptions } from '../../../../scenery/js/nodes/Path.js';
import banSolidShape from '../../../../sherpa/js/fontawesome-5/banSolidShape.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';

type NoElectronEjectedIconNodeOptions = StrictOmit<PathOptions, 'fill' | 'scale' | 'shape' | 'shapeProperty'>;

// Font Awesome banSolidShape uses a 512 x 512 view box.
const BAN_ICON_VIEW_BOX_WIDTH = 512;

export default class NoElectronEjectedIconNode extends Path {

  public constructor( iconWidth: number, providedOptions?: NoElectronEjectedIconNodeOptions ) {
    const options = combineOptions<PathOptions>( {}, providedOptions, {
      fill: PhotoelectricEffectColors.noElectronEjectedIconColorProperty,
      scale: iconWidth / BAN_ICON_VIEW_BOX_WIDTH
    } );

    super( banSolidShape, options );
  }
}
