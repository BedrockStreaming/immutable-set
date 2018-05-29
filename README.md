![build status](https://travis-ci.org/M6Web/immutable-set.svg)
# Immutable set

This tools aims to facilitate the modification of nested property while preserving immutable principles.
Lets say you have the given object:
```js
const state = {
  a: {
    foo: 'bar',
  },
  b: {
    value: 3,
  },
};
```
If we want to increment `b.value`, immutability says that we should generate a new object where
```js
newState === state        // false
newState.b === state.b    // false
newState.a === state.a    // true
``` 
That exactly what does our `set` function, 

## Setup
Add the dependency to your project:
```shell
yarn add immutable-set
```

## Parameters

name | description | type | requiered
---- | ----------- | ---- | ---------
base | object to modify | object | ✅
path | list of keys to access the value to being modified | array or string | ✅
value | value to set | any | ✅
options | options... | object

### Options
name | description | type | default
---- | ----------- | ---- | -------
withArray | if set to `true` number will be interpreted has array indexes | boolean | false
equality  | if provided, the function will be used to determine if the value at the path is equal to the value provided | function | `===`
safe | verify if the value does not already exist | boolean | false
sameValue | use same value for each nested property in case of multi set | boolean | false


## Usage
Import `set` function

```js
import set from 'immutable-set';
```

Then set the property you want in your object

```js
const newState = set(state, ['a', 'b'], 42);
// or
const newState = set(state, 'a.b', 42);
/*
 newState => {
               a: {
                 b: 42,
               },
               ...
             }
 */
```

The function mutates the object only if the value is not already present in the object.

## Advanced usage

### with arrays
The option `withArrays` allow to dynamically create arrays when the current level is empty and the current path key is a number.
```js
let base = set({}, ['a', 0], 12, { withArrays: true });
// will return { a: [12] }
```

### safe
The option `safe` will verify if the value is not already in the object.
```js
const base = { a: 2 };
set(base, 'a', 2, { safe: true })
// will return the base unmodified
```

### equality
The option `equality` allow to use an other equality function instead of `===`. It has to be used with `safe` option.
```js
const base = { a: { id: 1, v: 0 } };
const equality = (a, b) => a.id === b.id && a.v === b.v };

set(base, 'a', { id: 1, v: 0 }, { safe: true, equality);
// will return the base unmodified

set(base, 'a', { id: 1, v: 1 }, { safe: true, equality);
// will return { a: { id: 1, v: 1 } }
```

### multiple set
It is possible to set multiple elements at once, providing multiple keys in the path and an array (or an object) in value.

```js
set({}, ['a', ['b', 'c']], [12, 13]);
// or
set({}, ['a', ['b', 'c']], { b: 12, c: 13 });
// will return { a: { b: 12, c: 13 } }

set({}, ['a', [0, 1 ]], [12, 13], { withArrays: true });
// will return { a: [12, 13] }
```

It's also possible to set multiple elements at once with the same value by setting `sameValue: true` in options.

```js
set({}, ['a', ['b', 'c']], { foo: 'bar' }, { sameValue: true });
// will return { a: { b: { foo: 'bar' }, c: { foo: 'bar' } } }

set({}, ['a', [0, 1 ]], 'foo', { withArrays: true, sameValue: true });
// will return { a: ['foo', 'foo'] }
```
- :warning: If the array of keys is not the last element of the path, the rest of the path will be used for each sub tree.
- :warning: It's not possible to set objects in array with object sub values, this will throw an error.
- :warning: For now safe mode does not work with multiple set.
