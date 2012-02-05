bassline = require "../lib/bassline"

describe "when the bass module is used", ->
  beforeEach ->
    @bass = bassline.bass
    @curry = @bass.curry
    @derive = @bass.derive
    @slice = @bass.slice
    @toString = @bass.toString
    @helper = () => @slice arguments

  describe "when a function is curried", ->
    it "should accept parameters partially", ->
      f = (a,b,c) -> a + b + c
      g = @curry(f)
      expect(g(1)(2)(3)).toEqual(f 1,2,3)
      expect(g(1,2)(3)).toEqual(f 1,2,3)
      expect(g(1)(2,3)).toEqual(f 1,2,3)
      expect(g(1,2,3)).toEqual(f 1,2,3)
      expect(g()()()()()()()(1)(2)(3)).toEqual(f 1,2,3)

    it "should invoke a curried function in a supplied context", ->
      f = (a,b) -> a + b + this.c
      that = {c: 5}
      g = @curry(f,that)
      expect(g(1)(2)).toEqual(8)

  describe "when an array object is sliced", ->
    it "should return an empty array for undefined", ->
      expect(@slice()).toEqual([])

    it "should return an empty array for null", ->
      expect(@slice(null)).toEqual([])

    it "should return an array of 5 items when passed a 5 item array", ->
      expect(@slice([1,2,3,4,5])).toEqual([1,2,3,4,5])

  describe "when an the arguments object is sliced", ->
    it "should return an empty array when no arguments are passed", ->
      expect(@helper()).toEqual([])

    it "should return an array with one value with one argument", ->
      expect(@helper "a").toEqual(["a"])

    it "should return an array with five values with five arguments", ->
      expect(@helper 1,2,3,4,5).toEqual([1,2,3,4,5])

  describe "when a constructor is derived from another", ->
    it "should place the derivator in the prototype chain of the derivative", ->
      derivative = () -> this.a = "a"
      derivator = () -> this.b = "b"
      a = new derivative
      expect(a.b).toBeUndefined()
      @derive(derivative).from(derivator)
      b = new derivative
      expect(b.hasOwnProperty("b")).toBeFalsy()
      expect(b.b).toEqual("b")

    it "should place the additional properties in the protoype chain of the derivative", ->
      derivative = () -> this.a = "a"
      derivator = () -> this.b = "b"
      a = new derivative
      expect(a.c).toBeUndefined()
      @derive(derivative).from(derivator, c: "c")
      b = new derivative
      expect(b.hasOwnProperty("c")).toBeFalsy()
      expect(b.c).toEqual("c")

    it "should preserve the existing prototype of the derivative", ->
      class A
        a: "a"
      class B extends A
        b: "b"

      # The way CoffeeScript creates a class is by putting the methods
      # in the prototype; however, if the class is to be derived from,
      # then the derive method doesn't take anything from the class's
      # prototype, just it's own properties. Therefore, we make a
      # traditional constructor here to provide what is expected.
      C = () -> this.c = "c"

      b = new B
      expect(b.b).toEqual("b")
      expect(b.a).toEqual("a")

      @derive(B).from(C)
      c = new B
      expect(c.b).toEqual("b")
      expect(c.a).toEqual("a")
      expect(c.c).toEqual("c")

  describe "when toString is invoked on an object", ->
    it "should provide the string form for a String", ->
      expect(@toString "").toEqual("[object String]")

    it "should provide the string form for an Array", ->
      expect(@toString []).toEqual("[object Array]")

    it "should provide the string form for a Number", ->
      expect(@toString 0).toEqual("[object Number]")

    it "should provide the string form for a Boolean", ->
      expect(@toString false).toEqual("[object Boolean]")

    it "should provide the string form for null", ->
      expect(@toString null).toEqual("[object global]")

    it "should provide the string form for undefined", ->
      expect(@toString undefined).toEqual("[object global]")
