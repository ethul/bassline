// The Product object represents a numeric values which can be
// multiplied together.

var bass = require("./bass")
  , toString = bass.toString;

// product :: a -> product a
var product = function(a) {
  if (this instanceof product) {
    if (toString(a) === toString(0)) {
      this.get = a;
    }
    else {
      throw new Error("Invalid Number: " + toString(a));
    }
  }
  else {
    return new product(a);
  }
};

module.exports = {
  product: product
};
