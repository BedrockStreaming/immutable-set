import freeze from 'deep-freeze';
import set from '../src/set';

jest.unmock('../src/set.js');

describe('set', () => {
  it('should assign to object path without mutating', () => {
    // Given
    const obj = freeze({ foo: { bar: 2 } });

    // When
    const result = set(obj, ['foo', 'bar'], 4);

    // Then
    expect(result).not.toBe(obj);
    expect(result).toEqual({ foo: { bar: 4 } });
  });

  it('should assign to array without mutating', () => {
    // Given
    const array = freeze(['foo', ['bar', 'baz']]);

    // When
    const result = set(array, [1, 0], 'qux', true);

    // Then
    expect(result).not.toBe(array);
    expect(result).toEqual(['foo', ['qux', 'baz']]);
  });

  it('should create object when string path is undefined while assigning to object', () => {
    // Given
    const obj = freeze({});

    // When
    const result = set(obj, ['foo', 'bar'], 4);

    // Then
    expect(result).not.toBe(obj);
    expect(result).toEqual({ foo: { bar: 4 } });
  });

  it('should create array when number path is undefined while assigning to object', () => {
    // Given
    const obj = freeze({});

    // When
    const result = set(obj, ['foo', 0], 4);

    // Then
    expect(result).not.toBe(obj);
    expect(result).toEqual({ foo: { 0: 4 } });
  });

  it('should create object when string path is undefined while assigning to array', () => {
    // Given
    const array = freeze([]);

    // When
    const result = set(array, [0, 'foo'], 'bar', true);

    // Then
    expect(result).not.toBe(array);
    expect(result).toEqual([{ foo: 'bar' }]);
  });

  it('should create array when number path is undefined while assigning to array', () => {
    // Given
    const array = freeze([]);

    // When
    const result = set(array, [0, 0], 'qux', true);

    // Then
    expect(result).not.toBe(array);
    expect(result).toEqual([['qux']]);
  });

  it('should use an object as default structure', () => {
    const foo = freeze({ key: 3 });
    expect(set({}, ['a', foo.key], 'foo')).toEqual({ a: { 3: 'foo' } });
  });

  it('should use an array as structure when specified', () => {
    const foo = freeze({ key: 3 });
    expect(set({}, ['a', foo.key], 'foo', true)).toEqual({ a: ['foo'] });
  });

  it('should not modify the base if the value is already there', () => {
    const foo = { a: { b: [3] } };
    expect(set(foo, ['a', 'b', 0], 3)).toBe(foo);
  });

  it('should reform object', () => {
    expect(set(null, undefined, 3)).toBe(3);
    expect(set(null, [], 3)).toBe(3);
    expect(set(null, '', 3)).toBe(3);
    expect(set(null, ['list', 0], 3)).toEqual({ list: { '0': 3 } });
    expect(set(null, ['list', 0], 3, true)).toEqual({ list: [3] });
  });

  it('should use string path', () => {
    expect(set(null, 'a.b', 3)).toEqual({ a: { b: 3 } });
    expect(set(null, 'list[0]', 3)).toEqual({ list: { 0: 3 } });
    expect(set(null, 'list[0]', 3, true)).toEqual({ list: [3] });
    expect(set(null, 'a.list[0]', 3, true)).toEqual({ a: { list: [3] } });
    expect(set(null, 'a[0].b', 42, true)).toEqual({ a: [{ b: 42 }] });
  });
});
