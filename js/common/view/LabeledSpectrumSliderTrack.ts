// Copyright 2026, University of Colorado Boulder

/**
 * Spectrum slider track with "UV" and "IR" labels centered in the non-visible (typically white) wavelength bands.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import type TProperty from '../../../../axon/js/TProperty.js';
import Range from '../../../../dot/js/Range.js';
import SpectrumSliderTrack, { SpectrumSliderTrackOptions } from '../../../../scenery-phet/js/SpectrumSliderTrack.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

// Font for UV and IR band labels on the spectrum track.
const SPECTRUM_BAND_LABEL_FONT = new PhetFont( 11 );

export default class LabeledSpectrumSliderTrack extends SpectrumSliderTrack {

  public constructor( property: TProperty<number>, range: Range, providedOptions?: SpectrumSliderTrackOptions ) {

    super( property, range, providedOptions );

    const uvText = new Text( PhotoelectricEffectFluent.spectrumTrack.uvLabelStringProperty, {
      font: SPECTRUM_BAND_LABEL_FONT
    } );

    const irText = new Text( PhotoelectricEffectFluent.spectrumTrack.irLabelStringProperty, {
      font: SPECTRUM_BAND_LABEL_FONT
    } );

    this.addChild( uvText );
    this.addChild( irText );

    const updateLabelLayout = () => {
      const rangeValue = this.rangeProperty.value;
      const valueToPosition = this.valueToPositionProperty.value;
      const size = this.sizeProperty.value;

      const uvCenterWavelength = ( rangeValue.min + VisibleColor.MIN_WAVELENGTH ) / 2;
      const irCenterWavelength = ( VisibleColor.MAX_WAVELENGTH + rangeValue.max ) / 2;

      uvText.visible = rangeValue.min < VisibleColor.MIN_WAVELENGTH;
      irText.visible = rangeValue.max > VisibleColor.MAX_WAVELENGTH;

      if ( uvText.visible ) {
        uvText.centerX = valueToPosition.evaluate( uvCenterWavelength );
        uvText.centerY = size.height / 2;
      }

      if ( irText.visible ) {
        irText.centerX = valueToPosition.evaluate( irCenterWavelength );
        irText.centerY = size.height / 2;
      }
    };

    Multilink.multilink(
      [
        PhotoelectricEffectFluent.spectrumTrack.uvLabelStringProperty,
        PhotoelectricEffectFluent.spectrumTrack.irLabelStringProperty
      ],
      updateLabelLayout
    );
    updateLabelLayout();
  }
}
