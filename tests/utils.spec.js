import { isSafe, recursiveEqual } from '../src/utils';

describe('isSafe', () => {
  const safeValues = [null, undefined, true, false, 0, 1, 'foo', [0, 1, 'foo', null, undefined]];
  const unsafeValues = [{}, [], [0, 1, 'foo', null, undefined, {}], [0, 1, 'foo', null, []]];
  const test = (value, safe, expected) =>
    it(`should return ${expected} for ${JSON.stringify(value)} with${safe ? '' : 'out'} safe option`, () => {
      expect(isSafe(value, safe ? { safe } : undefined)).toBe(expected);
    });

  safeValues.forEach(value => test(value, false, true));
  safeValues.forEach(value => test(value, true, true));
  unsafeValues.forEach(value => test(value, false, false));
  unsafeValues.forEach(value => test(value, true, true));
});

describe('recursiveEqual', () => {
  it('should return false when the base is falsy', () => {
    expect(recursiveEqual(null)).toBe(false);
    expect(recursiveEqual(undefined)).toBe(false);
    expect(recursiveEqual(0)).toBe(false);
  });

  describe('without equality function', () => {
    it('should return true when value is the same', () => {
      expect(recursiveEqual({ foo: 'bar' }, ['foo'], 'bar')).toBe(true);
      expect(recursiveEqual({ foo: { bar: 'foobar' } }, ['foo', 'bar'], 'foobar')).toBe(true);
      expect(recursiveEqual(['foo'], [0], 'foo')).toBe(true);
      expect(recursiveEqual([['foo']], [0, 0], 'foo')).toBe(true);
    });

    it('should return false when value is different', () => {
      expect(recursiveEqual({ foo: 'bar' }, ['foo'], 'foo')).toBe(false);
      expect(recursiveEqual({ foo: { bar: 'foobar' } }, ['foo', 'bar'], 'toto')).toBe(false);
      expect(recursiveEqual(['foo'], [0], 'bar')).toBe(false);
      expect(recursiveEqual([['foo']], [0, 0], 'bar')).toBe(false);
    });
  });

  describe('with reverse equality function', () => {
    const equalityFn = (a, b) => a !== b;

    it('should return false when value is the same', () => {
      expect(recursiveEqual({ foo: 'bar' }, ['foo'], 'bar', equalityFn)).toBe(false);
      expect(recursiveEqual({ foo: { bar: 'foobar' } }, ['foo', 'bar'], 'foobar', equalityFn)).toBe(false);
      expect(recursiveEqual(['foo'], [0], 'foo', equalityFn)).toBe(false);
      expect(recursiveEqual([['foo']], [0, 0], 'foo', equalityFn)).toBe(false);
    });

    it('should return true when value is different', () => {
      expect(recursiveEqual({ foo: 'bar' }, ['foo'], 'foo', equalityFn)).toBe(true);
      expect(recursiveEqual({ foo: { bar: 'foobar' } }, ['foo', 'bar'], 'toto', equalityFn)).toBe(true);
      expect(recursiveEqual(['foo'], [0], 'bar', equalityFn)).toBe(true);
      expect(recursiveEqual([['foo']], [0, 0], 'bar', equalityFn)).toBe(true);
    });
  });
});
