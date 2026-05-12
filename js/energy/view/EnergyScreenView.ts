// Copyright 2026, University of Colorado Boulder

/**
 * View for the Energy screen of the photoelectric effect simulation. Contains a photon source and controls,
 * target plate, materials combo box, and graphs that depict the energy bands in the material.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import MaterialsComboBox from '../../common/view/MaterialsComboBox.js';
import GroundedCircuitNode from '../../intro/view/GroundedCircuitNode.js';
import EnergyModel from '../model/EnergyModel.js';
import EnergyGraphAccordionBox from './EnergyGraphAccordionBox.js';
import EnergyLightSourceNode from './EnergyLightSourceNode.js';
import EnergyPhotonSourcePanel from './EnergyPhotonSourcePanel.js';

type SelfOptions = EmptySelfOptions;
type EnergyScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class EnergyScreenView extends ScreenView {

  public constructor( model: EnergyModel, providedOptions: EnergyScreenViewOptions ) {
    const options = optionize<EnergyScreenViewOptions, SelfOptions, ScreenViewOptions>()( {}, providedOptions );
    super( options );

// model-view transform places the model x origin at the target plate, and a view origin at an x-offset with
    // y centered in the layout bounds
    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ), // model point - the target is the origin

      // View x coordinate of model x=0 (the left edge of the target plate), in pixels from the left edge of the screen.
      // TODO: Adjust once the target plate artwork and layout are finalized. https://github.com/phetsims/photoelectric-effect/issues/1
      new Vector2( 250, this.layoutBounds.centerY + 40 ),
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE );

    // Draw a grounded circuit and create associate target material ComboBox.
    const circuitNode = new GroundedCircuitNode( modelViewTransform );
    this.addChild( circuitNode );

    const materialsComboBox = new MaterialsComboBox( model.target.materialProperty, model.target.materials, this, {
      left: this.layoutBounds.left + PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.centerY,
      tandem: options.tandem.createTandem( 'materialsComboBox' )
    } );
    this.addChild( materialsComboBox );

    // Create the panel that controls photon emission as well as the accompanying lightSourceNode.
    const photonSourcePanel = new EnergyPhotonSourcePanel( model.wavelengthProperty, model.emitSinglePhotonProperty, {
      tandem: options.tandem.createTandem( 'photonSourcePanel' ),
      leftTop: this.layoutBounds.leftTop.plusXY( PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN, PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN )
    } );
    const beamStartCenter = modelViewTransform.modelToViewPosition( PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION );
    const lightSourceNode = new EnergyLightSourceNode( beamStartCenter );

    // S-shaped wire from the back of the lamp to the right side of the control panel.
    // First control point of cubic curve below the start and second control point of cubic curve above the end
    // create the S regardless of height difference.
    const S_BEND = 200;
    const photonSourceWireEnd = photonSourcePanel.rightCenter.plusXY( -2, 0 ); // So the wire end overlaps with the panel.
    const photonSourceWireNode = new Path( new Shape()
      .moveToPoint( lightSourceNode.cordAttachmentPoint )
      .cubicCurveToPoint(
        lightSourceNode.cordAttachmentPoint.plusXY( 0, -S_BEND ),
        photonSourceWireEnd.plusXY( 0, S_BEND ),
        photonSourceWireEnd
      ), {
      stroke: 'black',
      lineWidth: 3
    } );
    this.addChild( photonSourceWireNode );
    this.addChild( photonSourcePanel );
    this.addChild( lightSourceNode );

    const energyGraphAccordionBox = new EnergyGraphAccordionBox( model, {
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'energyGraphAccordionBox' )
    } );

    this.addChild( energyGraphAccordionBox );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( resetAllButton );

    // TODO: Define PDOM order for screen specific components
    this.pdomPlayAreaNode.setPDOMOrder( [
      photonSourcePanel,
      materialsComboBox
    ] );
    this.pdomControlAreaNode.setPDOMOrder( [
      resetAllButton
    ] );
  }
}
