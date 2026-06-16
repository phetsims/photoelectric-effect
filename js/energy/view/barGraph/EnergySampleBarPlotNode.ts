// Copyright 2026, University of Colorado Boulder

/**
 * Plot node for one sample slot in the Energy screen bar graph.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import BarPlot from '../../../../../bamboo/js/BarPlot.js';
import ChartTransform from '../../../../../bamboo/js/ChartTransform.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import type { PaintableOptions } from '../../../../../scenery/js/nodes/Paintable.js';
import RichText from '../../../../../scenery/js/nodes/RichText.js';
import Panel from '../../../../../sun/js/Panel.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import PhotoelectricEffectConstants from '../../../common/PhotoelectricEffectConstants.js';
import PhotoelectricEffectFluent from '../../../PhotoelectricEffectFluent.js';
import EnergyGraphSample from '../../model/EnergyGraphSample.js';
import EnergyGraphLayout from '../EnergyGraphLayout.js';

// Bar layout in model x coordinates.
const BAR_X_OFFSET = 0.18;
const BAR_WIDTH = 9;

// In-plot message shown when a sample exists, but the photon did not eject an electron. This is in model units.
const NO_ELECTRON_EJECTED_PANEL_CENTER_MODEL_Y = 8.0;

/**
 * Owns the persistent Bamboo data set, bar plot, and no-electron message for a single Energy graph sample.
 */
export default class EnergySampleBarPlotNode extends Node {

  // Persistent Bamboo data set in potential, photon, kinetic energy order. BarPlot keeps references to the Vector2
  // instances, so this array is mutated instead of replaced.
  private readonly dataSet: Vector2[];

  // Bar display for samples that produced an emitted electron.
  private readonly barPlot: BarPlot;

  // Message shown when sample data exists but no electron was emitted.
  private readonly noElectronEjectedPanel: Panel;

  /**
   * @param chartTransform - Translates sample and energy coordinates into the shared chart view.
   * @param sample - Persistent sample slot whose Properties drive bar visibility and heights.
   * @param sampleIndex - Zero-based sample slot index represented by this plot.
   */
  public constructor( chartTransform: ChartTransform, sample: EnergyGraphSample, sampleIndex: number ) {
    super();

    this.dataSet = EnergySampleBarPlotNode.createDataSet( sampleIndex );

    this.barPlot = new BarPlot( chartTransform, this.dataSet, {
      barWidth: BAR_WIDTH,
      pointToPaintableFields: point => EnergySampleBarPlotNode.getBarPaintableOptions( sampleIndex, point )
    } );

    this.noElectronEjectedPanel = EnergySampleBarPlotNode.createNoElectronEjectedPanel(
      chartTransform.modelToViewX( EnergyGraphLayout.getSampleCenterX( sampleIndex ) ),
      chartTransform.modelToViewY( NO_ELECTRON_EJECTED_PANEL_CENTER_MODEL_Y )
    );

    this.children = [
      this.barPlot,
      this.noElectronEjectedPanel
    ];

    Multilink.multilink( [
      sample.hasDataProperty,
      sample.potentialEnergyProperty,
      sample.photonEnergyProperty,
      sample.kineticEnergyProperty,
      sample.electronEmittedProperty
    ], ( hasData, potentialEnergy, photonEnergy, kineticEnergy, electronEmitted ) => {
      this.noElectronEjectedPanel.visible = hasData && !electronEmitted;
      this.barPlot.visible = hasData && electronEmitted;
      this.updateDataSet( potentialEnergy, photonEnergy, kineticEnergy );
      this.barPlot.update();
    } );
  }

  /**
   * Creates the persistent Bamboo data set for one sample, in the required energy order.
   */
  private static createDataSet( sampleIndex: number ): Vector2[] {
    const centerX = EnergyGraphLayout.getSampleCenterX( sampleIndex );

    return [
      new Vector2( centerX - BAR_X_OFFSET, 0 ),
      new Vector2( centerX, 0 ),
      new Vector2( centerX + BAR_X_OFFSET, 0 )
    ];
  }

  /**
   * Creates the in-plot label for a sample that was recorded without electron emission.
   */
  private static createNoElectronEjectedPanel( centerX: number, centerY: number ): Panel {

    const text = new RichText( PhotoelectricEffectFluent.energy.graph.noElectronEjectedStringProperty, {
      font: PhotoelectricEffectConstants.READOUT_FONT,
      lineWrap: 80
    } );

    const panel = new Panel( text, {
      fill: PhotoelectricEffectColors.screenBackgroundColorProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty.value,
      cornerRadius: 4,
      xMargin: 6,
      yMargin: 6,
      visible: false
    } );
    panel.center = new Vector2( centerX, centerY );

    return panel;
  }

  /**
   * Determines bar colors from the fixed x order for a sample plot.
   */
  private static getBarPaintableOptions( sampleIndex: number, point: Vector2 ): PaintableOptions {
    const centerX = EnergyGraphLayout.getSampleCenterX( sampleIndex );

    // Bars are ordered by x position within each sample group: potential on the left, photon in the center,
    // kinetic on the right.
    const fillProperty = point.x < centerX ? PhotoelectricEffectColors.potentialEnergyGraphColorProperty :
                         point.x > centerX ? PhotoelectricEffectColors.kineticEnergyGraphColorProperty :
                         PhotoelectricEffectColors.photonEnergyGraphColorProperty;

    return {
      fill: fillProperty,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty
    };
  }

  /**
   * Updates the persistent Bamboo data set by mutating the Vector2 instances that BarPlot already references.
   */
  private updateDataSet( potentialEnergy: number, photonEnergy: number, kineticEnergy: number ): void {
    this.dataSet[ 0 ].setY( potentialEnergy );
    this.dataSet[ 1 ].setY( photonEnergy );
    this.dataSet[ 2 ].setY( kineticEnergy );
  }
}
