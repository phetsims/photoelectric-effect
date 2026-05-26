// Copyright 2026, University of Colorado Boulder

/**
 * Panel with source output and wavelength controls for the photon source.
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
import LabeledWavelengthNumberControl from './LabeledWavelengthNumberControl.js';
import PhotonSourceOutputSlider from './PhotonSourceOutputSlider.js';

type SelfOptions = EmptySelfOptions;

type PhotonSourceControlOptions =
  SelfOptions &
  NodeBoundsBasedTranslationOptions &
  PickRequired<PanelOptions, 'tandem'>;

export default class PhotonSourceControl extends Panel {

  public constructor( photonSource: PhotonSource, providedOptions: PhotonSourceControlOptions ) {
    const options = optionize<PhotonSourceControlOptions, SelfOptions, PanelOptions>()( {
      stroke: PhotoelectricEffectColors.panelStrokeColorProperty,
      lineWidth: 3,
      cornerRadius: 4,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      align: 'center',
      isDisposable: false,
      accessibleHeading: PhotoelectricEffectFluent.a11y.photonSourcePanel.accessibleHeadingStringProperty
    }, providedOptions );

    const outputSlider = new PhotonSourceOutputSlider(
      photonSource.normalizedOutputProperty,
      photonSource.normalizedOutputPercentProperty,
      photonSource.wavelengthProperty,
      {
        tandem: options.tandem.createTandem( 'outputSlider' )
      }
    );

    const wavelengthNumberControl = new LabeledWavelengthNumberControl( photonSource.wavelengthProperty, {
      tandem: options.tandem.createTandem( 'wavelengthNumberControl' )
    } );

    // BEWARE: The localBounds of the outputSlider are overridden to exclude the value readout so that
    // the slider and number control appear more logically centered.
    const content = new VBox( {
      spacing: 12,
      align: 'center',
      children: [
        outputSlider,
        wavelengthNumberControl
      ]
    } );

    super( content, options );
  }
}
