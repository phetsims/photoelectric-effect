// Copyright 2026, University of Colorado Boulder

/**
 * Panel with source intensity and wavelength controls for the photon source.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import { NodeBoundsBasedTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import PhotonSource from '../model/PhotonSource.js';
import PhotoelectricEffectColors from '../PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../PhotoelectricEffectConstants.js';
import LabeledWavelengthNumberControl from './LabeledWavelengthNumberControl.js';
import PhotonSourceIntensitySlider from './PhotonSourceIntensitySlider.js';

type SelfOptions = EmptySelfOptions;

type PhotonSourceControlOptions =
  SelfOptions &
  NodeBoundsBasedTranslationOptions &
  PickRequired<PanelOptions, 'tandem'>;

export default class PhotonSourceControl extends Panel {

  public constructor( photonSource: PhotonSource, providedOptions: PhotonSourceControlOptions ) {
    const options = optionize<PhotonSourceControlOptions, SelfOptions, PanelOptions>()( {
      stroke: PhotoelectricEffectColors.panelStrokeColorProperty,
      lineWidth: PhotoelectricEffectConstants.PHOTON_SOURCE_PANEL_LINE_WIDTH,
      cornerRadius: PhotoelectricEffectConstants.PHOTON_SOURCE_PANEL_CORNER_RADIUS,
      fill: PhotoelectricEffectColors.photonSourcePanelFillColorProperty,
      align: 'center',
      isDisposable: false,
      accessibleHeading: PhotoelectricEffectFluent.a11y.photonSourcePanel.accessibleHeadingStringProperty
    }, providedOptions );

    // TODO: To match the tandem, rename this class to PhotonIntensityControl.
    const intensityControl = new PhotonSourceIntensitySlider(
      photonSource.normalizedIntensityProperty,
      photonSource.intensityPercentProperty,
      photonSource.wavelengthProperty,
      {
        tandem: options.tandem.createTandem( 'intensityControl' )
      }
    );

    const wavelengthNumberControl = new LabeledWavelengthNumberControl( photonSource.wavelengthProperty, {
      tandem: options.tandem.createTandem( 'wavelengthNumberControl' )
    } );

    const content = new VBox( {
      spacing: 12,
      align: 'center',
      children: [
        intensityControl,
        wavelengthNumberControl
      ]
    } );

    super( content, options );
  }
}
