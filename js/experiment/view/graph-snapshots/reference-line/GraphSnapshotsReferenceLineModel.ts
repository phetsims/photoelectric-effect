// Copyright 2026, University of Colorado Boulder

/**
 * Model component for the graph snapshots reference line. It owns the user-controlled visibility state and the
 * shared x value used by the overlay and readouts.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../../../axon/js/NumberProperty.js';
import Range from '../../../../../../dot/js/Range.js';
import optionize, { EmptySelfOptions } from '../../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../../phet-core/js/types/PickRequired.js';
import type { PhetioObjectOptions } from '../../../../../../tandem/js/PhetioObject.js';

type SelfOptions = EmptySelfOptions;

type GraphSnapshotsReferenceLineModelOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class GraphSnapshotsReferenceLineModel {

  // Controls whether the reference line overlay is shown.
  public readonly visibleProperty: BooleanProperty;

  // Model-space x value for the reference line.
  public readonly xProperty: NumberProperty;

  public constructor( xRange: Range, providedOptions: GraphSnapshotsReferenceLineModelOptions ) {
    const options = optionize<GraphSnapshotsReferenceLineModelOptions, SelfOptions, PhetioObjectOptions>()(
      {},
      providedOptions
    );

    this.visibleProperty = new BooleanProperty( true, {
      tandem: options.tandem.createTandem( 'visibleProperty' )
    } );

    this.xProperty = new NumberProperty( xRange.getCenter(), {
      range: xRange,
      tandem: options.tandem.createTandem( 'xProperty' )
    } );
  }
}