// Copyright 2026, University of Colorado Boulder

/**
 * Panel for the Energy screen's photon source controls. Lets the user choose between single-photon and burst modes,
 * fire photons for the Energy graphs, and adjust the photon wavelength. The Fire button is disabled while fired
 * photons are still traveling to the target so graph samples are recorded one firing sequence at a time.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import LabeledWavelengthNumberControl from '../../common/view/LabeledWavelengthNumberControl.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type SelfOptions = EmptySelfOptions;
type EnergyPhotonSourcePanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;

export default class EnergyPhotonSourcePanel extends Panel {

  /**
   * @param wavelengthProperty - Wavelength controlled by the slider.
   * @param isSinglePhotonModeProperty - Whether the Fire button emits one photon or a burst.
   * @param firePhotonEmitter - Emits when the Fire button is pressed.
   * @param photonsTravelingProperty - The fire button is enabled only when no fired photons are in flight.
   * @param providedOptions
   */
  public constructor(
    wavelengthProperty: NumberProperty,
    isSinglePhotonModeProperty: Property<boolean>,
    firePhotonEmitter: Emitter,
    photonsTravelingProperty: TReadOnlyProperty<boolean>,
    providedOptions: EnergyPhotonSourcePanelOptions
  ) {

    const options = optionize<EnergyPhotonSourcePanelOptions, SelfOptions, PanelOptions>()( {
      stroke: PhotoelectricEffectColors.panelStrokeColorProperty,
      lineWidth: PhotoelectricEffectConstants.PHOTON_SOURCE_PANEL_LINE_WIDTH,
      cornerRadius: PhotoelectricEffectConstants.PHOTON_SOURCE_PANEL_CORNER_RADIUS,
      fill: PhotoelectricEffectColors.photonSourcePanelFillColorProperty
    }, providedOptions );

    const switchHeight = 20;
    const singleBurstSwitch = new ABSwitch(
      isSinglePhotonModeProperty,
      true, new Text( PhotoelectricEffectFluent.photonEmitter.singleStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 100
      } ),
      false, new Text( PhotoelectricEffectFluent.photonEmitter.burstStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 100
      } ), {
        toggleSwitchOptions: {
          size: new Dimension2( switchHeight * 2, switchHeight )
        },
        tandem: options.tandem.createTandem( 'singleBurstSwitch' )
      } );
    const firePhotonButton = new RoundPushButton( {
      content: new Text( PhotoelectricEffectFluent.photonEmitter.fireStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        fill: 'white'
      } ),
      tandem: options.tandem.createTandem( 'firePhotonButton' ),
      listener: () => {
        firePhotonEmitter.emit();
      },
      enabledProperty: DerivedProperty.not( photonsTravelingProperty ),
      baseColor: 'purple'
    } );

    const emitPhotonHBox = new HBox( {
      children: [ singleBurstSwitch, firePhotonButton ],
      spacing: 10
    } );
    const wavelengthNumberControl = new LabeledWavelengthNumberControl( wavelengthProperty, {
      tandem: options.tandem.createTandem( 'wavelengthNumberControl' )
    } );

    const panelContent = new VBox( {
      children: [ emitPhotonHBox, wavelengthNumberControl ],
      spacing: 10
    } );

    super( panelContent, options );
  }
}