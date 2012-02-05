var module = require("../lib/either");
describe("when the either module is used", function() {
  beforeEach(function() {
    this.either = module.either;
    this.left = module.left;
    this.right = module.right;
  });

  it("should have a Left constructor", function() {
    expect(this.left("test")).toBeDefined;
    expect(this.left("test").get).toEqual("test");
  });

  it("should have a Right constructor", function() {
    expect(this.right("test")).toBeDefined;
    expect(this.right("test").get).toEqual("test");
  });

  describe("when used as a Functor", function() {
    it("should hold to identity: forall a . either(a) == either(a).fmap(identity)", function() {
      var id;
      id = function(a) {
        return a;
      };
      expect(this.right(10).get).toEqual(this.right(10).fmap(id).get);
      expect(this.left("error").get).toEqual(this.left("error").fmap(id).get);
    });
    it("should hold to composition: forall a,f,g . either(a).fmap(f compose g) = either(a).fmap(g).fmap(f)", function() {
      var a, compose, f, g;
      compose = function(x, y) {
        return function(z) {
          return x(y(z));
        };
      };
      f = function(a) {
        return a + 5;
      };
      g = function(a) {
        return a + 10;
      };
      a = 10;
      expect(this.right(a).fmap(compose(f, g)).get).toEqual(this.right(a).fmap(g).fmap(f).get);
      expect(this.left(a).fmap(compose(f, g)).get).toEqual(this.left(a).fmap(g).fmap(f).get);
    });
  });

  describe("when used as an Applicative Functor", function() {
    it("should hold to identity: forall a . a == pure(identity).ap(a)", function() {
      var id, x, y;
      id = function(a) {
        return a;
      };
      x = this.right(10);
      expect(x.get).toEqual(this.either().pure(id).ap(x).get);
      y = this.left(10);
      expect(y.get).toEqual(this.either().pure(id).ap(y).get);
    });
    it("should hold to composition: forall af,ag,a . af.ap(ag.ap(a)) == pure(compose).ap(af).ap(ag).ap(a)", function() {
      var a, af, ag, compose;
      compose = function(a, b) {
        return function(x) {
          return a(b(x));
        };
      };
      af = this.right(function(a) {return a + 4;});
      ag = this.right(function(a) {return a + 6;});
      a = this.right(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.left(function(a) {return a + 4;});
      ag = this.right(function(a) {return a + 6;});
      a = this.right(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.right(function(a) {return a + 4;});
      ag = this.left(function(a) {return a + 6;});
      a = this.right(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.right(function(a) {return a + 4;});
      ag = this.right(function(a) {return a + 6;});
      a = this.left(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.left(function(a) {return a + 4;});
      ag = this.left(function(a) {return a + 6;});
      a = this.right(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.left(function(a) {return a + 4;});
      ag = this.right(function(a) {return a + 6;});
      a = this.left(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.right(function(a) {return a + 4;});
      ag = this.left(function(a) {return a + 6;});
      a = this.left(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
      af = this.left(function(a) {return a + 4;});
      ag = this.left(function(a) {return a + 6;});
      a = this.left(5);
      expect(af.ap(ag.ap(a)).get).toEqual(this.either().pure(compose).ap(af).ap(ag).ap(a).get);
    });
    it("should hold to homomorphism: forall f a . pure(f).ap(pure(a)) == pure(f(a))", function() {
      var a, f;
      f = function(a) {return a + 20;};
      a = 10;
      expect(this.either().pure(f).ap(this.either().pure(a)).get).toEqual(this.either().pure(f(a)).get);
    });
    it("should hold to interchange: forall af a . af.ap(pure(a)) == pure(->(f) {f(a)}).ap(af)", function() {
      var a, f;
      f = function(a) {return a + 10;};
      a = 30;
      expect(this.right(f).ap(this.either().pure(a)).get).toEqual(this.either().pure(function(g) {return g(a);}).ap(this.right(f)).get);
      expect(this.left(f).ap(this.either().pure(a)).get).toEqual(this.either().pure(function(g) {return g(a);}).ap(this.left(f)).get);
    });
  });

  describe("when used as a Monad", function() {
    it("should hold to left identity: forall f,a . f(a) == return(a).bind(f)", function() {
      var right = this.right;
      var left = this.left;
      var either = this.either;
      var a, f;
      a = 10;
      f = function(x) {return right(x);};
      expect(f(a).get).toEqual(this.either().return(a).bind(f).get);
      f = function(x) {return left(x);};
      expect(f(a).get).toEqual(this.either().return(a).bind(f).get);
    });
    it("should hold to right identity: forall ma . ma == ma.bind(x -> return(x))", function() {
      var either = this.either;
      var a;
      a = 10;
      expect(this.right(a).get).toEqual(this.right(a).bind(function(x) {return either().return(x);}).get);
      expect(this.left(a).get).toEqual(this.left(a).bind(function(x) {return either().return(x);}).get);
    });
    it("should hold to associativity: forall ma,f,g . (ma.bind(f)).bind(g) == ma.bind(x -> f(x).bind(g))", function() {
      var right = this.right;
      var left = this.left;
      var a, f, g;
      a = 10;
      f = function(a) {return right(a + 10);};
      g = function(a) {return right(a + 30);};
      expect((this.right(a).bind(f)).bind(g).get).toEqual(this.right(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return left(a + 10);};
      g = function(a) {return right(a + 30);};
      expect((this.right(a).bind(f)).bind(g).get).toEqual(this.right(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return left(a + 10);};
      g = function(a) {return left(a + 30);};
      expect((this.right(a).bind(f)).bind(g).get).toEqual(this.right(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return right(a + 10);};
      g = function(a) {return left(a + 30);};
      expect((this.right(a).bind(f)).bind(g).get).toEqual(this.right(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return right(a + 10);};
      g = function(a) {return right(a + 30);};
      expect((this.left(a).bind(f)).bind(g).get).toEqual(this.left(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return right(a + 10);};
      g = function(a) {return left(a + 30);};
      expect((this.left(a).bind(f)).bind(g).get).toEqual(this.left(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return left(a + 10);};
      g = function(a) {return right(a + 30);};
      expect((this.left(a).bind(f)).bind(g).get).toEqual(this.left(a).bind(function(x) {return f(x).bind(g);}).get);
      f = function(a) {return left(a + 10);};
      g = function(a) {return left(a + 30);};
      expect((this.left(a).bind(f)).bind(g).get).toEqual(this.left(a).bind(function(x) {return f(x).bind(g);}).get);
    });
  });
});
