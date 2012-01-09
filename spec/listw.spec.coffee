bassline = require "../lib/bassline"

describe "when the listw module is used", ->
  beforeEach ->
    @module = bassline.listw
    @listw = @module.listw

  describe "when a list is wrapped", ->
    it "should be accessible by a get", ->
      list = [1,2,3]
      listw = @listw list
      expect(listw.get).toEqual(list)

  describe "when a non-list is wrapped", ->
    it "should raise an error for a String", ->
      nonlist = "a"
      expect(() => @listw(nonlist)).toThrow(new Error("Invalid List: [object String]"));

    it "should raise an error for an Object", ->
      nonlist = {a:"1"}
      expect(() => @listw(nonlist)).toThrow(new Error("Invalid List: [object Object]"));

    it "should raise an error for a Function", ->
      nonlist = () -> "a"
      expect(() => @listw(nonlist)).toThrow(new Error("Invalid List: [object Function]"));

    it "should raise an error for a Number", ->
      nonlist = 10
      expect(() => @listw(nonlist)).toThrow(new Error("Invalid List: [object Number]"));

  describe "when used as a functor", ->
    it "should hold to identity: forall a . listw(a) == listw(a).fmap(identity)", ->
      id = (a) -> a
      a = [1,2,3]
      expect(@listw(a).get).toEqual(@listw(a).fmap(id).get)

    it "should hold to composition: forall a,f,g . listw(a).fmap(f compose g) = listw(a).fmap(g).fmap(f)", ->
      compose = (x,y) -> (z) -> x(y(z))
      f = (a) -> a+5
      g = (a) -> a+10
      a = [1,2,3]
      expect(@listw(a).fmap(compose f,g).get).toEqual(@listw(a).fmap(g).fmap(f).get)

  describe "when used as an Applicative Functor", ->
    it "should hold to identity: forall a . a == pure(identity).ap(a)", ->
      id = (a) -> a
      x = @listw ["a","b"]
      expect(x.get).toEqual(@module.pure(id).ap(x).get)

    it "should hold to composition: forall af,ag,a . af.ap(ag.ap(a)) == pure(compose).ap(af).ap(ag).ap(a)", ->
      compose = (a,b)->(x)-> a(b(x))
      af = @listw [(a) -> a+4]
      ag = @listw [(a) -> a+6]
      a = @listw [5]
      expect(af.ap(ag.ap(a)).get).toEqual([15])
      expect(af.ap(ag.ap(a)).get).toEqual(@module.pure(compose).ap(af).ap(ag).ap(a).get)

    it "should hold to homomorphism: forall f a . pure(f).ap(pure(a)) == pure(f(a))", ->
      f = (a)->a+20
      a = 10
      expect(@module.pure(f).ap(@module.pure(a)).get).toEqual(@module.pure(f(a)).get)

    it "should hold to interchange: forall af a . af.ap(pure(a)) == pure(->(f) {f(a)}).ap(af)", ->
      f = (a)->a+10
      a = 30
      expect(@listw([f]).ap(@module.pure(a)).get).toEqual(@module.pure((g)->g(a)).ap(@listw([f])).get)

  describe "when used as a Monad", ->
    it "should hold to left identity: forall f,a . f(a) == return(a).bind(f)", ->
      a = 10
      f = (x) => @listw [x]
      expect(f(a).get).toEqual(@module.return(a).bind(f).get)

    it "should hold to right identity: forall ma . ma == ma.bind(x -> return(x))", ->
      a = [10]
      expect(@listw(a).get).toEqual(@listw(a).bind((x)=>@module.return(x)).get)

    it "should hold to associativity: forall ma,f,g . (ma.bind(f)).bind(g) == ma.bind(x -> f(x).bind(g))", ->
      a = [10]
      f = (a) => @listw [a+10]
      g = (a) => @listw [a+30]
      expect((@listw(a).bind(f)).bind(g).get).toEqual(@listw(a).bind((x)->f(x).bind(g)).get)

  describe "when used as a Monoid", ->
    it "should hold to closure: forall a,b . a.mappend(b) is in the monoid", ->
      a = @listw [1]
      b = @listw [2]
      expect(a.mappend(b).get).toEqual([1,2])

    it "should hold to associativity: forall a,b,c . a.mappend(b).mappend(c) == a.mappend(b.mappend(c))", ->
      a = @listw [1]
      b = @listw [2]
      c = @listw [3]
      expect(a.mappend(b).mappend(c).get).toEqual(a.mappend(b.mappend(c)).get)

    it "should hold to left identity: forall a. ma.mempty.mappend(a) == a", ->
      a = @listw [1]
      expect(@module.mempty().mappend(a).get).toEqual(a.get)

    it "should hold to right identity: forall a. a.append(ma.mempty) == a", ->
      a = @listw [1]
      expect(a.mappend(@module.mempty()).get).toEqual(a.get)
