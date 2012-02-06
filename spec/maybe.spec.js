var module = require("../lib/maybe");

describe("when the maybe module is used", function() {
  beforeEach(function() {
    this.maybe = module.maybe;
    this.nothing = module.nothing;
    this.just = module.just;
  });

  it("should have a nothing factory method", function() {
    expect(this.nothing()).toBeDefined;
    expect(this.nothing().get).toNotBeDefined;
    expect(this.nothing().constructor).toEqual(this.nothing);
  });

  it("should have a just factory method", function() {
    expect(this.just("test")).toBeDefined;
    expect(this.just(10).get).toBeDefined;
    expect(this.just(10).get).toEqual(10);
    expect(this.just(10).constructor).toEqual(this.just);
  });

  describe("when used as a functor", function() {
    it("should hold to identity: forall a . maybe(a) == maybe(a).fmap(identity)", function() {
      var a, id;
      id = function(a) {return a;};
      a = 10;
      expect(this.just(a).get).toEqual(this.just(a).fmap(id).get);
    });
    it("should hold to composition: forall a,f,g . maybe(a).fmap(f compose g) = maybe(a).fmap(g).fmap(f)", function() {
      var a, compose, f, g;
      compose = function(x, y) {
        return function(z) {
          return x(y(z));
        };
      };
      f = function(a) {return a + 5;};
      g = function(a) {return a + 10;};
      a = 10;
      expect(this.just(a).fmap(compose(f, g)).get).toEqual(this.just(a).fmap(g).fmap(f).get);
    });
  });

  describe("when used as an Applicative Functor", function() {
    it("should hold to identity: forall a . a == pure(identity).ap(a)", function() {
      var id, x;
      id = function(a) {return a;};
      x = this.just(10);
      expect(x.get).toEqual(this.maybe().pure(id).ap(x).get);
      x = this.nothing();
      expect(x.get).toEqual(this.maybe().pure(id).ap(x).get);
    });
    it("should hold to composition: forall af,ag,a . af.ap(ag.ap(a)) == pure(compose).ap(af).ap(ag).ap(a)", function() {
      var a, af, ag, compose;
      compose = function(a, b) {
        return function(x) {
          return a(b(x));
        };
      };
      af = this.just(function(a) {return a + 4;});
      ag = this.just(function(a) {return a + 6;});
      a = this.just(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.nothing();
      ag = this.just(function(a) {return a + 6;});
      a = this.just(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.just(function(a) {return a + 4;});
      ag = this.nothing();
      a = this.just(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.just(function(a) {return a + 4;});
      ag = this.just(function(a) {return a + 6;});
      a = this.nothing();
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.nothing();
      ag = this.nothing();
      a = this.just(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.nothing();
      ag = this.just(function(a) {return a + 6;});
      a = this.nothing();
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.nothing();
      ag = this.nothing();
      a = this.nothing();
      expect(af.ap(ag.ap(a)).get).toEqual(this.maybe().pure(compose).ap(af).ap(ag).ap(a).get);
    });
    it("should hold to homomorphism: forall f a . pure(f).ap(pure(a)) == pure(f(a))", function() {
      var a, f;
      f = function(a) {return a + 20;};
      a = 10;
      expect(this.maybe().pure(f).ap(this.maybe().pure(10)).get).toEqual(this.maybe().pure(f(a)).get);
    });
    it("should hold to interchange: forall af a . af.ap(pure(a)) == pure((f) -> f(a)).ap(af)", function() {
      var a, f;
      f = function(a) {return a + 10;};
      a = 30;
      expect(this.just(f).ap(this.maybe().pure(a)).get).toEqual(this.maybe().pure(function(g) {return g(a);}).ap(this.just(f)).get);
      expect(this.nothing().ap(this.maybe().pure(a)).get).toEqual(this.maybe().pure(function(g) {return g(a);}).ap(this.nothing()).get);
    });
  });

  describe("when used as a Monad", function() {
    it("should hold to left identity: forall f,a . f(a) == return(a).bind(f)", function() {
      var just = this.just;
      var a, f;
      f = function(a) {return just(a);};
      a = 10;
      expect(f(a).get).toEqual(this.just(a).bind(f).get);
    });
    it("should hold to right identity: forall ma . ma == ma.bind(x -> return(x))", function() {
      var maybe = this.maybe;
      var a;
      a = 10;
      expect(this.just(a).get).toEqual(this.just(a).bind(function(x) {return maybe().return(x);}).get);
      expect(this.nothing().get).toEqual(this.nothing().bind(function(x) {return maybe().return(x);}).get);
    });
    it("should hold to associativity: forall ma,f,g . (ma.bind(f)).bind(g) == ma.bind(x -> f(x).bind(g))", function() {
      var just = this.just;
      var a, f, g;
      a = 10;
      f = function(a) {return just(a + 10);};
      g = function(a) {return just(a + 30);};
      expect((this.just(a).bind(f)).bind(g).get).toEqual(this.just(a).bind(function(x) {return f(x).bind(g);}).get);
      expect((this.nothing().bind(f)).bind(g).get).toEqual(this.nothing().bind(function(x) {return f(x).bind(g);}).get);
    });
  });

  // Issue #1
  describe("when fold is called on nothing with a function having optional arguments", function() {
    it("should invoke the function", function() {
      var expected = "in nothing";
      var next = function(error) {return expected;};
      expect(this.nothing().fold(next, function(){console.log("in just");})).toEqual(expected);
    });
  });
});
