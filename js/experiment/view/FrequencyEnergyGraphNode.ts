// Copyright 2026, University of Colorado Boulder

/**
 * FrequencyEnergyGraphNode configures an ExperimentGraphNode for a frequency/energy plot and
 * appends data points whenever the photon wavelength changes. It clears plotted data when
 * non-wavelength inputs change to keep the curve consistent.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import optionize, { type EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import WithRequired from '../../../../phet-core/js/types/WithRequired.js';
import type { NodeOptions } from '../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import type PhotoelectricEffectModel from '../../common/model/PhotoelectricEffectModel.js';
import { wavelengthToEnergy } from '../../common/model/PhotoelectricEffectUtils.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';
import ExperimentGraphNode, { type ExperimentGraphNodeOptions } from './ExperimentGraphNode.js';

type SelfOptions = EmptySelfOptions;

export type FrequencyEnergyGraphNodeOptions = SelfOptions & WithRequired<NodeOptions, 'tandem'>;

export default class FrequencyEnergyGraphNode extends ExperimentGraphNode {

  // Disposes listeners for data updates.
  private readonly disposeFrequencyEnergyGraphNode: () => void;

  /**
   * @param model - Provides the photon wavelength and work function inputs.
   * @param providedOptions - Node options for layout and instrumentation.
   */
  public constructor( model: PhotoelectricEffectModel, providedOptions?: FrequencyEnergyGraphNodeOptions ) {

    const zoomRangePairs = [
      {
        xRange: new Range( 0, 1 ),
        yRange: new Range( 0, 1 )
      },
      {
        xRange: new Range( 0, 0.5 ),
        yRange: new Range( 0, 0.5 )
      },
      {
        xRange: new Range( 0, 0.25 ),
        yRange: new Range( 0, 0.25 )
      }
    ];

    const options = optionize<FrequencyEnergyGraphNodeOptions, SelfOptions, NodeOptions>()( {
    }, providedOptions );

    const graphOptions: ExperimentGraphNodeOptions = {
      zoomRangePairs: zoomRangePairs,
      xAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.frequencyAxisLabelStringProperty,
      yAxisLabelStringProperty: PhotoelectricEffectFluent.experiment.graph.energyAxisLabelStringProperty,

      // TODO: This option is a little strange. We needed it so that the label did not overlap with the
      //   ExpandCollapseButton. Check in with design to see how the layout should ideally be done.
      yAxisLabelYOffset: 10,
      gridXSpacing: 0.25,
      gridYSpacing: 0.25,
      linePlotOptions: {
        stroke: '#7090F5'
      },
      tandem: options.tandem
    };

    super( model.resetEmitter, graphOptions );

    const wavelengthObserver = ( wavelength: number ) => {
      const frequency = wavelengthToFrequency( wavelength );
      const energy = Math.max( 0, wavelengthToEnergy( wavelength ) - model.target.workFunctionProperty.value );
      this.addDataPoint( new Vector2( frequency, energy ) );
    };
    const resetObserver = () => this.clearDataSet();
    const resetMultilink = Multilink.lazyMultilinkAny( [
      model.photonSource.intensityProperty,
      model.voltageProperty,
      model.target.materialProperty,
      model.target.workFunctionProperty
    ], resetObserver );

    model.photonSource.wavelengthProperty.lazyLink( wavelengthObserver );

    this.disposeFrequencyEnergyGraphNode = () => {
      model.photonSource.wavelengthProperty.unlink( wavelengthObserver );
      Multilink.unmultilink( resetMultilink );
    };
  }

  /**
   * Releases listeners tied to the graph data set.
   */
  public override dispose(): void {
    this.disposeFrequencyEnergyGraphNode();
    super.dispose();
  }

}

/**
 * Computes photon frequency in units of 10^15 Hz from wavelength in nm.
 */
const wavelengthToFrequency = ( wavelength: number ): number => {
  let frequency = 0;
  if ( wavelength > 0 ) {
    frequency = 299792458 / ( wavelength * 1e-9 ) / 1e15;
  }
  return frequency;
};