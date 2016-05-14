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
   * Perform the selection.
   *
   * @param {Population} population The population on which indiviudals are selected from
   * @return {Population} The new generation.
   */
  select(population) {
    return population;
  }

}
