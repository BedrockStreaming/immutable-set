import set from '../src/set';

jest.unmock('../src/set.js');

describe('set.util', () => {
  it('should assign to object path without mutating', () => {
    // Given
    const obj = { foo: { bar: 2 } };

    // When
    const result = set(obj, ['foo', 'bar'], 4);

    // Then
    expect(result).not.toBe(obj);
    expect(result).toEqual({ foo: { bar: 4 } });
  });

  it('should assign to array without mutating', () => {
    // Given
    const array = ['foo', ['bar', 'baz']];

    // When
    const result = set(array, [1, 0], 'qux', true);

    // Then
    expect(result).not.toBe(array);
    expect(result).toEqual(['foo', ['qux', 'baz']]);
  });

  it('should create object when string path is undefined while assigning to object', () => {
    // Given
    const obj = {};

    // When
    const result = set(obj, ['foo', 'bar'], 4);

    // Then
    expect(result).not.toBe(obj);
    expect(result).toEqual({ foo: { bar: 4 } });
  });

  it('should create array when number path is undefined while assigning to object', () => {
    // Given
    const obj = {};

    // When
    const result = set(obj, ['foo', 0], 4);

    // Then
    expect(result).not.toBe(obj);
    expect(result).toEqual({ foo: { 0: 4 } });
  });

  it('should create object when string path is undefined while assigning to array', () => {
    // Given
    const array = [];

    // When
    const result = set(array, [0, 'foo'], 'bar', true);

    // Then
    expect(result).not.toBe(array);
    expect(result).toEqual([{ foo: 'bar' }]);
  });

  it('should create array when number path is undefined while assigning to array', () => {
    // Given
    const array = [];

    // When
    const result = set(array, [0, 0], 'qux', true);

    // Then
    expect(result).not.toBe(array);
    expect(result).toEqual([['qux']]);
  });

  it('should use an object as default structure', () => {
    const foo = { key: 3 };
    expect(set({}, ['a', foo.key], 'foo')).toEqual({ a: { 3: 'foo' } });
  });

  it('should use an array as structure when specified', () => {
    const foo = { key: 3 };
    expect(set({}, ['a', foo.key], 'foo', true)).toEqual({ a: ['foo'] });
  });
});
