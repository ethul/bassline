define(function() {

  // algebratic data type, maybe a = nothing | just a
  var nothing,just;

  // nothing :: () -> nothing
  nothing = function() {
    if (this instanceof nothing) {}
    else {return new nothing()}
  };

  // just :: a -> just a
  just = function(a) {
    if (this instanceof just) {this.get = a}
    else {return new just(a)}
  };

  return {
    nothing: nothing,
    just: just
  };
});
