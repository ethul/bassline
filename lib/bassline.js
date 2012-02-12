var bass = require("./bass")
  , maybe = require("./maybe")
  , either = require("./either")
  , promise = require("./promise");

module.exports = {
  slice: bass.slice,
  curry: bass.curry,
  maybe: maybe.maybe,
  nothing: maybe.nothing,
  just: maybe.just,
  either: either.either,
  left: either.left,
  right: either.right,
  promise: promise.promise
};
