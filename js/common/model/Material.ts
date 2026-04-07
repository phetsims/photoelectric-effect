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
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationIO from '../../../../tandem/js/types/EnumerationIO.js';
import IOType from '../../../../tandem/js/types/IOType.js';

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
  public static readonly MYSTERY = new MaterialType( 5 );

  // The work function for custom is set by the user in the screen.

  // Reset should set the workFunctionProperty back to its initial value.
  public static readonly CUSTOM = new MaterialType( 5 );

  // Must be defined after all values are declared.
  public static readonly enumeration = new Enumeration( MaterialType );

  /**
   * Initial work function value in eV for this material type.
   */
  public readonly workFunctionInitialValue: number;

  /**
   * @param workFunctionInitialValue - initial work function value in eV for this material type
   */
  public constructor( workFunctionInitialValue: number ) {
    super();
    this.workFunctionInitialValue = workFunctionInitialValue;
  }
}

type MaterialStateObject = {
  materialType: MaterialType;
};

export default class Material extends PhetioObject {

  /**
   * Material type for this instance.
   */
  public readonly materialType: MaterialType;

  /**
   * Minimum energy required for an electron to escape this material.
   * Used alongside photon energy to decide when emission occurs.
   */
  public readonly workFunctionProperty: NumberProperty;

  /**
   * Creates a material instance with its own work function Property.
   */
  public constructor( materialType: MaterialType, tandem: Tandem ) {

    super( {
      phetioType: Material.MaterialIO
    } );
    this.materialType = materialType;
    this.workFunctionProperty = new NumberProperty( materialType.workFunctionInitialValue, {
      tandem: tandem.createTandem( 'workFunctionProperty' )
    } );
  }

  /**
   * Resets the work function to its initial value.
   */
  public reset(): void {
    this.workFunctionProperty.reset();
  }

  // TODO: We need to test this with the state wrapper and studio.
  public static readonly MaterialIO = new IOType<Material, MaterialStateObject>( 'MaterialIO', {
    valueType: Material,
    stateSchema: {
      materialType: EnumerationIO( MaterialType )
    }
  } );
}