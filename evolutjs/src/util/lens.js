'use strict';

import { and, compose, equals, has, isArrayLike, length, lens, update } from 'ramda';
import L from 'partial.lenses';

/**
 * Find a value recursively within a nested array.
 *
 * @param {function(*, Number): Boolean} predicate
 * @param {Array} array
 * @return {*}
 */
function findRecursive(predicate, array) {

  let index = length(array);

  while (index) {

    let element = array[--index];

    if (isArrayLike(element)) {
      element = findRecursive(predicate, element);
      if (element !== undefined) {
        return element;
      }
    } else if (predicate(element, index)) {
      return element;
    }
  }

  return undefined;
}

/**
 * Update a value within a nested array.
 * Returns a new array.
 *
 * @param {function(*, Number): Boolean} predicate
 * @param {*} value
 * @param {Array} array
 * @return {Array}
 */
function updateRecursive(predicate, value, array) {

  let index = length(array);
  let updated;

  while (index) {

    let element = array[--index];

    if (isArrayLike(element)) {
      updated = updateRecursive(predicate, element);
      if (updated !== undefined) {
        return updated;
      }
    } else if (predicate(element, index)) {
      return update(index, value, array);
    }
  }

  return undefined;
}

/*
Export const lensMatching = predicate => lens(
  find(predicate), (value, array, other) => update(findIndex(predicate, array), value, array)
);
*/

export const lensMatchingRecursive = predicate => lens(
  // jshint -W098
  findRecursive.bind(null, predicate), (value, array, _) => updateRecursive(predicate, value, array)
);

const hasPropertyAtIndex = (property, index) => (object, currentIndex) =>
  and(equals(index, currentIndex), has(property, object));

// Lens for [{}, [{'leg', ...}]]
export const lensByIdentifierRecursive = compose(lensMatchingRecursive, has);

// Lens for [{}, [{'leg', ...}, {'leg', ...}]]
export const lensByIndexIdentifierRecursive = compose(lensMatchingRecursive, hasPropertyAtIndex);

export const lensPartialGenotypeOption = id => compose(lensByIdentifierRecursive(id), L.prop(id));

// Lens for [{}, [{'leg', ...}, {'joint', ...}], [{'leg', ...}, {'joint', ...}]]
// export const lensByIndexIdentifierRecursive = compose(lensMatchingRecursive, lensIndex, hasPropertyAtIndex);

/*
Let lensBody = lensByIdentifierRecursive('body');
let lensEngine = lensByIdentifierRecursive('engine');
let lensLeg = lensByIdentifierRecursive('leg');

let lensLeg2 = lensByIndexIdentifierRecursive('leg', 2);

console.log(view(lensBody, seeded));
console.log(view(lensEngine, seeded));
console.log(view(lensLeg, seeded));
console.log(view(lensLeg2, seeded));

return seeded;
*/
