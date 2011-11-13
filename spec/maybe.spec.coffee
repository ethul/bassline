bassline = require "../lib/bassline"

describe "when the maybe module is used", ->
  beforeEach ->
    @maybe = bassline.maybe

  beforeEach ->
    @nothing = @maybe.nothing
    @just = @maybe.just

  it "should have a nothing factory method", ->
    expect(@nothing()).toBeDefined
    expect(@nothing().get).toNotBeDefined
    expect(@nothing().constructor).toEqual(@nothing)

  it "should have a just factory method", ->
    expect(@just "test").toBeDefined
    expect(@just(10).get).toBeDefined
    expect(@just(10).get).toEqual(10)
    expect(@just(10).constructor).toEqual(@just)

  describe "when used as a functor", ->
    it "should hold to identity: forall a . maybe(a) == maybe(a).fmap(identity)", ->
      id = (a) -> a
      a = 10
      expect(@just(a).get).toEqual(@just(a).fmap(id).get)

    it "should hold to composition: forall a,f,g . maybe(a).fmap(f compose g) = maybe(a).fmap(g).fmap(f)", ->
      compose = (x,y) -> (z) -> x(y(z))
      f = (a) -> a+5
      g = (a) -> a+10
      a = 10
      expect(@just(a).fmap(compose f,g).get).toEqual(@just(a).fmap(g).fmap(f).get)

  describe "when used as an Applicative Functor", ->
    it "should hold to identity: forall a . a == pure(identity).ap(a)", ->
      id = (a) -> a
      x = @just 10
      expect(x.get).toEqual(@maybe.pure(id).ap(x).get)
      x = @nothing()
      expect(x.__proto__.constructor).toEqual(@maybe.pure(id).ap(x).__proto__.constructor)

    it "should hold to composition: forall af,ag,a . af.ap(ag.ap(a)) == pure(compose).ap(af).ap(ag).ap(a)", ->
      compose = (a,b) -> (x) -> a(b(x))
      af = @just((a) -> a+4)
      ag = @just((a) -> a+6)
      a = @just(5)
      expect(af.ap(ag.ap(a)).get).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).get)
      af = @nothing()
      ag = @just((a) -> a+6)
      a = @just(5)
      expect(af.ap(ag.ap(a)).__proto__.constructor).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).__proto__.constructor)
      af = @just((a) -> a+4)
      ag = @nothing()
      a = @just(5)
      expect(af.ap(ag.ap(a)).__proto__.constructor).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).__proto__.constructor)
      af = @just((a) -> a+4)
      ag = @just((a) -> a+6)
      a = @nothing()
      expect(af.ap(ag.ap(a)).__proto__.constructor).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).__proto__.constructor)
      af = @nothing()
      ag = @nothing()
      a = @just(5)
      expect(af.ap(ag.ap(a)).__proto__.constructor).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).__proto__.constructor)
      af = @nothing()
      ag = @just((a) -> a+6)
      a = @nothing()
      expect(af.ap(ag.ap(a)).__proto__.constructor).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).__proto__.constructor)
      af = @nothing()
      ag = @nothing()
      a = @nothing()
      expect(af.ap(ag.ap(a)).__proto__.constructor).toEqual(@maybe.pure(compose).ap(af).ap(ag).ap(a).__proto__.constructor)

    it "should hold to homomorphism: forall f a . pure(f).ap(pure(a)) == pure(f(a))", ->
      f = (a) -> a+20
      a = 10
      expect(@maybe.pure(f).ap(@maybe.pure(10)).get).toEqual(@maybe.pure(f(a)).get)

    it "should hold to interchange: forall af a . af.ap(pure(a)) == pure((f) -> f(a)).ap(af)", ->
      f = (a) -> a+10
      a = 30
      expect(@just(f).ap(@maybe.pure(a)).get).toEqual(@maybe.pure((g) -> g(a)).ap(@just(f)).get)
      expect(@nothing().ap(@maybe.pure(a)).__proto__.constructor).toEqual(@maybe.pure((g) -> g(a)).ap(@nothing()).__proto__.constructor)

  describe "when used as a Monad", ->
    it "should hold to left identity: forall f,a . f(a) == return(a).bind(f)", ->
      f = (a)=>@just(a)
      a = 10
      expect(f(a).get).toEqual(@just(a).bind(f).get)

    it "should hold to right identity: forall ma . ma == ma.bind(x -> return(x))", ->
      a = 10
      expect(@just(a).get).toEqual(@just(a).bind((x)=>@maybe.return(x)).get)
      expect(@nothing().__proto__.constructor).toEqual(@nothing().bind((x)=>@maybe.return(x)).__proto__.constructor)

    it "should hold to associativity: forall ma,f,g . (ma.bind(f)).bind(g) == ma.bind(x -> f(x).bind(g))", ->
      a = 10
      f = (a)=>@just(a+10)
      g = (a)=>@just(a+30)
      expect((@just(a).bind(f)).bind(g).get).toEqual(@just(a).bind((x)->f(x).bind(g)).get)
      expect((@nothing().bind(f)).bind(g).__proto__.constructor).toEqual(@nothing().bind((x)->f(x).bind(g)).__proto__.constructor)
