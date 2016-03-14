'use strict';

/**
 * Freezes an object an all of it's properties recursively.
 *
 * @param {Object} object The object to be freezed.
 */
export default function freeze(object) {

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
