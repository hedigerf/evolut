/**
 * Functional utilities for objects.
 *
 * @module util/object
 */

import { assoc, curry } from 'ramda';

/**
 * Freezes an object an all of it's properties recursively.
 *
 * @param {Object} object The object to be freezed.
 * @return {Object} The frozen Object.
 */
export function freeze(object) {

  const propNames = Object.getOwnPropertyNames(object);
  propNames.forEach((name) => {
    const prop = object[name];
    if (typeof prop === 'object' && prop !== null) {
      freeze(prop);
    }
  });

  // Freeze self (no-op if already frozen)
  return Object.freeze(object);
}

/**
 * Returns a single item by iterating through the list,
 * successively calling the iterator function and
 * passing it an accumulator value and the current value from the array,
 * and then passing the result to the next call.
 *
 * @function
 * @param {function(*, *, String=): *} fn A reducer function. Takes as the third parameter the key
 * @param {*} init The initial value
 * @param {Object} obj The object to be reduced
 * @return {*} The reduces result
 */
export const reduce = curry(
  (fn, init, obj) => {
    let acc = init;
    let prop;
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        acc = fn(acc, obj[prop], prop);
      }
    }
    return acc;
  }
);

/**
 * Takes a predicate and a list and returns the pair of lists of elements
 * which do and do not satisfy the predicate, respectively.
 *
 * @function
 * @param {function(*): Boolean} pred Applied to every item in obj
 * @param {Object} obj The object to be partitioned
 * @return {Array<Object<*>>} The head contains all items which fulfilled pred
 */
export const partition = curry(
  (pred, obj) => {
    return reduce((acc, elt, key) => {
      const index = pred(elt) ? 0 : 1;
      acc[index] = assoc(key, elt, acc[index]);
      return acc;
    }, [{}, {}], obj);
  }
);
