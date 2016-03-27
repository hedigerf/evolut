/**
 * Provides support for class decorations.
 *
 * @module util/decorate
 */

/**
 * The cache of all with memoized decorated properties.
 * A weak map is used because references can still be collected
 * by the garbage collector.
 *
 * @type {WeakMap}
 */
const memoized = new WeakMap();

/**
 * Memoize decorator.
 *
 * @param {Object} target The target
 * @param {String} name The property name
 * @param {Object} descriptor The descriptor for the property
 */
export function memoize(target, name, descriptor) {

  const getter = descriptor.get;
  const setter = descriptor.set;

  descriptor.get = function() {
    let table = memoizationFor(this); // eslint-disable-line prefer-const
    if (name in table) {
      return table[name];
    }
    return table[name] = getter.call(this);
  }

  descriptor.set = function(val) {
    let table = memoizationFor(this); // eslint-disable-line prefer-const
    setter.call(this, val);
    table[name] = val;
  }
}

/**
 * Initializes the cache within the weak map if not available.
 *
 * @param {Object} obj The target object
 * @return {Object<*>} The cache
 */
function memoizationFor(obj) {
  let table = memoized.get(obj);
  if (!table) {
    table = Object.create(null);
    memoized.set(obj, table);
  }
  return table;
}

/**
 * Wraps a static getter in a decorator.
 *
 * @param {function(Object, String, Object)} decorator The decorator function
 * @param {String} property The property name
 * @param {Object} O The target
 */
export function decorateAccessorStatic(decorator, property, O) {

  let _temp = decorator(O.prototype, property,
    _temp = Object.getOwnPropertyDescriptor(O.prototype.constructor, property)) || _temp;

  if (_temp) {
    Object.defineProperty(O.prototype.constructor, property, _temp);
  }
}
