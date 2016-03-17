export default class GenotypeValidation {

  /**
   * @throws {Error}
   */
  constructor() {
  }

  /**
   * @static
   * @param {Genotype} genotype The genotype which shall be validated.
   * @return {Boolean}
   */
  validate(genotype) {
    return !!genotype;
  }

}
