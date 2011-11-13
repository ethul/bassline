// the either module encapsulates an object that can contain two possible
// values: left or right. an example of how this might be used is in the
// failure/success scenario. typically left is used to wrap a failure, and
// right is used to wrap a success.

// the either object will be at the top of the prototype chain
// any shared properties between left and right may go here

var either = function() {};

// the left object represents the first possible value, sometimes
// used to wrap an error. the get property may access the left value

var left = function(e) {
  if (this instanceof left) {
    this.get = e;
  }
  else {
    return new left(e);
  }
};

// the right object represents the second possible value, sometimes
// used to wrap a success. the get property may acces the right value

var right = function(a) {
  if (this instanceof right) {
    this.get = a;
  }
  else {
    return new right(a);
  }
};

// set up the prototype chain for left and right, and fix the
// constructor reference to be the function used to construct
// the object.

left.prototype = new either;
left.prototype.constructor = left;

right.prototype = new either;
right.prototype.constructor = right;

module.exports = {
  left: left,
  right: right
};
