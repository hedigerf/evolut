/**
 * Module for parameterizable types.
 *
 * @module types/parameterizable
 */

/**
 * Applies the ParameterizableStatic mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const ParameterizableStatic = (Base = function() {}) => class extends Base {

  /**
   * Returns the identifier as string.
   */
  static get parameter() {
    throw new Error('not implemented');
  }

};

/**
 * Applies the Parameterizable mixin to a class.
 *
 * @abstract
 * @mixin
 * @param {function} [Base=function() {}] A base class
 * @return {function} The extended, mixed base class
 */
export const Parameterizable = (Base = function() {}) => class extends Base {

  /**
   * Returns the identifier as string.
   */
  get parameter() {
    throw new Error('not implemented');
  }

};
