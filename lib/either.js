
var curry = require("./bass").curry;

// the either module encapsulates an object that can contain two possible
// values: left or right. an example of how this might be used is in the
// failure/success scenario. typically left is used to wrap a failure, and
// right is used to wrap a success.

var either = exports.either = function() {
  if (this instanceof either) {
    this.pure = right;
    this.return = right;
  }
  else {
    return new either();
  }
};

var left = exports.left = function(e) {
  if (this instanceof left) {
    this.get = e;
    this.fold = function(f,g) {return f(this.get);};
    this.fmap = function(f) {return left(this.get);};
    this.ap = function(fa) {
      var that = this;
      return fa.fold(
        function(e) {return left(that.get);},
        function(a) {return left(that.get);}
      );
    };
    this.bind = function(f) {return left(this.get);};
  }
  else {
    return new left(e);
  }
};

var right = exports.right = function(a) {
  if (this instanceof right) {
    this.get = a;
    this.fold = function(f,g) {return g(this.get);};
    this.fmap = function(f) {return right(f(this.get));};
    this.ap = function(fa) {return fa.fmap(curry(this.get));};
    this.bind = function(f) {return f(this.get);};
  }
  else {
    return new right(a);
  }
};

left.prototype = new either;
left.prototype.constructor = left;
right.prototype = new either;
right.prototype.constructor = right;
