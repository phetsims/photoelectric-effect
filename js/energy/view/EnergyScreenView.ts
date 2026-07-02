// Copyright 2026, University of Colorado Boulder

/**
 * View for the Energy screen of the photoelectric effect simulation. Contains a photon source and controls,
 * target plate, materials combo box, and graphs that depict the energy bands in the material.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import derived from '../../../../axon/js/derived.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import CircuitNode from '../../common/view/CircuitNode.js';
import PhotoelectricEffectScreenView, { PhotoelectricEffectScreenViewOptions } from '../../common/view/PhotoelectricEffectScreenView.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import GroundedCircuitNode from '../../intro/view/GroundedCircuitNode.js';
import EnergyModel from '../model/EnergyModel.js';
import ElectronVelocityVectorsNode from './ElectronVelocityVectorsNode.js';
import EnergyGraphAccordionBox from './EnergyGraphAccordionBox.js';
import EnergyLightSourceNode from './EnergyLightSourceNode.js';
import EnergyPhotonSourcePanel from './EnergyPhotonSourcePanel.js';
import MaterialPropertiesAccordionBox from './MaterialPropertiesAccordionBox.js';

type SelfOptions = EmptySelfOptions;
type EnergyScreenViewOptions = SelfOptions & PickRequired<PhotoelectricEffectScreenViewOptions, 'tandem'>;

export default class EnergyScreenView extends PhotoelectricEffectScreenView {

  // Velocity vector arrows that lead each emitted electron.
  private readonly electronVelocityVectorsNode: ElectronVelocityVectorsNode;

  public constructor( model: EnergyModel, providedOptions: EnergyScreenViewOptions ) {
    const options = optionize<EnergyScreenViewOptions, SelfOptions, PhotoelectricEffectScreenViewOptions>()( {
      createLightSourceNode: beamStartCenter => new EnergyLightSourceNode( beamStartCenter ),
      createPhotonSourcePanel: tandem => new EnergyPhotonSourcePanel(
        model.wavelengthProperty,
        model.isSinglePhotonModeProperty,
        model.firePhotonEmitter,
        model.photonsTravelingProperty,
        { tandem: tandem }
      ),
      timeSpeedProperty: model.timeSpeedProperty
    }, providedOptions );
    super( model, options );

    // Grounded circuit artwork sits behind everything else.
    const groundedCircuitNode = new GroundedCircuitNode( this.modelViewTransform, model.target.materialProperty );
    this.backgroundNode.addChild( groundedCircuitNode );

    // Added after super() so the arrows layer in front of the electrons drawn by the particle canvas.
    this.electronVelocityVectorsNode = new ElectronVelocityVectorsNode(
      model.electrons, this.modelViewTransform, model.velocityVectorsVisibleProperty );
    this.addChild( this.electronVelocityVectorsNode );

    // Checkbox to toggle the electron velocity vectors.
    const velocityVectorsCheckbox = new Checkbox(
      model.velocityVectorsVisibleProperty,
      new Text( PhotoelectricEffectFluent.velocityVectorsStringProperty, {
        font: PhotoelectricEffectConstants.CONTENT_FONT,
        maxWidth: 170
      } ),
      {
        tandem: options.tandem.createTandem( 'velocityVectorsCheckbox' )
      }
    );
    this.addChild( velocityVectorsCheckbox );

    // Right-aligned with the circuit artwork, along the bottom of the screen — the same alignment as the electron
    // visibility checkboxes on the other screens. The constraint keeps the alignment when dynamic strings resize
    // the checkbox.
    ManualConstraint.create( this, [ velocityVectorsCheckbox ], velocityVectorsCheckboxProxy => {
      velocityVectorsCheckboxProxy.rightBottom = new Vector2(
        CircuitNode.getCircuitRightX( this.modelViewTransform ),
        this.layoutBounds.bottom - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
      );
    } );

    const energyGraphAccordionBox = new EnergyGraphAccordionBox( model, {
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'energyGraphAccordionBox' )
    } );

    this.addChild( energyGraphAccordionBox );

    const materialPropertiesAccordionBox = new MaterialPropertiesAccordionBox( model.target.materialProperty, {
      left: this.layoutBounds.minX + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: groundedCircuitNode.bottom + 15,
      visibleProperty: derived( model.target.materialProperty, material => material.materialType === MaterialType.CUSTOM ),
      tandem: options.tandem.createTandem( 'materialPropertiesAccordionBox' )
    } );

    this.addChild( materialPropertiesAccordionBox );

    // TODO: Define PDOM order for screen specific components
    this.pdomPlayAreaNode.setPDOMOrder( [
      this.photonSourcePanel,
      this.materialsComboBox,
      velocityVectorsCheckbox
    ] );
  }

  /**
   * Steps the view, syncing the velocity vector arrows to the current electrons after the base view step.
   * @param dt - time step, in seconds
   */
  public override step( dt: number ): void {
    super.step( dt );
    this.electronVelocityVectorsNode.update();
  }
}
