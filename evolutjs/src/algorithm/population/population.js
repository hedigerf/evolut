/**
 * Provides an implementation of a population.
 *
 * @module algorithm/population/population
 */

/**
 * Represents the population contains all the individuals
 */
export default class Population {

  /**
   * Creates a new population with individuals.
   *
   * @param {Array<Individual>} individuals The indiviudals of this population
   * @param {Number} generationCount The current generation number
   */
  constructor(individuals, generationCount) {

    /**
     * The individuals of a population.
     *
     * @type {Array<Individual>}
     */
    this.individuals = individuals;

    /**
     * The current generation number.
     *
     * @type {Number}
     */
    this.generationCount = generationCount;
  }

}
