define(function() {

  var plus;

  // plus :: a -> plus a
  plus = function(a) {
    if (this instanceof plus) {this.get = a}
    else {return new plus(a)}
  };

  return {
    plus: plus
  };
});
