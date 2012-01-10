# Bassline

Bassline is a JavaScript library

## Installation

* Install Bassline with NPM

        npm install bassline

## Getting Started: Hello World

```javascript
var bassline = require("bassline")
  , maybe = bassline.maybe
  , hello = maybe.just("Hello");

console.log(hello.fmap(function(a){return a + " World";}));

$ node hello.js
{ get: 'Hello World' } 
```

## Library Reference


### Bass

The Bass object contains functions that are used throughout the other
objects described below, and intended for convenience. The functions
exported are as follows.

* derive
* curry
* slice
* toString

### Maybe

### Either

The Either module represents an algebraic data type with two
constructors: Left and Right. The module exposes these constructors
using factory functions. In general, Either is useful for representing
an operation that may result in two outcomes. Typically, the outcomes
are success and failure, where Right models success, and Left models
failure. Each constructor accepts a single value. Therefore, we are able
to capture a value on success and failure. This is more powerful than
the Maybe ADT because we are able to capture a value in the failure
case, so we would be able to potentially know the reason a failure
arose.

* left
* right
* pure
* return

### ListW

### StringW

### Product

### Sum
