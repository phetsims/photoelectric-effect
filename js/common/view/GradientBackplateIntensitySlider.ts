// Copyright 2026, University of Colorado Boulder

/**
 * Intensity control: localized title, horizontal slider with a full-width gradient backplate (black to the current
 * wavelength color), and a percent NumberDisplay to the right of the slider. Local bounds are overridden to the
 * title plus slider-plus-gradient region only so parent layout (e.g. VBox) does not treat the readout as part of this
 * control's box. This keeps centering relative to the gradient rectangle simple.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import optionize, { combineOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import NumberDisplay, { NumberDisplayOptions } from '../../../../scenery-phet/js/NumberDisplay.js';
import Node, { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import HSlider from '../../../../sun/js/HSlider.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import { wavelengthToIntensityGradientEndColor } from '../model/PhotoelectricEffectUtils.js';
import PhotonSource from '../model/PhotonSource.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';

type SelfOptions = {
  trackSize?: Dimension2;
  thumbSize?: Dimension2;
  readoutMaxWidth?: number;
};

export type GradientBackplateIntensitySliderOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

// Horizontal gap between the gradient rectangle and the percent readout.
const READOUT_SPACING = 6;

// Vertical gap between the intensity title and the slider track (matches former IntensityAndWavelengthControl layout).
const LABEL_SLIDER_SPACING = 5;

const INTENSITY_LABEL_MAX_WIDTH = 200;

const NUMBER_DISPLAY_BASE: NumberDisplayOptions = {
  decimalPlaces: 0,
  cornerRadius: 4,
  backgroundFill: 'white',
  backgroundStroke: 'black',
  backgroundLineWidth: 1,
  align: 'center',
  xMargin: 2
};

export default class GradientBackplateIntensitySlider extends Node {

  public constructor( photonSource: PhotonSource, providedOptions: GradientBackplateIntensitySliderOptions ) {

    const options = optionize<GradientBackplateIntensitySliderOptions, SelfOptions, NodeOptions>()( {
      trackSize: new Dimension2( 125, 5 ),
      thumbSize: new Dimension2( 13, 26 ),
      readoutMaxWidth: 72,
      isDisposable: false
    }, providedOptions );

    super();

    const intensityLabel = new Text( PhotoelectricEffectFluent.intensity.labelStringProperty, {
      font: PhotoelectricEffectConstants.PANEL_TITLE_FONT,
      maxWidth: INTENSITY_LABEL_MAX_WIDTH
    } );

    const intensityGradientRectangle = new Rectangle( 0, 0, 1, 1, {
      stroke: 'black',
      lineWidth: 1
    } );

    const intensitySlider = new HSlider( photonSource.intensityProperty, photonSource.intensityProperty.range, {
      tandem: options.tandem,
      trackSize: options.trackSize,
      thumbSize: options.thumbSize
    } );

    const intensityReadout = new NumberDisplay( photonSource.intensityPercentProperty, new Range(
      photonSource.intensityProperty.range.min * 100,
      photonSource.intensityProperty.range.max * 100
    ), combineOptions<NumberDisplayOptions>(
      {},
      NUMBER_DISPLAY_BASE,
      {
        valuePattern: PhotoelectricEffectFluent.intensity.percentReadoutPatternStringProperty,
        textOptions: {
          font: PhotoelectricEffectConstants.READOUT_FONT,
          maxWidth: options.readoutMaxWidth
        },
        tandem: options.tandem.createTandem( 'intensityReadout' )
      }
    ) );

    this.addChild( intensityLabel );
    this.addChild( intensityGradientRectangle );
    this.addChild( intensitySlider );
    this.addChild( intensityReadout );

    this.mutate( options );

    Multilink.multilink(
      [
        photonSource.wavelengthProperty,
        intensitySlider.boundsProperty,
        intensityLabel.stringProperty
      ],
      () => {
        GradientBackplateIntensitySlider.updateGradientAndReadoutLayout(
          this,
          photonSource,
          intensityLabel,
          intensityGradientRectangle,
          intensitySlider,
          intensityReadout
        );
      }
    );
    GradientBackplateIntensitySlider.updateGradientAndReadoutLayout(
      this,
      photonSource,
      intensityLabel,
      intensityGradientRectangle,
      intensitySlider,
      intensityReadout
    );
  }

  /**
   * Sizes and positions the title, gradient under the slider, and percent readout.
   * Updates localBounds to the title, slider, and gradient only (readout excluded) for parent layout.
   */
  private static updateGradientAndReadoutLayout(
    sliderContainer: GradientBackplateIntensitySlider,
    photonSource: PhotonSource,
    intensityLabel: Text,
    intensityGradientRectangle: Rectangle,
    intensitySlider: HSlider,
    intensityReadout: NumberDisplay
  ): void {
    intensityLabel.top = 0;
    intensityLabel.left = 0;
    intensitySlider.top = intensityLabel.bottom + LABEL_SLIDER_SPACING;

    const w = Math.max( intensitySlider.width, 1 );
    const h = Math.max( intensitySlider.height, 1 );
    intensityGradientRectangle.setRect( 0, 0, w, h );
    intensityGradientRectangle.left = intensitySlider.left;
    intensityGradientRectangle.top = intensitySlider.top;

    const endColor = wavelengthToIntensityGradientEndColor( photonSource.wavelengthProperty.value );
    intensityGradientRectangle.fill = new LinearGradient( 0, 0, w, 0 )
      .addColorStop( 0, Color.BLACK )
      .addColorStop( 1, endColor );

    intensityReadout.left = intensityGradientRectangle.right + READOUT_SPACING;
    intensityReadout.centerY = intensityGradientRectangle.centerY;

    intensityLabel.centerX = intensityGradientRectangle.centerX;

    const sliderAndGradientBoundsLocal = intensitySlider.bounds.union( intensityGradientRectangle.bounds );
    const layoutBoundsLocal = intensityLabel.bounds.union( sliderAndGradientBoundsLocal );

    if ( layoutBoundsLocal.isValid() ) {
      sliderContainer.setLocalBounds( layoutBoundsLocal );
    }
    else {

      // Fall back to automatic bounds until the slider has valid geometry.
      sliderContainer.setLocalBounds( null );
    }
  }
}
