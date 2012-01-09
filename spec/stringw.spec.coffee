bassline = require "../lib/bassline"

describe "when the stringw module is used", ->
  beforeEach ->
    @module = bassline.stringw
    @stringw = @module.stringw

  describe "when a string is wrapped", ->
    it "should be accessible by a get", ->
      string = "abcde"
      stringw = @stringw string
      expect(stringw.get).toEqual(string)

  describe "when a non-string is wrapped", ->
    it "should raise an error for an Array", ->
      nonstring = [1]
      expect(() => @stringw(nonstring)).toThrow(new Error("Invalid String: [object Array]"));

    it "should raise an error for an Object", ->
      nonstring = {a:"1"}
      expect(() => @stringw(nonstring)).toThrow(new Error("Invalid String: [object Object]"));

    it "should raise an error for a Function", ->
      nonstring = () -> "a"
      expect(() => @stringw(nonstring)).toThrow(new Error("Invalid String: [object Function]"));

    it "should raise an error for a Number", ->
      nonstring = 10
      expect(() => @stringw(nonstring)).toThrow(new Error("Invalid String: [object Number]"));

    it "should raise an error for a Boolean", ->
      nonstring = false
      expect(() => @stringw(nonstring)).toThrow(new Error("Invalid String: [object Boolean]"));

  describe "when used as a functor", ->
    it "should hold to identity: forall a . stringw(a) == stringw(a).fmap(identity)", ->
      id = (a) -> a
      a = "abcde"
      expect(@stringw(a).get).toEqual(@stringw(a).fmap(id).get)

    it "should hold to composition: forall a,f,g . stringw(a).fmap(f compose g) = stringw(a).fmap(g).fmap(f)", ->
      compose = (x,y) -> (z) -> x(y(z))
      f = (a) -> a+10
      g = (a) -> a+4
      a = "abcde"
      expect(@stringw(a).fmap(compose f,g).get).toEqual(@stringw(a).fmap(g).fmap(f).get)

  describe "when used as a Monoid", ->
    it "should hold to closure: forall a,b . a.mappend(b) is in the monoid", ->
      a = @stringw "abcde"
      b = @stringw "xyzw"
      expect(a.mappend(b).get).toEqual("abcdexyzw")

    it "should hold to associativity: forall a,b,c . a.mappend(b).mappend(c) == a.mappend(b.mappend(c))", ->
      a = @stringw "aaa"
      b = @stringw "bbb"
      c = @stringw "ccc"
      expect(a.mappend(b).mappend(c).get).toEqual(a.mappend(b.mappend(c)).get)

    it "should hold to left identity: forall a. ma.mempty.mappend(a) == a", ->
      a = @stringw "aaa"
      expect(@module.mempty().mappend(a).get).toEqual(a.get)

    it "should hold to right identity: forall a. a.append(ma.mempty) == a", ->
      a = @stringw "aaa"
      expect(a.mappend(@module.mempty()).get).toEqual(a.get)
