// the maybe module encapsulates an object that can optionally have
// a value. when there is no value, we use the nothing representation.
// when there is a value, we use the just representation.

// the maybe object will be at the top of the prototype chain
// any shared properties between nothing and just may go here

var maybe = function() {};

// the nothing object represents the case of no value. the get
// property is undefined for nothing

var nothing = function() {
  if (this instanceof nothing) {
    this.get = undefined;
  }
  else {
    return new nothing();
  }
};

// the just object represents the case of a value. the get
// property is the wrapped value for just

var just = function(a) {
  if (this instanceof just) {
    this.get = a;
  }
  else {
    return new just(a);
  }
};

// set up the prototype chain for nothing and just, and fix the 
// constructor reference to be the function used to construct
// the object. otherwise, the constructor reference for nothing
// and just would be maybe.

nothing.prototype = new maybe;
nothing.prototype.constructor = nothing;
just.prototype = new maybe;
just.prototype.constructor = just;

module.exports = {
  nothing: nothing,
  just: just
};
