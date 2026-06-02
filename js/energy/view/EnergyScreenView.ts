// Copyright 2026, University of Colorado Boulder

/**
 * View for the Energy screen of the photoelectric effect simulation. Contains a photon source and controls,
 * target plate, materials combo box, and graphs that depict the energy bands in the material.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import derived from '../../../../axon/js/derived.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectScreenView, { PhotoelectricEffectScreenViewOptions } from '../../common/view/PhotoelectricEffectScreenView.js';
import GroundedCircuitNode from '../../intro/view/GroundedCircuitNode.js';
import EnergyModel from '../model/EnergyModel.js';
import EnergyGraphAccordionBox from './EnergyGraphAccordionBox.js';
import EnergyLightSourceNode from './EnergyLightSourceNode.js';
import EnergyPhotonSourcePanel from './EnergyPhotonSourcePanel.js';
import MaterialPropertiesAccordionBox from './MaterialPropertiesAccordionBox.js';

type SelfOptions = EmptySelfOptions;
type EnergyScreenViewOptions = SelfOptions & PickRequired<PhotoelectricEffectScreenViewOptions, 'tandem'>;

export default class EnergyScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: EnergyModel, providedOptions: EnergyScreenViewOptions ) {
    const options = optionize<EnergyScreenViewOptions, SelfOptions, PhotoelectricEffectScreenViewOptions>()( {
      createLightSourceNode: beamStartCenter => new EnergyLightSourceNode( beamStartCenter ),
      createPhotonSourcePanel: tandem => new EnergyPhotonSourcePanel(
        model.wavelengthProperty,
        model.emitSinglePhotonProperty,
        model.firePhotonEmitter,
        model.photonsTravelingProperty,
        { tandem: tandem }
      )
    }, providedOptions );
    super( model, options );

    // Grounded circuit artwork sits behind everything else.
    this.backgroundNode.addChild( new GroundedCircuitNode( this.modelViewTransform ) );

    const energyGraphAccordionBox = new EnergyGraphAccordionBox( model, {
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'energyGraphAccordionBox' )
    } );

    this.addChild( energyGraphAccordionBox );

    const materialPropertiesAccordionBox = new MaterialPropertiesAccordionBox( model.target.materialProperty, {
      left: this.layoutBounds.minX + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      visibleProperty: derived( model.target.materialProperty, material => material.materialType === MaterialType.CUSTOM ),
      tandem: options.tandem.createTandem( 'materialPropertiesAccordionBox' )
    } );

    this.addChild( materialPropertiesAccordionBox );

    // TODO: Define PDOM order for screen specific components
    this.pdomPlayAreaNode.setPDOMOrder( [
      this.photonSourcePanel,
      this.materialsComboBox
    ] );
  }
}
