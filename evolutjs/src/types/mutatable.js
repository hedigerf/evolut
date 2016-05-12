/**
 * Module for mutatable types.
 *
 * @module types/mutatable
 */

/**
 * Applies the mutatable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const MutatableStatic = (Base = function() {}) => class extends Base {

  /**
   * Returns a mutated version of it self.
   *
   * @return {MutatableStatic}
   */
  static mutate() {
    return this;
  }

};

/**
 * Applies the mutatable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const Mutatable = (Base = function() {}) => class extends Base {

  /**
   * Returns a mutated version of it self.
   *
   * @return {Mutatable}
   */
  mutate() {
    return this;
  }

};
