// Copyright 2026, University of Colorado Boulder

/**
 * Base view shared by all photoelectric-effect screens.
 *
 * Owns the common play-area transform and shared controls (materials selection, photon source panel + light source +
 * cord, play/pause/step, and reset). Subclasses contribute screen-specific play-area content (graphs, additional
 * controls) and provide the concrete light source / photon source panel via factory options.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import type EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import TinyProperty from '../../../../axon/js/TinyProperty.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import { toFixed } from '../../../../dot/js/util/toFixed.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import Shape from '../../../../kite/js/Shape.js';
import optionize from '../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import type TimeSpeed from '../../../../scenery-phet/js/TimeSpeed.js';
import ManualConstraint from '../../../../scenery/js/layout/constraints/ManualConstraint.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import type Tandem from '../../../../tandem/js/Tandem.js';
import PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import GraphAssemblyAccordionBox from '../../experiment/view/graph/GraphAssemblyAccordionBox.js';
import { wavelengthToEnergy } from '../model/PhotoelectricEffectUtils.js';
import CircuitNode from './CircuitNode.js';
import LightBeamNode from './LightBeamNode.js';
import MaterialsComboBox from './MaterialsComboBox.js';
import ParticleCanvasNode from './ParticleCanvasNode.js';

const TIME_CONTROL_NODE_FLOW_BOX_SPACING = 24;

// Vertical gap between the bottom of the materials combo box and the top of the target plate. Sized to clear the
// vacuum tube artwork, which extends a bit above the plate.
const MATERIALS_COMBO_BOX_PLATE_GAP = 30;

// Minimal interface every screen-specific light source node must satisfy.
export type LightSourceNodeInterface = Node & { readonly cordAttachmentPoint: Vector2 };

type SelfOptions = {

  // Factory for the screen-specific light source node. Receives the view-space position of the beam aperture.
  createLightSourceNode: ( beamStartCenter: Vector2 ) => LightSourceNodeInterface;

  // Factory for the screen-specific photon source panel. The base positions the returned node at leftTop.
  createPhotonSourceControl: ( tandem: Tandem ) => Node;

  // Whether individual photons are rendered. When false, a LightBeamNode stands in for the photons. Defaults to
  // always visible, so screens that emit single photons (e.g. Energy) are unaffected. Continuous-beam screens
  // pass the 'show photons' preference here.
  photonsVisibleProperty?: TReadOnlyProperty<boolean>;

  // Optional time-speed Property. When provided, the shared TimeControlNode includes Normal/Slow radio buttons.
  timeSpeedProperty?: EnumerationProperty<TimeSpeed> | null;

  // View x-coordinate where the target (model x = TARGET_X, the right face of the target plate) is placed.
  // All play-area elements (lamp, beam, circuit, plates, particles, photon source panel, materials combo box)
  // position themselves through the resulting transform, so changing this shifts the apparatus as a group
  // without moving layout-bounds-anchored controls.
  targetViewX?: number;
};

export type PhotoelectricEffectScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class PhotoelectricEffectScreenView extends ScreenView {

  // Static drawings that decorate and add context to each screen — typically the circuit artwork for the screen.
  protected readonly backgroundNode = new Node();

  protected readonly modelViewTransform: ModelViewTransform2;

  // Exposed for subclasses to wire into pdom order and to position screen-specific content relative to.
  protected readonly materialsComboBox: Node;
  protected readonly photonSourceControl: Node;
  protected readonly timeControlNode: TimeControlNode;
  protected readonly resetAllButton: Node;

  private readonly particleCanvasNode: ParticleCanvasNode;

  protected constructor( model: PhotoelectricEffectModel, providedOptions: PhotoelectricEffectScreenViewOptions ) {

    const options = optionize<PhotoelectricEffectScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // Photons are rendered by default; continuous-beam screens override this with the 'show photons' preference.
      photonsVisibleProperty: new TinyProperty( true ),
      timeSpeedProperty: null,

      // Center the circuit in the space between the left edge of the layout bounds and the left edge of the
      // right-aligned graph accordion box column.
      // TODO: 385 is a magic number. Eventually that needs to be derived from the graph accordion box width.
      targetViewX: CircuitNode.getTargetViewXToCenterCircuit( ( ScreenView.DEFAULT_LAYOUT_BOUNDS.width -
                                                                PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN -
                                                                385 ) / 2 )
    }, providedOptions );

    super( options );

    //------------------------------------------------------------------------
    // Background and model-view transform
    //------------------------------------------------------------------------

    // Added first so screen artwork drawn into it sits behind everything else.
    this.addChild( this.backgroundNode );

    // Model-view transform places the model x origin at the target plate, and a view origin at an x-offset with
    // y centered in the layout bounds. Screens may shift the whole apparatus via targetViewX.
    this.modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      new Vector2( PhotoelectricEffectConstants.TARGET_X, 0 ),           // model point — the target is the origin
      new Vector2( options.targetViewX, this.layoutBounds.centerY + 36 ), // view point
      PhotoelectricEffectConstants.MODEL_VIEW_SCALE
    );

    //------------------------------------------------------------------------
    // Target material controls: combo box above the target plate. Constructed before the photon source panel,
    // which left-aligns to it. Added to the scene graph after the photon source group for z-ordering.
    //------------------------------------------------------------------------

    this.materialsComboBox = new MaterialsComboBox( model.target.materialProperty, model.target.materials, this, {
      right: this.modelViewTransform.modelToViewX( PhotoelectricEffectConstants.TARGET_X ),
      bottom: this.modelViewTransform.modelToViewY( 0 ) - PhotoelectricEffectConstants.PLATE_BOUNDS.height / 2 -
              MATERIALS_COMBO_BOX_PLATE_GAP,
      tandem: options.tandem.createTandem( 'materialsComboBox' )
    } );
    this.addChild( this.materialsComboBox );

    //------------------------------------------------------------------------
    // Photon source group: panel (top, left-aligned with the materials combo box), light source lamp, connecting wire
    //------------------------------------------------------------------------

    this.photonSourceControl = options.createPhotonSourceControl( options.tandem.createTandem( 'photonSourceControl' ) );

    // Keep the panel left-aligned with the combo box when dynamic strings resize either node.
    ManualConstraint.create( this, [ this.photonSourceControl, this.materialsComboBox ],
      ( photonSourceControlProxy, materialsComboBoxProxy ) => {
        photonSourceControlProxy.leftTop = new Vector2(
          materialsComboBoxProxy.left,
          this.layoutBounds.top + PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN
        );
      } );

    // Light source node: aperture at local origin, placed at the beam-start view position.
    const beamStartCenter = this.modelViewTransform.modelToViewPosition( PhotoelectricEffectConstants.PHOTON_SOURCE_POSITION );
    const lightSourceNode = options.createLightSourceNode( beamStartCenter );

    // Wire from the left side of the lamp to the right side of the photon source panel. It travels directly
    // between the endpoints, with a slight curve
    const WIRE_CURVE = 25;
    const WIRE_PANEL_OVERLAP = 2;
    const photonSourceWireStart = lightSourceNode.cordAttachmentPoint;
    const getPhotonSourceWireEnd = ( photonSourceControlRightCenter: Vector2 ): Vector2 => {

      // Overlap with the panel so the wire appears tucked under the panel border.
      return photonSourceControlRightCenter.plusXY( -WIRE_PANEL_OVERLAP, 0 );
    };
    const createPhotonSourceWireShape = ( photonSourceWireEnd: Vector2 ): Shape => {
      return new Shape()
        .moveToPoint( photonSourceWireStart )
        .quadraticCurveToPoint(
          photonSourceWireStart.average( photonSourceWireEnd ).plusXY( 0, -WIRE_CURVE ),
          photonSourceWireEnd
        );
    };
    const photonSourceWireNode = new Path( createPhotonSourceWireShape(
      getPhotonSourceWireEnd( this.photonSourceControl.rightCenter )
    ), {
      stroke: PhotoelectricEffectColors.circuitWireColorProperty,
      lineWidth: 3
    } );
    ManualConstraint.create( this, [ this.photonSourceControl ], photonSourceControlProxy => {
      photonSourceWireNode.shape = createPhotonSourceWireShape(
        getPhotonSourceWireEnd( photonSourceControlProxy.rightCenter )
      );
    } );

    //------------------------------------------------------------------------
    // Light beam: stands in for the rendered photons when the 'show photons' preference is disabled. Added before
    // the lamp so the lamp occludes the beam's recessed starting edge, making the beam emerge from the aperture.
    //------------------------------------------------------------------------

    const lightBeamNode = new LightBeamNode(
      beamStartCenter,
      this.modelViewTransform.modelToViewXY( PhotoelectricEffectConstants.TARGET_X, 0 ),
      model.wavelengthProperty,
      model.photonSource.normalizedIntensityProperty,
      {
        visibleProperty: DerivedProperty.not( options.photonsVisibleProperty )
      }
    );
    this.addChild( lightBeamNode );

    // Added in this order for proper z-layering: beam behind the lamp, wire underneath the lamp, panel covers the
    // wire end.
    this.addChild( photonSourceWireNode );
    this.addChild( lightSourceNode );
    this.addChild( this.photonSourceControl );

    //------------------------------------------------------------------------
    // Particle canvas: renders photons and electrons in the play area
    //------------------------------------------------------------------------

    this.particleCanvasNode = new ParticleCanvasNode( model.photons, model.electrons, model.showElectronsProperty,
      options.photonsVisibleProperty, this.modelViewTransform,
      { canvasBounds: this.layoutBounds } );
    this.addChild( this.particleCanvasNode );

    //------------------------------------------------------------------------
    // Time controls and reset
    //------------------------------------------------------------------------

    this.timeControlNode = new TimeControlNode( model.isPlayingProperty, {
      timeSpeedProperty: options.timeSpeedProperty,
      flowBoxSpacing: TIME_CONTROL_NODE_FLOW_BOX_SPACING,
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => {
            model.stepForwardInTime( PhotoelectricEffectConstants.MANUAL_STEP_DT );
          }
        }
      },

      // Left align with combo box and photon source panel.
      leftBottom: new Vector2( this.materialsComboBox.left,
        this.layoutBounds.bottom - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN ),
      tandem: options.tandem.createTandem( 'timeControlNode' )
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      right: this.layoutBounds.maxX - PhotoelectricEffectConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.maxY - PhotoelectricEffectConstants.SCREEN_VIEW_Y_MARGIN,
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    this.addChild( this.timeControlNode );
    this.addChild( this.resetAllButton );

    // Default PDOM order for the control area. Subclasses may prepend additional items by reassigning this.
    this.pdomControlAreaNode.pdomOrder = [
      this.timeControlNode,
      this.resetAllButton
    ];

    //------------------------------------------------------------------------
    // Developer-only debug indicators (visible via ?dev query parameter)
    //------------------------------------------------------------------------

    if ( phet.chipper.queryParameters.dev ) {
      const devWorkFunctionStringProperty = new DerivedProperty( [ model.target.workFunctionProperty ],
        workFunction => `Work Function: ${toFixed( workFunction, 2 )} eV` );
      const devWorkFunctionPlusDepthStringProperty = new DerivedProperty(
        [ model.target.workFunctionProperty, model.target.bandDepthProperty ],
        ( workFunction, bandDepth ) => `Work Function + Band Depth: ${toFixed( workFunction + bandDepth, 2 )} eV` );
      const devPhotonEnergyStringProperty = new DerivedProperty( [ model.wavelengthProperty ],
        wavelength => `Photon Energy: ${toFixed( wavelengthToEnergy( wavelength ), 2 )} eV` );
      const devCurrentStringProperty = new DerivedProperty( [ model.currentProperty ],
        current => `Current: ${current} A` );

      this.addChild( new VBox( {
        align: 'left',
        spacing: 3,
        children: [
          new Text( devWorkFunctionStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } ),
          new Text( devWorkFunctionPlusDepthStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } ),
          new Text( devPhotonEnergyStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } ),
          new Text( devCurrentStringProperty, { font: PhotoelectricEffectConstants.READOUT_FONT } )
        ],
        leftTop: this.photonSourceControl.rightTop
      } ) );
    }
  }

  /**
   * Steps the view.
   * @param _dt - time step, in seconds
   */
  public override step( _dt: number ): void {
    this.particleCanvasNode.step();
  }
}
