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

name | description | type | default
---- | ----------- | ---- | -------
base | object to modify | object
path | list of keys to access the value to being modified | array or string
value | value to set | any
withArray (optional)| if set to `true` number will be interpreted has array indexes | boolean | false
equality (optional) | if provided, the function will be used to determine if the value at the path is equal to the value provided | function | `===`

## Usage
Import `set` function

```js
import set from 'immutable-set';
```

Then set the property you want in your object

```js
const newState = set(state, ['a', 0, 'b'], 42, true);
// or
const newState = set(state, 'a[0].b', 42, true);
/*
 newState => {
               a: [
                 {
                   b: 42,
                 },
               ],
               ...
             }
 */
```

The function mutates the object only if the value is not already present in the object
