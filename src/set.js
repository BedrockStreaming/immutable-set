function recursiveEqual(base, path, value, equality) {
  if (!base || typeof base !== 'object') {
    return false;
  }
  const [key, nextKey] = path;

  if (nextKey === undefined) {
    return equality ? equality(base[key], value) : base[key] === value;
  }

  return recursiveEqual(base[key], path.slice(1), value, equality);
}

function set(base, path, value, withArrays) {
  if (path.length === 0) {
    return value;
  }

  const [key, nextKey] = path;

  let currentBase = base;
  if (!base || typeof base !== 'object') {
    currentBase = withArrays && typeof key === 'number' ? [] : {};
  }

  if (Array.isArray(currentBase)) {
    return [
      ...currentBase.slice(0, key),
      set(currentBase[key] || (withArrays && typeof nextKey === 'number' ? [] : {}), path.slice(1), value, withArrays),
      ...currentBase.slice(key + 1),
    ];
  }

  return {
    ...currentBase,
    [key]: set(
      currentBase[key] || (withArrays && typeof nextKey === 'number' ? [] : {}),
      path.slice(1),
      value,
      withArrays,
    ),
  };
}

export default function safeSet(base, initialPath, value, options = {}) {
  const { withArrays = false, equality } = options;
  let path = initialPath;

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
  if (recursiveEqual(base, path, value, equality)) {
    return base;
  }

  return set(base, path, value, withArrays);
}
