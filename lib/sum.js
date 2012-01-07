// The Sum object represents numeric values which are intended to be
// added together.

var bass = require("./bass")
  , toString = bass.toString;

// sum :: a -> sum a
var sum = function(a) {
  if (this instanceof sum) {
    if (toString(a) === toString(0)) {
      this.get = a;
    }
    else {
      throw new Error("Invalid Number: " + toString(a));
    }
  }
  else {
    return new sum(a);
  }
};

module.exports = {
  sum: sum
};
