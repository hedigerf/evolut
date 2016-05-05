/**
 * Recursion combinator for arrow functions.
 * Also known as Y-combinator.
 *
 * @module util/recursion
 */

/**
 * Y-combinator.
 *
 * @param {function(f: function, ...*): *} f
 * @return {function(...*)}
 */
const Y = (f) => (...args) => f((...args) => Y(f)(...args), ...args);

export default Y;
