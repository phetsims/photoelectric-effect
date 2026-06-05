// Copyright 2026, University of Colorado Boulder

/**
 * Unit for microamperes (μA)
 *
 * TODO: Should this move to scenery-phet as a shared unit?
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ReadOnlyProperty from '../../../../axon/js/ReadOnlyProperty.js';
import PhetUnit from '../../../../scenery-phet/js/PhetUnit.js';
import PhotoelectricEffectFluent from '../../PhotoelectricEffectFluent.js';

export const microamperesUnit = new PhetUnit<ReadOnlyProperty<string>>( 'μA', {
  visualSymbolStringProperty: PhotoelectricEffectFluent.units.microamperes.symbolStringProperty,
  visualSymbolPatternStringProperty: PhotoelectricEffectFluent.units.microamperes.symbolPatternStringProperty,
  accessiblePattern: PhotoelectricEffectFluent.a11y.units.microamperes.pattern
} );