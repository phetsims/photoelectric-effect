// Copyright 2026, University of Colorado Boulder

/**
 * Material is an instantiable class representing a target material with its own workFunctionProperty.
 * MaterialType is the enumeration of available materials and their initial work function values.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';

export class MaterialType extends EnumerationValue {

  // All of the work functions for the following MaterialTypes are ReadOnly.
  // TODO: Do we want to protect against mutability here?
  public static readonly SODIUM = new MaterialType( 2.3 );
  public static readonly COPPER = new MaterialType( 4.7 );
  public static readonly CALCIUM = new MaterialType( 2.9 );
  public static readonly MAGNESIUM = new MaterialType( 3.7 );
  public static readonly PLATINUM = new MaterialType( 6.3 );
  public static readonly ZINC = new MaterialType( 4.3 );

  // The work function for mystery is set in preferences.
  // Reset should not affect the workFunctionProperty of mystery.
  public static readonly MYSTERY1 = new MaterialType( 5 );
  public static readonly MYSTERY2 = new MaterialType( 5 );
  public static readonly MYSTERY3 = new MaterialType( 5 );

  // The work function for custom is set by the user in the screen.
  // Reset should set the workFunctionProperty back to its initial value.
  public static readonly CUSTOM = new MaterialType( 5 );

  // Must be defined after all values are declared.
  public static readonly enumeration = new Enumeration( MaterialType );

  /**
   * @param workFunctionInitialValue - initial work function value in eV for this material type
   */
  public constructor( public readonly workFunctionInitialValue: number ) {
    super();
  }
}

export default class Material {

  /**
   * Minimum energy required for an electron to escape this material.
   * Used alongside photon energy to decide when emission occurs.
   */
  public readonly workFunctionProperty: NumberProperty;

  public constructor( materialType: MaterialType ) {
    this.workFunctionProperty = new NumberProperty( materialType.workFunctionInitialValue );
  }
}