// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Experiment screen of the photoelectric effect simulation.
 * Extends the intro model with graph sample buffers for each experiment chart.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Material from '../../common/model/Material.js';
import { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import IntroModel from '../../intro/model/IntroModel.js';
import FrequencyEnergyGraphData from './FrequencyEnergyGraphData.js';
import IntensityCurrentGraphData from './IntensityCurrentGraphData.js';
import VoltageCurrentGraphData from './VoltageCurrentGraphData.js';

export default class ExperimentModel extends IntroModel {

  // Model components containing data points for the plots in this screen.
  public readonly intensityCurrentGraphData: IntensityCurrentGraphData;
  public readonly frequencyEnergyGraphData: FrequencyEnergyGraphData;
  public readonly voltageCurrentGraphData: VoltageCurrentGraphData;

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super( mysteryMaterials, providedOptions );

    this.intensityCurrentGraphData = new IntensityCurrentGraphData( this );
    this.frequencyEnergyGraphData = new FrequencyEnergyGraphData( this );
    this.voltageCurrentGraphData = new VoltageCurrentGraphData( this );
  }
}
