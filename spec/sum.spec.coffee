bassline = require "../lib/bassline"

describe "when the sum module is used", ->
  beforeEach ->
    @module = bassline.sum
    @sum= @module.sum

  describe "when a number is wrapped", ->
    it "should be accessible with a get", ->
      expect(@sum(1).get).toEqual(1)

  describe "when a non-number is wrapped", ->
    it "should raise an error for an Array", ->
      nonnumber = [1]
      expect(() => @sum(nonnumber)).toThrow(new Error("Invalid Number: [object Array]"));

    it "should raise an error for an Object", ->
      nonnumber = {a:"1"}
      expect(() => @sum(nonnumber)).toThrow(new Error("Invalid Number: [object Object]"));

    it "should raise an error for a Function", ->
      nonnumber = () -> "a"
      expect(() => @sum(nonnumber)).toThrow(new Error("Invalid Number: [object Function]"));

    it "should raise an error for a String", ->
      nonnumber = "a"
      expect(() => @sum(nonnumber)).toThrow(new Error("Invalid Number: [object String]"));

    it "should raise an error for a Boolean", ->
      nonnumber = false
      expect(() => @sum(nonnumber)).toThrow(new Error("Invalid Number: [object Boolean]"));

  describe "when used as a Monoid", ->
    it "should hold to closure: forall a,b . a.mappend(b) is in the monoid", ->
      a = @sum 10
      b = @sum 15
      expect(a.mappend(b).get).toEqual(25)

    it "should hold to associativity: forall a,b,c . a.mappend(b).mappend(c) == a.mappend(b.mappend(c))", ->
      a = @sum 1
      b = @sum 2
      c = @sum 3
      expect(a.mappend(b).mappend(c).get).toEqual(a.mappend(b.mappend(c)).get)

    it "should hold to left identity: forall a. ma.mempty.mappend(a) == a", ->
      a = @sum 10
      expect(@module.mempty().mappend(a).get).toEqual(a.get)

    it "should hold to right identity: forall a. a.append(ma.mempty) == a", ->
      a = @sum 10
      expect(a.mappend(@module.mempty()).get).toEqual(a.get)
