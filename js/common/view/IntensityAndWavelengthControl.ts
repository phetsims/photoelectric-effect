// Copyright 2026, University of Colorado Boulder

/**
 * Panel with light intensity and wavelength controls for the photon source. Intensity uses an HSlider with a
 * full-width gradient backplate (black to selected wavelength); wavelength uses an HSlider with spectrum track
 * and thumb.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { clamp } from '../../../../dot/js/util/clamp.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import SpectrumSliderThumb from '../../../../scenery-phet/js/SpectrumSliderThumb.js';
import VisibleColor from '../../../../scenery-phet/js/VisibleColor.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import HSlider from '../../../../sun/js/HSlider.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import Slider from '../../../../sun/js/Slider.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PhotonSource from '../model/PhotonSource.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import LabeledSpectrumSliderTrack from './LabeledSpectrumSliderTrack.js';

type SelfOptions = EmptySelfOptions;

type IntensityAndWavelengthControlOptions = SelfOptions & PanelOptions;

// Horizontal gap between the intensity gradient rectangle and the percent readout.
const INTENSITY_READOUT_SPACING = 6;

// Vertical gap between the wavelength readout and the slider (readout sits above the thumb).
const WAVELENGTH_READOUT_SPACING = 5;

// Font for the intensity heading above the intensity slider.
const INTENSITY_LABEL_FONT = new PhetFont( 16 );

export default class IntensityAndWavelengthControl extends Panel {

  public constructor( photonSource: PhotonSource, providedOptions: IntensityAndWavelengthControlOptions ) {

    const options = optionize<IntensityAndWavelengthControlOptions, SelfOptions, PanelOptions>()( {
      stroke: 'black',
      lineWidth: 3,
      cornerRadius: 4,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      align: 'center',
      tandem: Tandem.REQUIRED
    }, providedOptions );

    const wavelengthToColor = ( wavelength: number ) => VisibleColor.wavelengthToColor( wavelength, {
      uvColor: Color.WHITE,
      irColor: Color.WHITE
    } );

    // Right edge of the intensity backplate gradient: full brightness; UV/IR use white (same as spectrum thumb).
    const wavelengthToIntensityGradientEndColor = ( wavelength: number ) => VisibleColor.wavelengthToColor( wavelength, {
      uvColor: Color.WHITE,
      irColor: Color.WHITE,
      reduceIntensityAtExtrema: false
    } );

    const intensityRange = new Range( 0, 1 );
    const wavelengthRange = new Range(
      PhotoelectricEffectConstants.MIN_WAVELENGTH,
      PhotoelectricEffectConstants.MAX_WAVELENGTH_UI
    );

    const intensityTrackSize = new Dimension2( 125, 5 );

    const intensitySliderTandem = options.tandem.createTandem( 'intensitySlider' );

    const intensityGradientRectangle = new Rectangle( 0, 0, 1, 1, {
      stroke: 'black',
      lineWidth: 1,
      pickable: false
    } );

    // Default HSlider thumb is 17×34; 25% smaller => 75% scale.
    const intensityThumbSize = new Dimension2( 17 * 0.75, 34 * 0.75 );
    const intensitySlider = new HSlider( photonSource.intensityProperty, intensityRange, {
      tandem: intensitySliderTandem,
      trackSize: intensityTrackSize,
      thumbSize: intensityThumbSize
    } );

    const intensityPercentProperty = new DerivedProperty( [ photonSource.intensityProperty ], intensity => 100 * intensity );

    const intensityReadout = new NumberDisplay( intensityPercentProperty, new Range( 0, 100 ), {
      decimalPlaces: 0,
      valuePattern: PhotoelectricEffectFluent.intensity.percentReadoutPatternStringProperty,
      cornerRadius: 4,
      backgroundFill: 'white',
      backgroundStroke: 'black',
      backgroundLineWidth: 1,
      align: 'center',
      textOptions: {
        font: new PhetFont( 12 ),
        maxWidth: 72
      },
      xMargin: 2,
      pickable: false,
      tandem: intensitySliderTandem.createTandem( 'intensityReadout' )
    } );

    const intensitySliderLayer = new Node( {
      children: [ intensityGradientRectangle, intensitySlider, intensityReadout ]
    } );

    const updateIntensityLayer = () => {
      const w = Math.max( intensitySlider.width, 1 );
      const h = Math.max( intensitySlider.height, 1 );
      intensityGradientRectangle.setRect( 0, 0, w, h );
      intensityGradientRectangle.left = intensitySlider.left;
      intensityGradientRectangle.top = intensitySlider.top;

      const endColor = wavelengthToIntensityGradientEndColor( photonSource.wavelengthProperty.value );
      intensityGradientRectangle.fill = new LinearGradient( 0, 0, w, 0 )
        .addColorStop( 0, Color.BLACK )
        .addColorStop( 1, endColor );

      intensityReadout.left = intensityGradientRectangle.right + INTENSITY_READOUT_SPACING;
      intensityReadout.centerY = intensityGradientRectangle.centerY;
    };
    photonSource.wavelengthProperty.link( updateIntensityLayer );
    intensitySlider.boundsProperty.link( updateIntensityLayer );
    updateIntensityLayer();

    const wavelengthSliderTandem = options.tandem.createTandem( 'wavelengthSlider' );

    const wavelengthTrackSize = new Dimension2( 240, 20 );
    const wavelengthThumbWidth = 35 * 0.5;
    const wavelengthThumbHeight = 45 * 0.5;

    const wavelengthThumbNode = new SpectrumSliderThumb( photonSource.wavelengthProperty, {
      valueToColor: wavelengthToColor,
      width: wavelengthThumbWidth,
      height: wavelengthThumbHeight,
      cursorHeight: wavelengthTrackSize.height,
      tandem: wavelengthSliderTandem.createTandem( Slider.THUMB_NODE_TANDEM_NAME )
    } );

    const wavelengthTrackNode = new LabeledSpectrumSliderTrack( photonSource.wavelengthProperty, wavelengthRange, {
      valueToColor: wavelengthToColor,
      size: wavelengthTrackSize,
      tandem: wavelengthSliderTandem.createTandem( Slider.TRACK_NODE_TANDEM_NAME )
    } );

    const wavelengthSlider = new HSlider( photonSource.wavelengthProperty, wavelengthRange, {
      tandem: wavelengthSliderTandem,
      trackNode: wavelengthTrackNode,
      thumbNode: wavelengthThumbNode
    } );

    const wavelengthReadout = new NumberDisplay( photonSource.wavelengthProperty, wavelengthRange, {
      decimalPlaces: 0,
      valuePattern: PhotoelectricEffectFluent.wavelength.valueReadoutPatternStringProperty,
      cornerRadius: 4,
      backgroundFill: 'white',
      backgroundStroke: 'black',
      backgroundLineWidth: 1,
      align: 'center',
      textOptions: {
        font: new PhetFont( 12 ),
        maxWidth: 100
      },
      xMargin: 2,
      pickable: false,
      tandem: wavelengthSliderTandem.createTandem( 'wavelengthReadout' )
    } );

    const wavelengthRow = new Node( {
      children: [ wavelengthSlider, wavelengthReadout ]
    } );

    const updateWavelengthReadoutLayout = () => {
      if ( wavelengthRow.bounds.isValid() && wavelengthThumbNode.bounds.isValid() && wavelengthReadout.bounds.isValid() ) {
        const thumbCenterLocal = wavelengthThumbNode.localBounds.center;
        const thumbCenterGlobal = wavelengthThumbNode.localToGlobalPoint( thumbCenterLocal );
        const thumbCenterInRow = wavelengthRow.globalToLocalPoint( thumbCenterGlobal );

        const valueToPosition = wavelengthTrackNode.valueToPositionProperty.value;
        const trackLeftInRow = wavelengthRow.globalToLocalPoint(
          wavelengthTrackNode.localToGlobalPoint( new Vector2( valueToPosition.evaluate( wavelengthRange.min ), 0 ) )
        ).x;
        const trackRightInRow = wavelengthRow.globalToLocalPoint(
          wavelengthTrackNode.localToGlobalPoint( new Vector2( valueToPosition.evaluate( wavelengthRange.max ), 0 ) )
        ).x;

        const halfReadoutWidth = wavelengthReadout.width / 2;
        const minCenterX = trackLeftInRow + halfReadoutWidth;
        const maxCenterX = trackRightInRow - halfReadoutWidth;

        let centerX = thumbCenterInRow.x;
        if ( minCenterX <= maxCenterX ) {
          centerX = clamp( centerX, minCenterX, maxCenterX );
        }
        else {

          // Readout wider than the track interior: keep it centered on the bar.
          centerX = ( trackLeftInRow + trackRightInRow ) / 2;
        }

        wavelengthReadout.centerX = centerX;
        wavelengthReadout.bottom = wavelengthSlider.top - WAVELENGTH_READOUT_SPACING;
      }
    };
    Multilink.multilink(
      [
        photonSource.wavelengthProperty,
        wavelengthSlider.boundsProperty,
        wavelengthThumbNode.boundsProperty,
        wavelengthReadout.boundsProperty,
        wavelengthTrackNode.valueToPositionProperty
      ],
      updateWavelengthReadoutLayout
    );
    updateWavelengthReadoutLayout();

    const content = new VBox( {
      spacing: 12,
      align: 'center',
      children: [
        new VBox( {
          spacing: 5,
          align: 'center',
          children: [
            new Text( PhotoelectricEffectFluent.intensity.labelStringProperty, {
              font: INTENSITY_LABEL_FONT
            } ),
            intensitySliderLayer
          ]
        } ),
        new VBox( {
          spacing: 5,
          align: 'center',
          children: [ wavelengthRow ]
        } )
      ]
    } );

    super( content, options );
  }
}
