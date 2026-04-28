// Copyright 2026, University of Colorado Boulder

/**
 * Intensity control for a photon source with title, horizontal slider, and a percent readout. The track
 * sits on a gradient backplate from black to the color for the source's current wavelength. Parent layout uses
 * `localBounds` that include the title and slider region but not the readout, so alignment treats the readout as
 * outside the main control bounds.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import affirm from '../../../../perennial-alias/js/browser-and-node/affirm.js';
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

  /**
   * @param intensityProperty - normalized model intensity
   * @param intensityPercentProperty - intensity reported as a percentage for display
   * @param wavelengthProperty - wavelength of emitted photons
   * @param providedOptions
   */
  public constructor(
    intensityProperty: NumberProperty,
    intensityPercentProperty: TReadOnlyProperty<number>,
    wavelengthProperty: TReadOnlyProperty<number>,
    providedOptions: GradientBackplateIntensitySliderOptions
  ) {

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

    const intensitySlider = new HSlider( intensityProperty, intensityProperty.range, {
      tandem: options.tandem.createTandem( 'intensitySlider' ),
      trackSize: options.trackSize,
      thumbSize: options.thumbSize
    } );

    const intensityGradientRectangle = new Rectangle( intensitySlider.localBounds, {
      stroke: 'black',
      lineWidth: 1
    } );

    const intensityReadout = new NumberDisplay( intensityPercentProperty, new Range(
      intensityProperty.range.min * 100,
      intensityProperty.range.max * 100
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

    // static layout - slider and gradient are at the origin, intensity label centered above, with
    // intensity readout centered to the right
    intensityLabel.centerX = intensityGradientRectangle.centerX;
    intensityLabel.bottom = intensityGradientRectangle.top - LABEL_SLIDER_SPACING;
    intensityReadout.left = intensityGradientRectangle.right + READOUT_SPACING;
    intensityReadout.centerY = intensityGradientRectangle.centerY;

    // update gradient for the backplate when selected wavelength changes
    wavelengthProperty.link( wavelength => {
      const gradientWidth = intensityGradientRectangle.rectWidth;
      const endColor = wavelengthToIntensityGradientEndColor( wavelength );
      intensityGradientRectangle.fill = new LinearGradient( 0, 0, gradientWidth, 0 )
        .addColorStop( 0, Color.BLACK )
        .addColorStop( 1, endColor );
    } );

    // Override local bounds for this component when the intensity string changes (likely from
    // dynamic locales). The logical bounds includes the backplate rectangle, and the intensity label,
    // but EXCLUDES the intensity readout for layout purposes when used in panels.
    const backplateBounds = intensityGradientRectangle.bounds;
    intensityLabel.boundsProperty.link( intensityLabelBounds => {
      const layoutBoundsLocal = intensityLabelBounds.union( backplateBounds );

      affirm( layoutBoundsLocal.isValid(), 'Bounds should be valid before overriding local bounds' );
      this.setLocalBounds( layoutBoundsLocal );
    } );
  }
}
