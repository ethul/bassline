define(function() {

  // algebraic data type either e a = left e | right a
  var left,right;

  // left :: e -> left e
  left = function(e) {
    if (this instanceof left) {this.get = e}
    else {return new left(e)}
  };

  // right :: a -> right a
  right = function(a) {
    if (this instanceof right) {this.get = a}
    else {return new right(a)}
  };

  return {
    left: left,
    right: right
  };
});
