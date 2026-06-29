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
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import type { PaintableOptions } from '../../../../../scenery/js/nodes/Paintable.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import type Color from '../../../../../scenery/js/util/Color.js';
import NodePattern from '../../../../../scenery/js/util/NodePattern.js';
import PhotoelectricEffectColors from '../../../common/PhotoelectricEffectColors.js';
import EnergyGraphSample from '../../model/EnergyGraphSample.js';
import EnergyGraphLayout from '../EnergyGraphLayout.js';
import NoElectronEjectedIconNode from '../NoElectronEjectedIconNode.js';

// Bar layout in model x coordinates.
const BAR_X_OFFSET = 0.18;
const BAR_WIDTH = 9;

// In-plot icon position shown when a sample exists, but the photon did not eject an electron. This is in model units.
const NO_ELECTRON_EJECTED_ICON_CENTER_MODEL_Y = 8.0;

const NO_ELECTRON_EJECTED_ICON_WIDTH = 32;
const PHOTON_ENERGY_PATTERN_TILE_SIZE = 8;
const PHOTON_ENERGY_PATTERN_RESOLUTION = 2;

export default class EnergySampleBarPlotNode extends Node {

  // Persistent Bamboo data set in binding, photon, kinetic energy order. BarPlot keeps references to the Vector2
  // instances, so this array is mutated instead of replaced.
  private readonly dataSet: Vector2[];

  // Bar display for recorded samples.
  private readonly barPlot: BarPlot;

  // Icon shown when sample data exists but no electron was emitted.
  private readonly noElectronEjectedIconNode: NoElectronEjectedIconNode;

  // Pattern fill for the photon-energy bar when the photon did not eject an electron.
  private photonEnergyPattern: NodePattern;

  /**
   * @param chartTransform - Translates sample and energy coordinates into the shared chart view.
   * @param sample - Persistent sample slot whose Properties drive bar visibility and heights.
   * @param sampleIndex - Zero-based sample slot index represented by this plot.
   */
  public constructor( chartTransform: ChartTransform, sample: EnergyGraphSample, sampleIndex: number ) {
    super();

    this.dataSet = EnergySampleBarPlotNode.createDataSet( sampleIndex );
    this.photonEnergyPattern = EnergySampleBarPlotNode.createPhotonEnergyPattern(
      PhotoelectricEffectColors.photonEnergyGraphColorProperty.value
    );

    this.barPlot = new BarPlot( chartTransform, this.dataSet, {
      barWidth: BAR_WIDTH,
      pointToPaintableFields: point => this.getBarPaintableOptions(
        sampleIndex, sample.electronEmittedProperty.value, point
      )
    } );

    this.noElectronEjectedIconNode = new NoElectronEjectedIconNode( NO_ELECTRON_EJECTED_ICON_WIDTH, {
      visible: false,
      center: new Vector2(
        chartTransform.modelToViewX( EnergyGraphLayout.getSampleCenterX( sampleIndex ) ),
        chartTransform.modelToViewY( NO_ELECTRON_EJECTED_ICON_CENTER_MODEL_Y )
      )
    } );

    this.children = [
      this.barPlot,
      this.noElectronEjectedIconNode
    ];

    Multilink.multilink( [
      sample.hasDataProperty,
      sample.bindingEnergyProperty,
      sample.photonEnergyProperty,
      sample.kineticEnergyProperty,
      sample.electronEmittedProperty
    ], ( hasData, bindingEnergy, photonEnergy, kineticEnergy, electronEmitted ) => {
      this.noElectronEjectedIconNode.visible = hasData && !electronEmitted;
      this.barPlot.visible = hasData;
      this.updateDataSet( bindingEnergy, photonEnergy, kineticEnergy );
      this.barPlot.update();
      this.updateBarVisibility( electronEmitted );
    } );

    // The color Property can potentially change at runtime, re-generate pattern and update bars if necesssary.
    PhotoelectricEffectColors.photonEnergyGraphColorProperty.lazyLink( photonEnergyColor => {
      this.photonEnergyPattern = EnergySampleBarPlotNode.createPhotonEnergyPattern( photonEnergyColor );
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
   * Determines bar colors from the fixed x order for a sample plot.
   */
  private getBarPaintableOptions( sampleIndex: number, electronEmitted: boolean, point: Vector2 ): PaintableOptions {
    const centerX = EnergyGraphLayout.getSampleCenterX( sampleIndex );

    // Bars are ordered by x position within each sample group: binding on the left, photon in the center,
    // kinetic on the right.
    const fill = point.x < centerX ? PhotoelectricEffectColors.bindingEnergyGraphColorProperty :
                 point.x > centerX ? PhotoelectricEffectColors.kineticEnergyColorProperty :
                 electronEmitted ? PhotoelectricEffectColors.photonEnergyGraphColorProperty :
                 this.photonEnergyPattern;

    return {
      fill: fill,
      stroke: PhotoelectricEffectColors.iconStrokeColorProperty
    };
  }

  /**
   * Creates the hashed fill for a photon-energy bar that did not eject an electron.
   */
  private static createPhotonEnergyPattern( photonEnergyColor: Color ): NodePattern {
    return new NodePattern(
      new Node( {
        children: [
          new Rectangle( 0, 0, PHOTON_ENERGY_PATTERN_TILE_SIZE, PHOTON_ENERGY_PATTERN_TILE_SIZE, {
            fill: photonEnergyColor
          } ),
          new Line( 0, 0, PHOTON_ENERGY_PATTERN_TILE_SIZE, PHOTON_ENERGY_PATTERN_TILE_SIZE, {
            stroke: 'white',
            lineWidth: 1
          } ),
          new Line( -PHOTON_ENERGY_PATTERN_TILE_SIZE, 0, 0, PHOTON_ENERGY_PATTERN_TILE_SIZE, {
            stroke: 'white',
            lineWidth: 1
          } ),
          new Line(
            PHOTON_ENERGY_PATTERN_TILE_SIZE, 0,
            2 * PHOTON_ENERGY_PATTERN_TILE_SIZE, PHOTON_ENERGY_PATTERN_TILE_SIZE, {
              stroke: 'white',
              lineWidth: 1
            } )
        ]
      } ),
      PHOTON_ENERGY_PATTERN_RESOLUTION,
      0,
      0,
      PHOTON_ENERGY_PATTERN_TILE_SIZE,
      PHOTON_ENERGY_PATTERN_TILE_SIZE
    );
  }

  /**
   * Updates the persistent Bamboo data set by mutating the Vector2 instances that BarPlot already references.
   */
  private updateDataSet( bindingEnergy: number, photonEnergy: number, kineticEnergy: number ): void {
    this.dataSet[ 0 ].setY( bindingEnergy );
    this.dataSet[ 1 ].setY( photonEnergy );
    this.dataSet[ 2 ].setY( kineticEnergy );
  }

  /**
   * Shows binding and photon-energy bars when the sample did not produce an emitted electron.
   */
  private updateBarVisibility( electronEmitted: boolean ): void {
    this.barPlot.rectangles[ 0 ].visible = true;
    this.barPlot.rectangles[ 1 ].visible = true;
    this.barPlot.rectangles[ 2 ].visible = electronEmitted;
  }
}
