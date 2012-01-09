// The StringW object is not yet completely defined. There are still
// ongoing considerations for how this should be properly implemented.
// The main issue is that JavaScript treats a String as its own "type"
// and not directly as an Array of characters --it's more like an Array
// of Strings, where each character is a String.
//
// In any case, perhaps the constructor of this object should merely
// delegate to the ListW and split on each character in the passed
// String. Another possibility is to remove this all together.

var bass = require("./bass")
  , toString = bass.toString;

// stringw :: a -> stringw a
var stringw = function(a) {
  if (this instanceof stringw) {
    if (toString(a) === toString("")) {
      this.get = a;
    }
    else {
      throw new Error("Invalid String: " + toString(a));
    }
  }
  else {
    return new stringw(a);
  }
};

module.exports = {
  stringw: stringw
};
