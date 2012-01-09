var bass = require("./bass")
  , toString = bass.toString;

// listw :: a -> listw a
var listw = function(a) {
  if (this instanceof listw) {
    if (toString(a) === toString([])) {
      this.get = a;
    }
    else {
      throw new Error("Invalid List: " + toString(a));
    }
  }
  else {
    return new listw(a);
  }
};

module.exports = {
  listw: listw
};
