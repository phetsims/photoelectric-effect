// Copyright 2026, University of Colorado Boulder

/**
 * Unit for photons per second (photons/s)
 *
 * TODO: Should this move to scenery-phet as a shared unit?
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../scenery-phet/js/PhetUnit.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

export const photonsPerSecondUnit = new PhetUnit<ReadOnlyProperty<string>>( 'photons/s', {
  visualSymbolStringProperty: PhotoelectricEffectFluent.units.photonsPerSecond.symbolStringProperty,
  visualSymbolPatternStringProperty: PhotoelectricEffectFluent.units.photonsPerSecond.symbolPatternStringProperty,
  accessiblePattern: PhotoelectricEffectFluent.a11y.units.photonsPerSecond.pattern
} );
