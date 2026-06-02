// Copyright 2026, University of Colorado Boulder

/**
 * Material is an instantiable class representing a target material with its own physical parameter Properties.
 * MaterialType is the enumeration of available materials and their initial physical parameter values.
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

  // Whether the material's physical parameters are read-only through PhET-iO. Defaults to true because most
  // material types represent fixed physical materials.
  parametersPhetioReadOnly?: boolean;
};

export class MaterialType extends EnumerationValue {

  // Work functions (φ, eV) and occupied-band depths as prescribed by design.
  // Band depth is the effective range of binding energies available for photoemission, measured downward from
  // the Fermi level. It determines both the KE spread of ejected electrons and where the I-vs-f curve saturates.
  public static readonly SODIUM = new MaterialType( 2.46, 3.24 );
  public static readonly COPPER = new MaterialType( 4.70, 7.00 );
  public static readonly CALCIUM = new MaterialType( 2.87, 4.69 );
  public static readonly PLATINUM = new MaterialType( 6.35, 6.0 );
  public static readonly ZINC = new MaterialType( 4.31, 9.47 );

  // Mystery materials are for teachers and PhET-iO clients. Their physical parameters will only be set from
  // preferences or with a PhET-iO customization. As such, simulation reset should not affect mystery materials.
  // Work function and band depth match Magnesium (φ=3.66 eV, bandDepth=7.08 eV).
  public static readonly MYSTERY = new MaterialType( 3.66, 7.08, {
    parametersPhetioReadOnly: false
  } );

  // Controllable by the student, the custom material will have work function and band depth controls right
  // in the simulation. Reset should restore both properties to their initial values.
  // Defaults and range from the physics reference Section 5.5.
  public static readonly CUSTOM = new MaterialType( 5, 5.0, {
    parametersPhetioReadOnly: false
  } );

  // Must be defined after all values are declared.
  public static readonly enumeration = new Enumeration( MaterialType );

  /**
   * Whether the physical parameters are read-only through PhET-iO.
   */
  public readonly parametersPhetioReadOnly: boolean;

  /**
   * Creates a material type with physics parameters and PhET-iO mutability policy.
   *
   * @param workFunctionInitialValue - minimum energy to eject an electron from the Fermi level, in eV (φ)
   * @param bandDepthInitialValue - effective occupied-band depth available for photoemission, in eV
   * @param providedOptions
   */
  public constructor(
    public readonly workFunctionInitialValue: number,
    public readonly bandDepthInitialValue: number,
    providedOptions?: MaterialTypeOptions
  ) {
    super();

    const options = optionize<MaterialTypeOptions>()( {
      parametersPhetioReadOnly: true
    }, providedOptions );

    this.parametersPhetioReadOnly = options.parametersPhetioReadOnly;
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

  // Range for the band depth in eV. Covers all six fixed metals and the full custom range
  // as prescribed by design.
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
   * Effective occupied-band depth for this material, in eV.
   * Controls the spread of ejected-electron kinetic energies and the saturation point of the I-vs-f curve.
   */
  public readonly bandDepthProperty: NumberProperty;

  /**
   * Controls whether this material is available for selection in the UI.
   */
  public readonly enabledProperty: BooleanProperty;

  // Range for the work function of the material in eV.
  public static readonly WORK_FUNCTION_RANGE = new Range( 1, 10 );

  /**
   * Creates a material instance with its own physical parameter Properties.
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
      phetioReadOnly: materialType.parametersPhetioReadOnly,
      phetioDocumentation: 'Minimum energy, in electron volts, required to eject an electron from this material'
    } );

    this.bandDepthProperty = new NumberProperty( materialType.bandDepthInitialValue, {
      range: Material.BAND_WIDTH_RANGE,
      tandem: options.tandem.createTandem( 'bandDepthProperty' ),
      phetioReadOnly: materialType.parametersPhetioReadOnly,
      phetioDocumentation: 'Effective occupied-band depth, in eV, available for photoemission'
    } );

    // TODO: @design (phet-io) All EnabledProperty instances are featured. Do we want that for all Materials?
    this.enabledProperty = new EnabledProperty( options.enabled, {
      tandem: options.tandem.createTandem( EnabledProperty.TANDEM_NAME ),
      phetioDocumentation: 'Whether this material is available for selection'
    } );
  }

  /**
   * Resets the work function and band depth to their initial values.
   */
  public reset(): void {
    this.workFunctionProperty.reset();
    this.bandDepthProperty.reset();
  }

  public static readonly MaterialIO = new IOType<Material, MaterialStateObject>( 'MaterialIO', {
    valueType: Material,
    stateSchema: {
      materialType: EnumerationIO( MaterialType )
    }
  } );

  /**
   * Samples a binding energy uniformly across the occupied band [φ, φ + band depth] and returns the resulting
   * electron kinetic energy (KE = photonEnergy - bindingEnergy). KE may be negative when the sampled level
   * is inaccessible at the current photon energy; downstream emission logic treats those as no-emission.
   *
   * @param photonEnergy - energy of the incident photon, in eV
   * @param workFunction - work function (φ) of the target material, in eV
   * @param bandDepth - occupied-band depth of the target material, in eV
   */
  public static energyAfterPhotonCollision( photonEnergy: number, workFunction: number, bandDepth: number ): number {
    const bindingEnergy = workFunction + dotRandom.nextDouble() * bandDepth;
    return photonEnergy - bindingEnergy;
  }

  /**
   * Samples an electron binding energy from only the part of the occupied band that this photon can eject from.
   *
   * The full occupied band spans binding energies from workFunction to workFunction + bandDepth. In the normal model,
   * a photon samples that full range, so it can choose an electron that is bound too deeply to escape. This guaranteed
   * model instead clips the upper end of the range to the photon energy. The result is the accessible part of the band:
   * all sampled electrons can escape, but they still come from a continuous range of binding energies.
   *
   * @param photonEnergy - energy of the incident photon, in eV
   * @param workFunction - work function of the target material, in eV
   * @param bandDepth - occupied-band depth of the target material, in eV
   */
  public static energyAfterGuaranteedPhotonEmission( photonEnergy: number, workFunction: number, bandDepth: number ): number {
    if ( photonEnergy <= workFunction ) {
      return Number.NEGATIVE_INFINITY;
    }

    // Full-band upper limit, before accounting for whether this photon has enough energy to reach it.
    const fullBandMaximumBindingEnergy = workFunction + bandDepth;

    // The photon cannot eject electrons with binding energy greater than its own energy.
    const maximumBindingEnergy = Math.min( photonEnergy, fullBandMaximumBindingEnergy );

    // How far below the least-bound electrons this photon can sample and still emit.
    const accessibleBandWidth = maximumBindingEnergy - workFunction;

    // Sample within the accessible band so emitted electrons still have different kinetic energies.
    const bindingEnergy = workFunction + dotRandom.nextDouble() * accessibleBandWidth;

    // Kinetic energy after emission is the photon energy minus the sampled binding energy.
    return photonEnergy - bindingEnergy;
  }
}