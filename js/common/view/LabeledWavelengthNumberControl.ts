// Copyright 2026, University of Colorado Boulder

/**
 * Wavelength control with labeled spectrum track, spectrum thumb, NumberDisplay (nm), and arrow buttons.
 *
 * TODO: Highly duplicated with MonochromaticWavelengthControl. Consider moving to scenery-phet or
 *   improving WavelengthNumberControl.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import WavelengthNumberControl, { WavelengthNumberControlOptions } from '../../../../scenery-phet/js/WavelengthNumberControl.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToColor } from '../model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = EmptySelfOptions;
export type LabeledWavelengthNumberControlOptions = SelfOptions & PickRequired<WavelengthNumberControlOptions, 'tandem'>;

const TRACK_SIZE = new Dimension2( 240, 20 );
const THUMB_WIDTH = 18;
const THUMB_HEIGHT = 25;
const READOUT_MAX_WIDTH = 100;

const DEFAULT_NUMBER_DISPLAY_OPTIONS: NumberDisplayOptions = {
  decimalPlaces: 0,
  cornerRadius: 4,
  backgroundFill: 'white',
  backgroundStroke: 'black',
  backgroundLineWidth: 1,
  align: 'center',
  xMargin: 2
};

export default class LabeledWavelengthNumberControl extends WavelengthNumberControl {

  public constructor( wavelengthProperty: NumberProperty, providedOptions: LabeledWavelengthNumberControlOptions ) {

    const options = optionize<LabeledWavelengthNumberControlOptions, SelfOptions, WavelengthNumberControlOptions>()( {
      isDisposable: false
    }, providedOptions );

    const layoutFunction = ( titleNode: Node, numberDisplay: NumberDisplay, slider: Slider, decrementButton: ArrowButton | null, incrementButton: ArrowButton | null ): Node => {
      affirm( decrementButton, 'A decrementButton is required.' );
      affirm( incrementButton, 'An incrementButton is required.' );

      const uvText = new Text( PhotoelectricEffectFluent.spectrumTrack.uvLabelStringProperty, {
        font: PhotoelectricEffectConstants.READOUT_FONT,
        maxWidth: 75
      } );

      const irText = new Text( PhotoelectricEffectFluent.spectrumTrack.irLabelStringProperty, {
        font: PhotoelectricEffectConstants.READOUT_FONT,
        maxWidth: 18
      } );

      const sliderWrapper = new Node( {
        children: [ slider, uvText, irText ]
      } );

      const updateLabelLayout = () => {
        const wavelengthRange = wavelengthProperty.range;
        const trackRangeLength = wavelengthRange.getLength();
        const trackLeft = slider.x + 1; // + 1 to account for slider track lineWidth
        const trackCenterY = slider.top + TRACK_SIZE.height / 2 + 1; // + 1 to account for slider track lineWidth

        uvText.centerX = trackLeft +
                         TRACK_SIZE.width * ( VisibleColor.MIN_WAVELENGTH - wavelengthRange.min ) / trackRangeLength / 2;
        uvText.centerY = trackCenterY;

        irText.centerX = trackLeft +
                         TRACK_SIZE.width * ( VisibleColor.MAX_WAVELENGTH - wavelengthRange.min ) / trackRangeLength +
                         TRACK_SIZE.width * ( wavelengthRange.max - VisibleColor.MAX_WAVELENGTH ) / trackRangeLength / 2;
        irText.centerY = trackCenterY;
      };

      // For dynamic locales
      uvText.localBoundsProperty.link( updateLabelLayout );
      irText.localBoundsProperty.link( updateLabelLayout );

      return new VBox( {
        align: 'center',
        spacing: 5,
        children: [
          new HBox( {
            spacing: 5,
            children: [ decrementButton, numberDisplay, incrementButton ]
          } ),
          sliderWrapper
        ]
      } );
    };

    super( wavelengthProperty, {
      isDisposable: false,
      range: wavelengthProperty.range,
      layoutFunction: layoutFunction,
      titleNodeOptions: {
        tandem: Tandem.OPT_OUT // because layoutFunction omits the title
      },
      spectrumSliderTrackOptions: {
        // valueToColor: wavelengthToColor,
        size: TRACK_SIZE
      },
      spectrumSliderThumbOptions: {
        valueToColor: wavelengthToColor,
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        cursorHeight: TRACK_SIZE.height
      },
      numberDisplayOptions: combineOptions<NumberDisplayOptions>(
        {},
        DEFAULT_NUMBER_DISPLAY_OPTIONS,
        {
          valuePattern: PhotoelectricEffectFluent.wavelength.valueReadoutPatternStringProperty,
          textOptions: {
            font: PhotoelectricEffectConstants.READOUT_FONT,
            maxWidth: READOUT_MAX_WIDTH
          }
        }
      ),
      tandem: options.tandem
    } );
  }
}
