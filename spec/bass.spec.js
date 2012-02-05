var module = require("../lib/bass");

describe("when the bass module is used", function() {
  beforeEach(function() {
    this.curry = module.curry;
    this.slice = module.slice;
    var slice = this.slice;
    this.helper = function() {return slice(arguments);};
  });
  describe("when a function is curried", function() {
    it("should accept parameters partially", function() {
      var f, g;
      f = function(a, b, c) {return a + b + c;};
      g = this.curry(f);
      expect(g(1)(2)(3)).toEqual(f(1, 2, 3));
      expect(g(1, 2)(3)).toEqual(f(1, 2, 3));
      expect(g(1)(2, 3)).toEqual(f(1, 2, 3));
      expect(g(1, 2, 3)).toEqual(f(1, 2, 3));
      expect(g()()()()()()()(1)(2)(3)).toEqual(f(1, 2, 3));
    });
    it("should invoke a curried function in a supplied context", function() {
      var f, g, that;
      f = function(a, b) {return a + b + this.c;};
      that = {c: 5};
      g = this.curry(f, that);
      expect(g(1)(2)).toEqual(8);
    });
  });
  describe("when an array object is sliced", function() {
    it("should return an empty array for undefined", function() {
      return expect(this.slice()).toEqual([]);
    });
    it("should return an empty array for null", function() {
      return expect(this.slice(null)).toEqual([]);
    });
    it("should return an array of 5 items when passed a 5 item array", function() {
      return expect(this.slice([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
    });
  });
  describe("when an the arguments object is sliced", function() {
    it("should return an empty array when no arguments are passed", function() {
      return expect(this.helper()).toEqual([]);
    });
    it("should return an array with one value with one argument", function() {
      return expect(this.helper("a")).toEqual(["a"]);
    });
    it("should return an array with five values with five arguments", function() {
      return expect(this.helper(1, 2, 3, 4, 5)).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
