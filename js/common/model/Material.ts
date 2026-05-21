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

type MaterialTypeOptions = {

  // Whether the material's work function is read-only through PhET-iO. Defaults to true because most material
  // types represent fixed physical materials.
  workFunctionPhetioReadOnly?: boolean;

  // Whether the material's band width is read-only through PhET-iO. Defaults to true for all fixed materials.
  bandWidthPhetioReadOnly?: boolean;
};

export class MaterialType extends EnumerationValue {

  // Work functions (φ, eV) and occupied-band widths as prescribed by design.
  // Bandwidth is the effective range of binding energies available for photoemission, measured downward from
  // the Fermi level. It determines both the KE spread of ejected electrons and where the I-vs-f curve saturates.
  public static readonly SODIUM = new MaterialType( 2.3, 3.2 );
  public static readonly COPPER = new MaterialType( 4.7, 9.0 );
  public static readonly CALCIUM = new MaterialType( 2.9, 4.6 );
  public static readonly PLATINUM = new MaterialType( 6.3, 9.5 );
  public static readonly ZINC = new MaterialType( 4.3, 9.5 );

  // Mystery materials are for teachers and PhET-iO clients. The work function will only be set from
  // preferences or with a PhET-iO customization. As such, simulation reset should not affect the
  // workFunctionProperty of mystery materials.
  // Work function and bandwidth match Magnesium (φ=3.7 eV, bandWidth=7.1 eV) to mirror the java behavior.
  public static readonly MYSTERY = new MaterialType( 3.7, 7.1, {
    workFunctionPhetioReadOnly: false,
    bandWidthPhetioReadOnly: false
  } );

  // Controllable by the student, the custom material will have work function and bandwidth controls right
  // in the simulation. Reset should restore both properties to their initial values.
  // Defaults and range from the physics reference Section 5.5.
  public static readonly CUSTOM = new MaterialType( 5, 5.0, {
    workFunctionPhetioReadOnly: false,
    bandWidthPhetioReadOnly: false
  } );

  // Must be defined after all values are declared.
  public static readonly enumeration = new Enumeration( MaterialType );

  /**
   * Whether the work function is read-only through PhET-iO.
   */
  public readonly workFunctionPhetioReadOnly: boolean;

  /**
   * Whether the bandwidth is read-only through PhET-iO.
   */
  public readonly bandWidthPhetioReadOnly: boolean;

  /**
   * Creates a material type with physics parameters and PhET-iO mutability policy.
   *
   * @param workFunctionInitialValue - minimum energy to eject an electron from the Fermi level, in eV (φ)
   * @param bandWidthInitialValue - effective occupied-band width available for photoemission, in eV
   * @param providedOptions
   */
  public constructor(
    public readonly workFunctionInitialValue: number,
    public readonly bandWidthInitialValue: number,
    providedOptions?: MaterialTypeOptions
  ) {
    super();

    const options = optionize<MaterialTypeOptions>()( {
      workFunctionPhetioReadOnly: true,
      bandWidthPhetioReadOnly: true
    }, providedOptions );

    this.workFunctionPhetioReadOnly = options.workFunctionPhetioReadOnly;
    this.bandWidthPhetioReadOnly = options.bandWidthPhetioReadOnly;
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

  // Number of sub-levels used to discretize the occupied band for per-photon electron emission.
  public static readonly NUM_SUB_LEVELS = 20;

  // Range for the bandwidth in eV. Covers all six fixed metals plus the full custom range
  // from the physics reference Section 5.5.
  public static readonly BAND_WIDTH_RANGE = new Range( 0.5, 15 );

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
   * Effective occupied-band width for this material, in eV.
   * Controls the spread of ejected-electron kinetic energies and the saturation point of the I-vs-f curve.
   */
  public readonly bandWidthProperty: NumberProperty;

  /**
   * Controls whether this material is available for selection in the UI.
   */
  public readonly enabledProperty: BooleanProperty;

  // Range for the work function of the material in eV.
  public static readonly WORK_FUNCTION_RANGE = new Range( 1, 10 );

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
      phetioReadOnly: materialType.workFunctionPhetioReadOnly,
      phetioDocumentation: 'Minimum energy, in electron volts, required to eject an electron from this material'
    } );

    this.bandWidthProperty = new NumberProperty( materialType.bandWidthInitialValue, {
      range: Material.BAND_WIDTH_RANGE,
      tandem: options.tandem.createTandem( 'bandWidthProperty' ),
      phetioReadOnly: materialType.bandWidthPhetioReadOnly,
      phetioDocumentation: 'Effective occupied-band width, in eV, available for photoemission'
    } );

    // TODO: @design (phet-io) All EnabledProperty instances are featured. Do we want that for all Materials?
    this.enabledProperty = new EnabledProperty( options.enabled, {
      tandem: options.tandem.createTandem( EnabledProperty.TANDEM_NAME ),
      phetioDocumentation: 'Whether this material is available for selection'
    } );
  }

  /**
   * Resets the work function and bandwidth to their initial values.
   */
  public reset(): void {
    this.workFunctionProperty.reset();
    this.bandWidthProperty.reset();
  }

  public static readonly MaterialIO = new IOType<Material, MaterialStateObject>( 'MaterialIO', {
    valueType: Material,
    stateSchema: {
      materialType: EnumerationIO( MaterialType )
    }
  } );

  /**
   * Chooses a random sub-level within the occupied band and returns the resulting electron kinetic energy.
   * Sub-levels are evenly spaced across [φ, φ + bandwidth]; the chosen level determines the binding energy
   * and therefore the KE of the ejected electron (KE = photonEnergy - bindingEnergy).
   *
   * @param photonEnergy - energy of the incident photon, in eV
   * @param workFunction - work function (φ) of the target material, in eV
   * @param bandWidth - occupied-band width of the target material, in eV
   */
  public static energyAfterPhotonCollision( photonEnergy: number, workFunction: number, bandWidth: number ): number {
    const level = dotRandom.nextInt( Material.NUM_SUB_LEVELS );
    const energyRequired = workFunction + ( level * ( bandWidth / Material.NUM_SUB_LEVELS ) );
    return photonEnergy - energyRequired;
  }
}