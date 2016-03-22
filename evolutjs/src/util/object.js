'use strict';

import { compose, curry, lensIndex, lensProp, set } from 'ramda';

/**
 * Returns a single item by iterating through the list,
 * successively calling the iterator function and
 * passing it an accumulator value and the current value from the array,
 * and then passing the result to the next call.
 *
 * @param {function(*, *, String=): *} fn
 * @param {*} init
 * @param {Object} obj
 * @return {*}
 */
export const reduce = curry(
  (fn, init, obj) => {
    let acc = init;
    for (let prop in obj) {
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
 * @param {function(*): Boolean} pred
 * @param {Object} obj
 * @return {Array<Object<*>>}
 */
export const partition = curry(
  (pred, obj) => {
    return reduce((acc, elt, key) => {

      const index = pred(elt) ? 0 : 1;
      const lens = compose(lensIndex(index), lensProp(key));
      return set(lens, elt, acc);

    }, [{}, {}], obj);
  }
);
