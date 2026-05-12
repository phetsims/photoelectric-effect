// Copyright 2026, University of Colorado Boulder

/**
 * AccordionBox for the energy graph. Contains the active graph display and display mode controls.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import type { NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import { wavelengthToEnergy } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type EnergyModel from '../model/EnergyModel.js';
import EnergyBarGraphNode from './EnergyBarGraphNode.js';
import EnergyGraphDisplayModeRadioButtonGroup from './EnergyGraphDisplayModeRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

export type EnergyGraphAccordionBoxOptions =
  SelfOptions & NodeTranslationOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

// Vertical spacing between the plot and display mode controls.
const GRAPH_SECTION_SPACING = 8;

export default class EnergyGraphAccordionBox extends AccordionBox {

  public constructor( model: EnergyModel, providedOptions: EnergyGraphAccordionBoxOptions ) {

    const options = optionize<EnergyGraphAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 10,

      titleNode: new Text( PhotoelectricEffectFluent.screen.energyStringProperty, {
        font: PhotoelectricEffectConstants.PANEL_TITLE_FONT
      } )
    }, providedOptions );

    const barGraphNode = new EnergyBarGraphNode( model.target.workFunctionProperty, {
      visibleProperty: new DerivedProperty( [ model.energyGraphDisplayModeProperty ], displayMode => displayMode === 'barGraph' )
    } );

    // Show the current operating point until EnergyModel owns a sample history for this graph.
    Multilink.multilink( [ model.wavelengthProperty, model.target.workFunctionProperty ], ( wavelength, workFunction ) => {
      const potentialEnergy = -workFunction;
      const photonEnergy = wavelengthToEnergy( wavelength );
      const kineticEnergy = Math.max( 0, photonEnergy - workFunction );
      barGraphNode.setSampleData( 0, {
        potentialEnergy: potentialEnergy,
        photonEnergy: photonEnergy,
        kineticEnergy: kineticEnergy
      } );
      barGraphNode.setSampleData( 1, 'no-emit' );
      barGraphNode.setSampleData( 2, null );
    } );

    const displayModeRadioButtonGroup = new EnergyGraphDisplayModeRadioButtonGroup( model.energyGraphDisplayModeProperty, {
      tandem: options.tandem.createTandem( 'displayModeRadioButtonGroup' )
    } );

    const graphControlsNode = new VBox( {
      align: 'center',
      spacing: GRAPH_SECTION_SPACING,
      children: [
        barGraphNode,
        displayModeRadioButtonGroup
      ]
    } );

    super( graphControlsNode, options );
  }
}
