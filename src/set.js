import { recursiveEqual, isSafe } from './utils';

/**
 * Compute next base in recursion
 * @param base current base
 * @param key current key in the path
 * @param nextKey next key in the path
 * @param withArrays create arrays instead of object when nextKey is a number and key has no value in the current base
 */
const nextBase = (base, key, nextKey, withArrays) => base[key] || (withArrays && typeof nextKey === 'number' ? [] : {});

/**
 * Reduce multiple elements in the accumulator using the setFunction when base is an Array
 * @param setFunction
 */
const reduceWithArray = setFunction =>
  /**
   * Reduce multiple elements in the accumulator
   * @param base current base
   * @param path current path
   * @param keys list of keys ; we know there that keys is an array or set
   * @param nextKey next key in the path
   * @param values list of values, has to be an array
   * @param withArrays
   * @param accumulator new instance of the array at the current level
   * @returns {*} the accumulator with the new elements
   */
  (base, path, keys, nextKey, values, { withArrays, sameValue }, accumulator) => {
    if (!Array.isArray(values) && !sameValue) {
      throw new Error('Can not use object values with array in path');
    }

    return keys.reduce((acc, key, index) => {
      const value = sameValue ? values : values[index];
      const newValue = setFunction(nextBase(base, key, nextKey, withArrays), path.slice(1), value, {
        withArrays,
        sameValue,
      });

      if (key < acc.length) {
        acc[key] = newValue;
      } else {
        acc.push(newValue);
      }

      return acc;
    }, accumulator);
  };

/**
 * Reduce multiple elements in an new Object using the setFunction when base is an Object
 * @param setFunction
 */
const reduceWithObject = fn =>
  /**
   * Reduce multiple elements in an new Object
   * @param base current base
   * @param path current path
   * @param keys list of keys ; we know there that keys is an array or set
   * @param nextKey next key in the path
   * @param values list of values, could be an array or an object
   * @param withArrays
   * @returns {*} a set of the new elements
   */
  (base, path, keys, nextKey, values, { withArrays, sameValue }) => {
    if (Array.isArray(values)) {
      return keys.reduce((acc, key, index) => {
        const value = sameValue ? values : values[index];
        acc[key] = fn(nextBase(base, key, nextKey, withArrays), path.slice(1), value, { withArrays, sameValue });

        return acc;
      }, {});
    }

    return keys.reduce((acc, key) => {
      const value = sameValue ? values : values[key];
      acc[key] = fn(nextBase(base, key, nextKey, withArrays), path.slice(1), value, { withArrays, sameValue });

      return acc;
    }, {});
  };

/**
 * Recursive immutable set
 * @param base current base
 * @param path current path
 * @param value current value
 * @param config
 *  - withArrays create arrays instead of object when nextKey is a number and key has no value in the current base
 *  - sameValue use the same value for each element
 * @returns {*} a new instance of the given level
 */
function set(base, path, value, { withArrays, sameValue }) {
  if (path.length === 0) {
    return value;
  }

  const [key, nextKey] = path;
  const isArrayKeys = Array.isArray(key);
  let currentBase = base;

  if (!base || typeof base !== 'object') {
    currentBase = (isArrayKeys && typeof key[0] === 'number') || (withArrays && typeof key === 'number') ? [] : {};
  }

  if (isArrayKeys) {
    if (Array.isArray(currentBase)) {
      return reduceWithArray(set)(currentBase, path, key, nextKey, value, { withArrays, sameValue }, [...currentBase]);
    }

    return {
      ...currentBase,
      ...reduceWithObject(set)(currentBase, path, key, nextKey, value, { withArrays, sameValue }, {}),
    };
  }

  if (Array.isArray(currentBase)) {
    return [
      ...currentBase.slice(0, key),
      set(nextBase(currentBase, key, nextKey, withArrays), path.slice(1), value, { withArrays, sameValue }),
      ...currentBase.slice(parseInt(key) + 1),
    ];
  }

  return {
    ...currentBase,
    [key]: set(nextBase(currentBase, key, nextKey, withArrays), path.slice(1), value, { withArrays, sameValue }),
  };
}

/**
 * Main function, recursive immutable set
 * @param base base object
 * @param initialPath path to the place where the value is going to be set
 * @param value value to set
 * @param options options
 * @returns {*} new instance of the base if it has been modified, the base otherwise
 */
export default function safeSet(base, initialPath, value, options = {}) {
  const { withArrays = false, equality, sameValue = false } = options;
  let path = initialPath;

  // Handle string path
  if (typeof path === 'string' && path.length > 0) {
    path = path.split('.');
    path = path.reduce((acc, key) => {
      const groupe = /\[([0-9]*)\]/.exec(key);

      if (groupe) {
        acc.push(key.substr(0, groupe.index), Number(groupe[1]));
      } else {
        acc.push(key);
      }

      return acc;
    }, []);
  }

  if (!Array.isArray(path) || path.length < 1) {
    return base === value ? base : value;
  }

  // If the value is already here we just need to return the base
  if (isSafe(value, options) && recursiveEqual(base, path, value, equality)) {
    return base;
  }

  return set(base, path, value, { withArrays, sameValue });
}
