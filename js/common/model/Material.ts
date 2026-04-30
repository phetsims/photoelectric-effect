// Copyright 2026, University of Colorado Boulder

/**
 * Material is an instantiable class representing a target material with its own workFunctionProperty.
 * MaterialType is the enumeration of available materials and their initial work function values.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnabledProperty from '../../../../axon/js/EnabledProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Range from '../../../../dot/js/Range.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
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

  // Mystery materials are for teachers and phet-io clients. The work function will only be set from
  // preferences or with a PhET-iO customization. As such, simulation reset should not affect the
  // workFunctionProperty of mystery materials.
  public static readonly MYSTERY = new MaterialType( 5 );

  // Controllable by the student, the custom material will have a work function control right in the
  // simulation. Reset should set the workFunctionProperty back to its initial value.
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

type MaterialStateObject = {
  materialType: MaterialType;
};

type SelfOptions = {

  // An identifier for the material label that can be used by the view layer.
  labelKey?: string | null;

  enabled?: boolean;
};

export type MaterialOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Material extends PhetioObject {

  // TODO: Is this where these should live?
  // Number of sub-levels used to distribute absorption depth.
  public static readonly NUM_SUB_LEVELS = 20;

  // Total depth, in eV, over which absorption levels are distributed.
  public static readonly TOTAL_ENERGY_DEPTH = 4;

  /**
   * Material type for this instance.
   */
  public readonly materialType: MaterialType;

  /**
   * Identifier for the material label used by the view layer.
   */
  public readonly labelKey: string | null;

  /**
   * Minimum energy required for an electron to escape this material.
   * Used alongside photon energy to decide when emission occurs.
   */
  public readonly workFunctionProperty: NumberProperty;

  /**
   * Controls whether this material is available for selection in the UI.
   */
  public readonly enabledProperty: BooleanProperty;

  // TODO: @design How is this going to work? Will different mystery/custom materials have different
  //   ranges? If so, we need to assign this to each type or maybe even each Material instance.
  //   For now, this is convenient because we can use one range for every work function Property
  //   and know that it will be available when we create UI components.
  // Range for the work function of the material in eV.
  public static readonly WORK_FUNCTION_RANGE = new Range( 1.5, 7 );

  /**
   * Creates a material instance with its own work function Property.
   * @param materialType
   * @param providedOptions - material configuration including required tandem and optional label key override
   */
  public constructor( materialType: MaterialType, providedOptions: MaterialOptions ) {

    const options = optionize<MaterialOptions, SelfOptions, PhetioObjectOptions>()( {
      labelKey: null,
      enabled: true,
      phetioType: Material.MaterialIO
    }, providedOptions );

    super( options );
    this.materialType = materialType;
    this.labelKey = options.labelKey;

    this.workFunctionProperty = new NumberProperty( materialType.workFunctionInitialValue, {
      range: Material.WORK_FUNCTION_RANGE,
      tandem: options.tandem.createTandem( 'workFunctionProperty' ),
      phetioDocumentation: 'Minimum energy, in electron volts, required to eject an electron from this material'
    } );

    // TODO: @design (phet-io) All EnabledProperty instances are featured. Do we want that for all Materials?
    this.enabledProperty = new EnabledProperty( options.enabled, {
      tandem: options.tandem.createTandem( EnabledProperty.TANDEM_NAME ),
      phetioDocumentation: 'Whether this material is available for selection'
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

  /**
   * Chooses a random sub-level and subtracts the corresponding energy requirement.
   * This mirrors the legacy model by spreading absorbed energy across discrete levels.
   */
  public static energyAfterPhotonCollision( photonEnergy: number, workFunction: number ): number {
    const level = dotRandom.nextInt( Material.NUM_SUB_LEVELS );
    const energyRequired = workFunction + ( level * ( Material.TOTAL_ENERGY_DEPTH /
                                                      Material.NUM_SUB_LEVELS ) );
    return photonEnergy - energyRequired;
  }
}