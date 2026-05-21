// Copyright 2026, University of Colorado Boulder

/**
 * Energy diagram display for the Energy screen. Each sample shows an electron's initial energy in the conduction
 * band and its emitted kinetic energy above the zero-energy reference line.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import type BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import type { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import ChartTransform from '../../../../bamboo/js/ChartTransform.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import BracketNode from '../../../../scenery-phet/js/BracketNode.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node, { type NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import RichText from '../../../../scenery/js/nodes/RichText.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import PhotoelectricEffectColors from '../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../common/PhotoelectricEffectConstants.js';
import EnergyGraphData from '../model/EnergyGraphData.js';
import EnergyGraphDisplayProperties from '../model/EnergyGraphDisplayProperties.js';
import EnergyGraphSample, { type EnergyGraphSampleData } from '../model/EnergyGraphSample.js';

type SelfOptions = EmptySelfOptions;
export type EnergyDiagramNodeOptions = SelfOptions & NodeOptions;

// View size of the shared chart rectangle.
const CHART_VIEW_WIDTH = 120;
const CHART_VIEW_HEIGHT = 360;

// Horizontal layout in model x coordinates. Sample indices are zero-based, while model x positions are one-based.
const getSampleCenterX = ( sampleIndex: number ): number => sampleIndex + 1;

// Marker and label layout.
const ELECTRON_MARKER_RADIUS = 5;
const Y_TICK_LABEL_MARGIN = 5;
const WORK_FUNCTION_MARKER_X = CHART_VIEW_WIDTH + 14;
const WORK_FUNCTION_MARKER_CAP_WIDTH = 12;
const WORK_FUNCTION_MARKER_LINE_WIDTH = 2;

export default class EnergyDiagramNode extends Node {

  // Translates energy and sample coordinates into the shared chart view.
  private readonly chartTransform: ChartTransform;

  // Container for graph decorations that depend on the work function.
  private readonly graphDecorationNode: Node;

  // Shaded region that represents the conduction band.
  private readonly conductionBandNode: Rectangle;

  // Persistent graph decorations that can be repositioned as the work function changes. These are created once
  // to avoid disposing/reconstructing every change.
  private readonly energyAxisNode: ArrowNode;
  private readonly conductionBandBottomLine: Line;
  private readonly fermiLevelLine: Line;
  private readonly zeroEnergyLine: Line;
  private readonly workFunctionMarkerLine: Line;
  private readonly workFunctionMarkerFermiCap: Line;
  private readonly workFunctionMarkerZeroCap: Line;
  private readonly workFunctionLabel: Text;
  private readonly conductionBandLabel: RichText;

  // BracketNode does not expose a way to mutate its shape, so it is replaced when its length changes.
  private conductionBandBracket: BracketNode | null = null;

  // Parent Nodes for electron markers for the fixed set of recorded energy samples.
  private readonly sampleNodes: Node[];

  // Labels for the special y values shown on the graph.
  private readonly zeroTickLabel: Text;
  private readonly fermiLevelTickLabel: Text;

  // Listener retained so it can be removed on disposal.
  private readonly workFunctionListener: () => void;

  // Work function source used for the Fermi level marker.
  private readonly workFunctionProperty: TReadOnlyProperty<number>;

  // Whether Fermi level and conduction band labels are visible.
  private readonly labelsVisibleProperty: BooleanProperty;

  // Whether the work function label is visible.
  private readonly workFunctionVisibleProperty: BooleanProperty;

  public constructor( workFunctionProperty: TReadOnlyProperty<number>,
                      labelsVisibleProperty: BooleanProperty,
                      workFunctionVisibleProperty: BooleanProperty,
                      providedOptions: EnergyDiagramNodeOptions ) {

    const options = optionize<EnergyDiagramNodeOptions, SelfOptions, NodeOptions>()( {
      isDisposable: false
    }, providedOptions );

    super( options );

    this.workFunctionProperty = workFunctionProperty;
    this.labelsVisibleProperty = labelsVisibleProperty;
    this.workFunctionVisibleProperty = workFunctionVisibleProperty;

    this.chartTransform = new ChartTransform( {
      viewWidth: CHART_VIEW_WIDTH,
      viewHeight: CHART_VIEW_HEIGHT,
      modelXRange: new Range( 0.5, EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES + 0.5 ),
      modelYRange: EnergyGraphDisplayProperties.MODEL_Y_RANGE
    } );

    this.conductionBandNode = new Rectangle( 0, 0, CHART_VIEW_WIDTH, 0, {
      fill: 'white'
    } );

    this.energyAxisNode = new ArrowNode( 0, CHART_VIEW_HEIGHT, 0, 0, {
      fill: PhotoelectricEffectColors.iconStrokeColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1,
      tailWidth: 1,
      headWidth: 9,
      headHeight: 9
    } );

    this.conductionBandBottomLine = new Line( 0, 0, CHART_VIEW_WIDTH, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 2, 2 ]
    } );

    this.fermiLevelLine = new Line( 0, 0, CHART_VIEW_WIDTH, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 2, 2 ]
    } );

    this.zeroEnergyLine = new Line( 0, 0, CHART_VIEW_WIDTH, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5,
      lineDash: [ 8, 5 ]
    } );

    this.workFunctionMarkerLine = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionMarkerFermiCap = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionMarkerZeroCap = new Line( 0, 0, 0, 0, {
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: WORK_FUNCTION_MARKER_LINE_WIDTH
    } );

    this.workFunctionLabel = new Text( MathSymbols.PHI, {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: this.workFunctionVisibleProperty
    } );

    // TODO: i18n
    this.conductionBandLabel = new RichText( 'Conduction Band', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      lineWrap: 90
    } );

    this.graphDecorationNode = new Node( {
      children: [
        this.conductionBandNode,
        this.energyAxisNode,
        this.conductionBandBottomLine,
        this.fermiLevelLine,
        this.zeroEnergyLine,
        new Node( {
          visibleProperty: this.workFunctionVisibleProperty,
          children: [
            this.workFunctionMarkerLine,
            this.workFunctionMarkerFermiCap,
            this.workFunctionMarkerZeroCap,
            this.workFunctionLabel
          ]
        } )
      ]
    } );

    this.sampleNodes = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, () => new Node() );

    const plotLayer = new Node( {
      children: [
        this.graphDecorationNode,
        ...this.sampleNodes
      ]
    } );

    this.zeroTickLabel = new Text( '0', {
      font: PhotoelectricEffectConstants.CONTENT_FONT
    } );

    // TODO: i18n
    this.fermiLevelTickLabel = new Text( 'Fermi Level', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      visibleProperty: this.labelsVisibleProperty
    } );

    // TODO: i18n
    const yAxisLabel = new Text( 'Energy (eV)', {
      font: PhotoelectricEffectConstants.CONTENT_FONT,
      rotation: -Math.PI / 2
    } );

    const xLabels = _.times( EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, sampleIndex => {
      const label = new Text( `${sampleIndex + 1}`, {
        font: PhotoelectricEffectConstants.CONTENT_FONT
      } );
      label.centerTop = new Vector2(
        this.chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) ),
        CHART_VIEW_HEIGHT + 5
      );
      return label;
    } );

    const chartNode = new Node( {
      children: [
        plotLayer,
        this.zeroTickLabel,
        this.fermiLevelTickLabel,
        ...xLabels
      ]
    } );

    yAxisLabel.rightCenter = new Vector2( -96, CHART_VIEW_HEIGHT / 2 );

    this.children = [
      new Node( {
        children: [
          yAxisLabel,
          chartNode
        ]
      } )
    ];

    this.workFunctionListener = () => {
      this.updateGraphDecorations();
    };
    workFunctionProperty.link( this.workFunctionListener );

    this.updateGraphDecorations();
  }

  /**
   * Links one persistent sample slot to its corresponding markers.
   */
  public setSample( sampleIndex: number, sample: EnergyGraphSample ): void {
    assert && assert( sampleIndex >= 0 && sampleIndex < EnergyGraphData.NUMBER_OF_ENERGY_GRAPH_SAMPLES, 'sampleIndex out of range' );

    // Creates a multilink to the various data Properties
    Multilink.multilink( [
      sample.hasDataProperty,
      sample.potentialEnergyProperty,
      sample.photonEnergyProperty,
      sample.kineticEnergyProperty
    ], ( hasData, potentialEnergy, photonEnergy, kineticEnergy ) => {
      if ( !hasData || kineticEnergy === 0 ) {
        this.sampleNodes[ sampleIndex ].children = [];
      }
      else {

        // TODO: Why create new Nodes every change?
        this.sampleNodes[ sampleIndex ].children = EnergyDiagramNode.createSampleMarkers(
          this.chartTransform,
          sampleIndex,
          {
            potentialEnergy: potentialEnergy,
            photonEnergy: photonEnergy,
            kineticEnergy: kineticEnergy
          }
        );
      }
    } );
  }

  /**
   * Repositions graph decorations that depend on the active material's work function.
   */
  private updateGraphDecorations(): void {
    const zeroY = this.chartTransform.modelToViewY( 0 );
    const fermiLevelY = this.chartTransform.modelToViewY( -this.workFunctionProperty.value );
    const conductionBandBottomY = this.chartTransform.modelToViewY( -8 );

    this.zeroTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, zeroY );
    this.fermiLevelTickLabel.rightCenter = new Vector2( -Y_TICK_LABEL_MARGIN, fermiLevelY );

    this.conductionBandNode.setRect(
      0,
      fermiLevelY,
      CHART_VIEW_WIDTH,
      conductionBandBottomY - fermiLevelY
    );
    this.conductionBandNode.fill = new LinearGradient( 0, fermiLevelY, 0, conductionBandBottomY )
      .addColorStop( 0, 'white' )
      .addColorStop( 1, PhotoelectricEffectColors.conductionBandEnergyDiagramColorProperty );

    this.conductionBandBottomLine.setLine( 0, conductionBandBottomY, CHART_VIEW_WIDTH, conductionBandBottomY );
    this.fermiLevelLine.setLine( 0, fermiLevelY, CHART_VIEW_WIDTH, fermiLevelY );
    this.zeroEnergyLine.setLine( 0, zeroY, CHART_VIEW_WIDTH, zeroY );

    this.workFunctionMarkerLine.setLine( WORK_FUNCTION_MARKER_X, fermiLevelY, WORK_FUNCTION_MARKER_X, zeroY );
    this.workFunctionMarkerFermiCap.setLine(
      WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY,
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, fermiLevelY
    );
    this.workFunctionMarkerZeroCap.setLine(
      WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY,
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2, zeroY
    );
    this.workFunctionLabel.leftCenter = new Vector2(
      WORK_FUNCTION_MARKER_X + WORK_FUNCTION_MARKER_CAP_WIDTH / 2 + 4,
      ( fermiLevelY + zeroY ) / 2
    );

    // We must dispose and create a new BracketNode because it doesn't support shape changes once constructed.
    this.disposeConductionBandBracket();

    const conductionBandBracketX = WORK_FUNCTION_MARKER_X - WORK_FUNCTION_MARKER_CAP_WIDTH / 2;
    const conductionBandBracketVerticalInset = 6;
    const conductionBandBracketMinLength = 18;
    const conductionBandBracketEndRadius = 3;
    const conductionBandBracketTipRadius = 4;
    const conductionBandBracketLabelSpacing = 4;
    this.conductionBandBracket = new BracketNode( {
      orientation: 'right',
      labelNode: this.conductionBandLabel,
      bracketLength: Math.max(
        conductionBandBottomY - fermiLevelY - 2 * conductionBandBracketVerticalInset,
        conductionBandBracketMinLength
      ),
      bracketEndRadius: conductionBandBracketEndRadius,
      bracketTipRadius: conductionBandBracketTipRadius,
      bracketStroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      bracketLineWidth: 1.5,
      spacing: conductionBandBracketLabelSpacing,
      visibleProperty: this.labelsVisibleProperty
    } );
    this.conductionBandBracket.leftCenter = new Vector2(
      conductionBandBracketX,
      ( fermiLevelY + conductionBandBottomY ) / 2
    );
    this.graphDecorationNode.addChild( this.conductionBandBracket );
  }

  /**
   * Disposes the generated conduction-band bracket before the next bracket is created.
   * We typically create reusable Nodes to avoid disposal in this class, but BracketNode does not support
   * changes once constructed.
   */
  private disposeConductionBandBracket(): void {
    if ( this.conductionBandBracket ) {
      this.graphDecorationNode.removeChild( this.conductionBandBracket );
      this.conductionBandBracket.dispose();
      this.conductionBandBracket = null;
    }
  }

  /**
   * Creates the electron markers for one sample. A white circle marks the electron's initial energy in the
   * conduction band, and the shaded blue electron marks its emitted kinetic energy after photon collision.
   */
  private static createSampleMarkers( chartTransform: ChartTransform,
                                      sampleIndex: number,
                                      data: EnergyGraphSampleData ): Node[] {
    const sampleCenterX = chartTransform.modelToViewX( getSampleCenterX( sampleIndex ) );

    const initialEnergyMarker = new Circle( ELECTRON_MARKER_RADIUS, {
      fill: 'white',
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty,
      lineWidth: 1.5
    } );
    initialEnergyMarker.center = new Vector2( sampleCenterX, chartTransform.modelToViewY( data.potentialEnergy ) );

    const emittedEnergyMarker = EnergyDiagramNode.createElectronMarker();
    emittedEnergyMarker.center = new Vector2( sampleCenterX, chartTransform.modelToViewY( data.kineticEnergy ) );

    return [ initialEnergyMarker, emittedEnergyMarker ];
  }

  /**
   * Creates a shaded electron marker, matching the light direction used by ElectronNode in Models of the Hydrogen Atom.
   */
  private static createElectronMarker(): ShadedSphereNode {
    return new ShadedSphereNode( 2 * ELECTRON_MARKER_RADIUS, {
      mainColor: PhotoelectricEffectColors.electronBaseColorProperty,
      highlightColor: PhotoelectricEffectColors.electronHighlightColorProperty,
      highlightXOffset: 0,
      highlightYOffset: 0.4,
      isDisposable: false
    } );
  }

  public override dispose(): void {
    this.disposeConductionBandBracket();
    this.conductionBandLabel.dispose();

    this.workFunctionProperty.unlink( this.workFunctionListener );
    super.dispose();
    this.chartTransform.dispose();
  }
}
