// Copyright 2026, University of Colorado Boulder

/**
 * Model for the Experiment screen of the photoelectric effect simulation.
 * Extends the intro model with graph sample buffers for each experiment chart.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Material, { MaterialType } from '../../common/model/Material.js';
import PhotoelectricEffectModel, { PhotoelectricEffectModelOptions } from '../../common/model/PhotoelectricEffectModel.js';
import FrequencyEnergyGraphData from './FrequencyEnergyGraphData.js';
import IntensityCurrentGraphData from './IntensityCurrentGraphData.js';
import VoltageCurrentGraphData from './VoltageCurrentGraphData.js';

export default class ExperimentModel extends PhotoelectricEffectModel {

  // Model components containing data points for the plots in this screen.
  public readonly intensityCurrentGraphData: IntensityCurrentGraphData;
  public readonly frequencyEnergyGraphData: FrequencyEnergyGraphData;
  public readonly voltageCurrentGraphData: VoltageCurrentGraphData;

  public constructor( mysteryMaterials: Material[], providedOptions: PhotoelectricEffectModelOptions ) {
    super(
      mysteryMaterials,
      [ new Material( MaterialType.CUSTOM, { tandem: providedOptions.tandem.createTandem( 'custom' ) } ) ],
      providedOptions
    );

    this.intensityCurrentGraphData = new IntensityCurrentGraphData( this, {
      tandem: providedOptions.tandem.createTandem( 'intensityCurrentGraphData' )
    } );
    this.frequencyEnergyGraphData = new FrequencyEnergyGraphData( this, {
      tandem: providedOptions.tandem.createTandem( 'frequencyEnergyGraphData' )
    } );
    this.voltageCurrentGraphData = new VoltageCurrentGraphData( this, {
      tandem: providedOptions.tandem.createTandem( 'voltageCurrentGraphData' )
    } );
  }
}
