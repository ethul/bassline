
var curry = require("./bass").curry;

// The maybe module encapsulates an object that can optionally have
// a value. when there is no value, we use the nothing representation.
// when there is a value, we use the just representation.

var maybe = exports.maybe = function() {
  if (this instanceof maybe) {
    this.pure = just;
    this.return = just;
  }
  else {
    return new maybe();
  }
};

var nothing = exports.nothing = function() {
  if (this instanceof nothing) {
    this.get = undefined;
    this.fold = function(f,g) {return curry(f)()};
    this.fmap = function(f) {return nothing();};
    this.ap = function(fa) {return nothing();};
    this.bind = function(f) {return nothing();};
  }
  else {
    return new nothing();
  }
};

var just = exports.just = function(a) {
  if (this instanceof just) {
    this.get = a;
    this.fold = function(f,g) {return curry(g)(this.get)};
    this.fmap = function(f) {return just(curry(f)(this.get));};
    this.ap = function(fa) {return fa.fmap(this.get);};
    this.bind = function(f) {return curry(f)(this.get);};
  }
  else {
    return new just(a);
  }
};

nothing.prototype = new maybe;
nothing.prototype.constructor = nothing;
just.prototype = new maybe;
just.prototype.constructor = just;
