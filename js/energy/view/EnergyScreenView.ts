// Copyright 2026, University of Colorado Boulder

/**
 * View for the Energy screen of the photoelectric effect simulation.
 * Uses the Intro screen view implementation so the Energy screen matches
 * the current UI until it diverges.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import PhotoelectricEffectScreenView from '../../common/view/PhotoelectricEffectScreenView.js';
import EnergyModel from '../model/EnergyModel.js';
import EnergyLightSourceNode from './EnergyLightSourceNode.js';

type SelfOptions = EmptySelfOptions;
type EnergyScreenViewOptions = SelfOptions & ScreenViewOptions;

export default class EnergyScreenView extends PhotoelectricEffectScreenView {

  public constructor( model: EnergyModel, providedOptions: EnergyScreenViewOptions ) {
    super( model, providedOptions );

    // TODO: Define PDOM order for screen specific components
  }

  protected override createLightSourceNode( beamStartCenter: Vector2 ): { node: Node; cordAttachmentPoint: Vector2 } {
    const node = new EnergyLightSourceNode( beamStartCenter );
    return { node: node, cordAttachmentPoint: node.cordAttachmentPoint };
  }
}
