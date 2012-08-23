[![build status](https://secure.travis-ci.org/ethul/bassline.png)](http://travis-ci.org/ethul/bassline)
# Bassline

Bassline is a JavaScript library that exposes two primary types, `maybe`
and `either`. The `maybe` type  may be used to model an optional value.
The constructor functions `nothing` and `just` create a `maybe`.
The `either` type is used to represent values with two possibilities.
The constructor functions `left` and `right` create such values.

## Installation

* Install Bassline with NPM

        npm install bassline

## Getting Started: Hello World

```javascript
var bassline = require("bassline")
  , just = bassline.just;

console.log(just("Hello").fmap(function(a){return a + " World";}).get);

$ node hello.js
Hello World
```
