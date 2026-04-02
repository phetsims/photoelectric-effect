// Copyright 2026, University of Colorado Boulder

/**
 * Enumeration of available target materials.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export default class Material extends EnumerationValue {
  public static readonly SODIUM = new Material( 2.3 );
  public static readonly COPPER = new Material( 4.7 );
  public static readonly CALCIUM = new Material( 2.9 );
  public static readonly MAGNESIUM = new Material( 3.7 );
  public static readonly PLATINUM = new Material( 6.3 );
  public static readonly ZINC = new Material( 4.3 );
  public static readonly MYSTERY = new Material( 5 );
  public static readonly CUSTOM = new Material( 5 );

  /**
   * Minimum energy required for an electron to escape this material.
   * Used alongside photon energy to decide when emission occurs.
   */
  public readonly workFunctionProperty: NumberProperty;

  // Must be defined after all values are declared.
  public static readonly enumeration = new Enumeration( Material );

  public constructor( workFunctionInitialValue: number ) {
    super();

    this.workFunctionProperty = new NumberProperty( workFunctionInitialValue );
  }
}