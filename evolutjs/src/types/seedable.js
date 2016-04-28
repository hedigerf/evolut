/**
 * Module for seedable types.
 *
 * @module types/seedable
 */

/**
 * Applies the seedable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const SeedableStatic = (Base = function() {}) => class extends Base {

  /**
   * Returns a seeded description.
   *
   * @return {Object}
   */
  static seed() {
    return {};
  }

};

/**
 * Applies the seedable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const Seedable = (Base = function() {}) => class extends Base {

  /**
   * Returns a seeded description.
   *
   * @return {Object}
   */
  seed() {
    return {};
  }

};
