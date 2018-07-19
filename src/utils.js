export function isSafe(value, { safe = false } = {}) {
  if (safe) return true;

  if (typeof value === 'object' && value !== null) {
    if (value.length) {
      return !value.find(subValue => !isSafe(subValue));
    }

    return safe;
  }

  return true;
}

/**
 * Recursive equality tester. Return true if the top down element of the path in the base is equal to the given value
 * @param base current base
 * @param path current path
 * @param value value to verify
 * @param equality override the equality assertion
 * @returns {boolean} true if the value is in the base at the end of the path
 */
export function recursiveEqual(base, path, value, equality) {
  if (!base || typeof base !== 'object') {
    return false;
  }
  const [key, nextKey] = path;

  if (nextKey === undefined) {
    return equality ? equality(base[key], value) : base[key] === value;
  }

  return recursiveEqual(base[key], path.slice(1), value, equality);
}
