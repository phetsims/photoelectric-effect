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
import Node, { type NodeTranslationOptions } from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import { wavelengthToEnergy } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import type EnergyModel from '../model/EnergyModel.js';
import EnergyBarGraphNode from './EnergyBarGraphNode.js';
import EnergyDiagramNode from './EnergyDiagramNode.js';
import EnergyGraphDisplayModeRadioButtonGroup from './EnergyGraphDisplayModeRadioButtonGroup.js';

type SelfOptions = EmptySelfOptions;

export type EnergyGraphAccordionBoxOptions =
  SelfOptions & NodeTranslationOptions & PickRequired<AccordionBoxOptions, 'tandem'>;

// Vertical spacing between the plot and display mode controls.
const GRAPH_SECTION_SPACING = 8;

// Temporary sample offset that demonstrates an electron starting below the Fermi level in the conduction band.
const LOWER_CONDUCTION_BAND_SAMPLE_OFFSET = 1;

export default class EnergyGraphAccordionBox extends AccordionBox {

  public constructor( model: EnergyModel, providedOptions: EnergyGraphAccordionBoxOptions ) {

    const options = optionize<EnergyGraphAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()( {
      isDisposable: false,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 10,
      contentYMargin: 10,
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,

      titleNode: new Text( PhotoelectricEffectFluent.screen.energyStringProperty, {
        font: PhotoelectricEffectConstants.PANEL_TITLE_FONT
      } )
    }, providedOptions );

    const barGraphNode = new EnergyBarGraphNode( model.target.workFunctionProperty, {
      visibleProperty: new DerivedProperty( [ model.energyGraphDisplayModeProperty ], displayMode => displayMode === 'barGraph' )
    } );

    const energyDiagramNode = new EnergyDiagramNode(
      model.target.workFunctionProperty,
      model.energyDiagramLabelsVisibleProperty,
      model.energyDiagramWorkFunctionVisibleProperty,
      {
        visibleProperty: new DerivedProperty( [ model.energyGraphDisplayModeProperty ], displayMode => displayMode === 'energyDiagram' )
      } );
    barGraphNode.left = energyDiagramNode.left;

    // Show the current operating point until EnergyModel owns a sample history for this graph.
    Multilink.multilink( [ model.wavelengthProperty, model.target.workFunctionProperty ], ( wavelength, workFunction ) => {
      const potentialEnergy = -workFunction;
      const photonEnergy = wavelengthToEnergy( wavelength );
      const kineticEnergy = Math.max( 0, photonEnergy - workFunction );
      const sampleData = {
        potentialEnergy: potentialEnergy,
        photonEnergy: photonEnergy,
        kineticEnergy: kineticEnergy
      };
      const lowerConductionBandPotentialEnergy = potentialEnergy - LOWER_CONDUCTION_BAND_SAMPLE_OFFSET;
      const lowerConductionBandSampleData = {
        potentialEnergy: lowerConductionBandPotentialEnergy,
        photonEnergy: photonEnergy,
        kineticEnergy: Math.max( 0.5, photonEnergy + lowerConductionBandPotentialEnergy )
      };

      barGraphNode.setSampleData( 0, sampleData );
      energyDiagramNode.setSampleData( 0, sampleData );

      barGraphNode.setSampleData( 1, lowerConductionBandSampleData );
      energyDiagramNode.setSampleData( 1, lowerConductionBandSampleData );

      barGraphNode.setSampleData( 2, null );
      energyDiagramNode.setSampleData( 2, null );
    } );

    const displayModeRadioButtonGroup = new EnergyGraphDisplayModeRadioButtonGroup( model.energyGraphDisplayModeProperty, {
      tandem: options.tandem.createTandem( 'displayModeRadioButtonGroup' )
    } );

    const graphDisplayNode = new Node( {
      children: [
        barGraphNode,
        energyDiagramNode
      ]
    } );

    const graphControlsNode = new VBox( {
      align: 'center',
      spacing: GRAPH_SECTION_SPACING,
      children: [
        graphDisplayNode,
        displayModeRadioButtonGroup
      ]
    } );

    super( graphControlsNode, options );
  }
}
