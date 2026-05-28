// Copyright 2026, University of Colorado Boulder

/**
 * View for the Experiment screen of the photoelectric effect simulation.
 * Includes graphs of model data and a battery to drive the circuit potential.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenSummaryContent from '../../../../joist/js/ScreenSummaryContent.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import BatteryNode from '../../../../scenery-phet/js/BatteryNode.js';
import NumberDisplay from '../../../../scenery-phet/js/NumberDisplay.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Battery from '../../common/model/Battery.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import CircuitNode from '../../common/view/CircuitNode.js';
import LightSourceNode from '../../common/view/LightSourceNode.js';
import PhotonBeamScreenView, { PhotonBeamScreenViewOptions } from '../../common/view/PhotonBeamScreenView.js';
import PhotonSourceControl from '../../common/view/PhotonSourceControl.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentModel from '../model/ExperimentModel.js';
import FrequencyEnergyGraphAccordionBox from './FrequencyEnergyGraphAccordionBox.js';
import GraphAssemblyAccordionBox from './GraphAssemblyAccordionBox.js';
import IntensityCurrentGraphAccordionBox from './IntensityCurrentGraphAccordionBox.js';
import VoltageCurrentGraphAccordionBox from './VoltageCurrentGraphAccordionBox.js';
import VoltageNumberControl from './VoltageNumberControl.js';

type SelfOptions = EmptySelfOptions;

type ExperimentScreenViewOptions = SelfOptions & PickRequired<PhotonBeamScreenViewOptions, 'tandem'>;

export default class ExperimentScreenView extends PhotonBeamScreenView {

  public constructor( model: ExperimentModel, providedOptions: ExperimentScreenViewOptions ) {

    const options = optionize<ExperimentScreenViewOptions, SelfOptions, PhotonBeamScreenViewOptions>()( {
      createLightSourceNode: beamStartCenter => new LightSourceNode( beamStartCenter ),
      createPhotonSourcePanel: tandem => new PhotonSourceControl( model.photonSource, { tandem: tandem } ),
      screenSummaryContent: new ScreenSummaryContent( {
        playAreaContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.playAreaStringProperty,
        controlAreaContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.controlAreaStringProperty,
        currentDetailsContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.currentDetails.leadingParagraphStringProperty,
        interactionHintContent: PhotoelectricEffectFluent.a11y.experimentScreen.screenSummary.interactionHintStringProperty
      } )
    }, providedOptions );

    super( model, options );

    //------------------------------------------------------------------------
    // Background circuit artwork
    //------------------------------------------------------------------------

    const circuitNode = new CircuitNode( this.modelViewTransform );
    this.backgroundNode.addChild( circuitNode );

    //------------------------------------------------------------------------
    // Right-column graphs: intensity-current, frequency-energy, voltage-current
    //------------------------------------------------------------------------

    const graphsVBox = new VBox( {
      spacing: GraphAssemblyAccordionBox.GRAPH_ASSEMBLY_SPACING,
      align: 'right',
      children: [

        // TODO: Rename these to AccordionBox now
        new IntensityCurrentGraphAccordionBox( model, {
          tandem: options.tandem.createTandem( 'intensityCurrentGraphAccordionBox' )
        } ),
        new FrequencyEnergyGraphAccordionBox( model, {
          tandem: options.tandem.createTandem( 'frequencyEnergyGraphAccordionBox' )
        } ),
        new VoltageCurrentGraphAccordionBox( model, {
          tandem: options.tandem.createTandem( 'voltageCurrentGraphAccordionBox' )
        } )
      ],
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      top: this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
    } );

    //------------------------------------------------------------------------
    // Battery / voltage control (centered between the plates, offset to make room for the ammeter)
    //------------------------------------------------------------------------
    const experimentViewCenterX = this.modelViewTransform.modelToViewX(
      PhotoelectricEffectConstants.TARGET_X + ( PhotoelectricEffectConstants.COLLECTOR_X - PhotoelectricEffectConstants.TARGET_X ) / 2
    );

    // TODO: link to voltageProperty and apply transform and bounds there.
    const battery = model.battery;
    const positiveBatteryNode = new BatteryNode( {
      size: new Dimension2( 110, 57 ),
      centerX: experimentViewCenterX - 20,
      centerY: circuitNode.bottom - CircuitNode.WIRE_LINE_WIDTH / 2,
      visibleProperty: battery.voltageProperty.derived( voltage => voltage >= 0 )
    } );
    const negativeBatteryNode = new BatteryNode( {
      matrix: Matrix3.X_REFLECTION,
      size: new Dimension2( 110, 57 ),
      centerX: experimentViewCenterX - 20,
      centerY: circuitNode.bottom - CircuitNode.WIRE_LINE_WIDTH / 2,
      visibleProperty: battery.voltageProperty.derived( voltage => voltage < 0 )
    } );

    const voltageNumberDisplay = new NumberDisplay( battery.voltageProperty, Battery.RANGE, {
      center: positiveBatteryNode.center,
      decimalPlaces: 2
    } );

    const voltageNumberControl = new VoltageNumberControl( model.battery, {
      tandem: options.tandem.createTandem( 'voltageNumberControl' ),
      centerBottom: new Vector2( positiveBatteryNode.centerX, this.layoutBounds.bottom - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN )
    } );

    this.addChild( graphsVBox );
    this.addChild( positiveBatteryNode );
    this.addChild( negativeBatteryNode );
    this.addChild( voltageNumberDisplay );
    this.addChild( voltageNumberControl );

    this.pdomPlayAreaNode.pdomOrder = [
      this.photonSourcePanel,
      this.materialsComboBox,
      voltageNumberControl,
      graphsVBox
    ];
  }
}
