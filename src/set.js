export default function set(base, path, value, withArrays = false) {
  if (path.length === 0) {
    return value;
  }

  const [key, nextKey] = path;

  if (Array.isArray(base)) {
    return [
      ...base.slice(0, key),
      set(base[key] || (withArrays && typeof nextKey === 'number' ? [] : {}), path.slice(1), value, withArrays),
      ...base.slice(key + 1),
    ];
  }

  return {
    ...base,
    [key]: set(base[key] || (withArrays && typeof nextKey === 'number' ? [] : {}), path.slice(1), value, withArrays),
  };
}
