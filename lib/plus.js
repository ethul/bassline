// plus :: a -> plus a
var plus = function(a) {
  if (this instanceof plus) {
    this.get = a;
  }
  else {
    return new plus(a);
  }
};

module.exports = plus;
