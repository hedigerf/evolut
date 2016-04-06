/**
 * Provides interfaces for selection strategy algorithms.
 *
 * @module algorithm/selection/selectionStrategy
 */

/**
 * Base class for selection strategy
 * Subclasses implement different strategies for select().
 *
 * @abstract
 */
export default class SelectionStrategy {

  /**
   * Selection strategy constructor.
   *
   * @param {Population} population The population on which indiviudals are selected from
   */
  constructor(population) {
    /**
     * The population to perform the selection on.
     *
     * @type {Population}
     */
    this.population = population;
  }

  /**
   * Perform the selection.
   *
   * @return {Population} The new generation.
   */
  select() {
    return this.population;
  }

}
