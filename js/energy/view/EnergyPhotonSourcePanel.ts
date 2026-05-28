// Copyright 2026, University of Colorado Boulder
/**
 * Panel for the Energy screen's photon source controls. Contains an ABSwitch to toggle between single-photon and burst
 * modes, a fire button to emit photons, and a wavelength slider.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import Emitter from '../../../../axon/js/Emitter.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ABSwitch from '../../../../sun/js/ABSwitch.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import LabeledWavelengthNumberControl from '../../common/view/LabeledWavelengthNumberControl.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

type SelfOptions = EmptySelfOptions;
type EnergyPhotonSourcePanelOptions = SelfOptions & WithRequired<PanelOptions, 'tandem'>;
export default class EnergyPhotonSourcePanel extends Panel {

  public constructor(
    wavelengthProperty: NumberProperty,
    emitSinglePhotonProperty: Property<boolean>,
    firePhotonEmitter: Emitter,
    providedOptions: EnergyPhotonSourcePanelOptions
  ) {

    const switchHeight = 20;
    const photonQuantitySwitch = new ABSwitch(
      emitSinglePhotonProperty,
      true, new Text( PhotoelectricEffectFluent.photonQuantity.singleStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 100
      } ),
      false, new Text( PhotoelectricEffectFluent.photonQuantity.burstStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 100
      } ), {
        toggleSwitchOptions: {
          size: new Dimension2( switchHeight * 2, switchHeight )
        },
        tandem: providedOptions.tandem.createTandem( 'photonQuantitySwitch' )
      } );
    const firePhotonButton = new RoundPushButton( {
      content: new Text( PhotoelectricEffectFluent.photonQuantity.fireStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        fill: 'white'
      } ),
      listener: () => {
        firePhotonEmitter.emit();
      },
      baseColor: 'purple'
    } );

    const emitPhotonHBox = new HBox( {
      children: [ photonQuantitySwitch, firePhotonButton ],
      spacing: 10
    } );
    const wavelengthSlider = new LabeledWavelengthNumberControl( wavelengthProperty, {
      tandem: providedOptions.tandem.createTandem( 'wavelengthSlider' )
    } );

    const panelContent = new VBox( {
      children: [ emitPhotonHBox, wavelengthSlider ],
      spacing: 10
    } );

    super( panelContent, providedOptions );
  }
}