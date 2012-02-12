var module = require("../lib/promise")
  , path = require("path");

describe("when the promise module is used", function() {
  beforeEach(function() {
    this.promise = module.promise;
    this.id = function(a) {return a;};
    this.compose = function(f,g) {
      return function(a) {
        return f(g(a));
      };
    };
  });

  describe("when a promist has not been fulfilled", function() {
    beforeEach(function() {
      this.p = this.promise();
    });
    it("should get an undefined value", function() {
      expect(this.p.get()).toBe(undefined);
    });
    it("should indicated that it has not been fulfilled", function() {
      expect(this.p.fulfilled()).toBeFalsy();
    });
  });

  describe("when a promise has been fulfilled at creation", function() {
    beforeEach(function() {
      this.v = {a:"a",b:"b"};
      this.p = this.promise(this.v);
    });
    it("should get the value that fulfilled the promise", function() {
      expect(this.p.get()).toEqual(this.v);
    });
    it("should indicated that it has been fulfilled", function() {
      expect(this.p.fulfilled()).toBeTruthy();
    });
  });

  describe("when a promise has been fulfilled after created", function() {
    beforeEach(function() {
      this.p = this.promise();
      this.v = {a:"a",b:"b"};
      this.p.fulfill(this.v);
    });
    it("should get the value that fulfilled the promise", function() {
      expect(this.p.get()).toEqual(this.v);
    });
    it("should indicated that it has been fulfilled", function() {
      expect(this.p.fulfilled()).toBeTruthy();
    });
  });

  describe("when used as a functor", function() {
    it("should hold to identity: forall a . promise(a) == promise(a).fmap(identity)", function() {
      var a = 10;
      expect(this.promise(a).get()).toEqual(this.promise(a).fmap(this.id).get());
    });
    it("should hold to composition: forall a,f,g . promise(a).fmap(f compose g) = promise(a).fmap(g).fmap(f)", function() {
      var a, f, g;
      f = function(a) {return a + 5;};
      g = function(a) {return a + 10;};
      a = 10;
      expect(this.promise(a).fmap(this.compose(f,g)).get()).toEqual(this.promise(a).fmap(g).fmap(f).get());
    });
  });

  describe("when used as a Monad", function() {
    it("should hold to left identity: forall f,a . f(a) == return(a).bind(f)", function() {
      var promise = this.promise;
      var a, f;
      f = function(a) {return promise(a);};
      a = 10;
      expect(f(a).get()).toEqual(this.promise(a).bind(f).get());
    });
    it("should hold to right identity: forall ma . ma == ma.bind(x -> return(x))", function() {
      var promise = this.promise;
      var a;
      a = 10;
      expect(this.promise(a).get()).toEqual(this.promise(a).bind(function(x) {return promise().return(x);}).get());
    });
    it("should hold to associativity: forall ma,f,g . (ma.bind(f)).bind(g) == ma.bind(x -> f(x).bind(g))", function() {
      var promise = this.promise;
      var a, f, g;
      a = 10;
      f = function(a) {return promise(a + 10);};
      g = function(a) {return promise(a + 30);};
      expect((this.promise(a).bind(f)).bind(g).get()).toEqual(this.promise(a).bind(function(x) {return f(x).bind(g);}).get());
    });
  });

  describe("when a promise is used to compose async functions",function() {
    beforeEach(function() {
      var promise = this.promise;
      this.asyncf = function() {
        var p = promise();
        path.exists("/tmp",function(exists) {
          p.fulfill({f: exists});
        });
        return p;
      };
      this.asyncg = function(a) {
        var p = promise();
        path.exists("/tmp/g",function(exists) {
          p.fulfill({f: a.f, g: exists});
        });
        return p;
      };
      this.asynch = function(b) {
        var p = promise();
        path.exists("/tmp/h",function(exists) {
          p.fulfill({f: b.f, g: b.g, h: exists});
        });
        return p;
      };
    });

    it("should pipe the result through each function via bind", function() {
      var promise = this.promise;
      this.asyncf().bind(this.asyncg).bind(this.asynch).fold(function(a) {
        expect(a).toEqual({f:true,g:false,h:false});
        asyncSpecDone();
      });
      asyncSpecWait();
    });
  });
});
