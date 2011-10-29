requirejs = require "requirejs"
requirejs.config
  nodeRequire: require
  baseUrl: "src/"

requirejs ["bass","either","plus","wstring","wlist","functor","applicative","monad","monoid"], (bass,either,plus,wstring,wlist,functor,applicative,monad,monoid) ->
  describe "when the either module is used", ->
    beforeEach ->
      @either = either
      @plus = plus
      @wstring = wstring
      @wlist = wlist

    beforeEach ->
      @left = @either.left
      @right = @either.right
      @plus = @plus.plus
      @wstring = @wstring.wstring
      @wlist = @wlist.wlist

    it "should have a Left constructor", ->
      expect(@left "test").toBeDefined
      expect(@left("test").get).toEqual("test")

    it "should have a Right constructor", ->
      expect(@right "test").toBeDefined
      expect(@right("test").get).toEqual("test")

    describe "when used as a Functor", ->
      it "should hold to identity: forall a . either(a) == either(a).fmap(identity)", ->
        id = (a) -> a
        expect(@right(10).get).toEqual(@right(10).fmap(id).get)
        expect(@left("error").get).toEqual(@left("error").fmap(id).get)

      it "should hold to composition: forall a,f,g . either(a).fmap(f compose g) = either(a).fmap(g).fmap(f)", ->
        compose = (x,y) -> (z) -> x(y(z))
        f = (a) -> a+5
        g = (a) -> a+10
        a = 10
        expect(@right(a).fmap(compose f,g).get).toEqual(@right(a).fmap(g).fmap(f).get)
        expect(@left(a).fmap(compose f,g).get).toEqual(@left(a).fmap(g).fmap(f).get)

    describe "when used as an Applicative Functor", ->
      it "should hold to identity: forall a . a == pure(identity).ap(a)", ->
        id = (a) -> a
        x = @right(10)
        expect(x.get).toEqual(@either.pure(id).ap(x).get)
        y = @left(10)
        expect(y.get).toEqual(@either.pure(id).ap(y).get)

      it "should hold to composition: forall af,ag,a . af.ap(ag.ap(a)) == pure(compose).ap(af).ap(ag).ap(a)", ->
        compose = (a,b)->(x)-> a(b(x))
        af = @right((a) -> a+4)
        ag = @right((a) -> a+6)
        a = @right(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @left((a)->a+4)
        ag = @right((a)->a+6)
        a = @right(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @right((a)->a+4)
        ag = @left((a)->a+6)
        a = @right(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @right((a)->a+4)
        ag = @right((a)->a+6)
        a = @left(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @left((a)->a+4)
        ag = @left((a)->a+6)
        a = @right(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @left((a)->a+4)
        ag = @right((a)->a+6)
        a = @left(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @right((a)->a+4)
        ag = @left((a)->a+6)
        a = @left(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)
        af = @left((a)->a+4)
        ag = @left((a)->a+6)
        a = @left(5)
        expect(af.ap(ag.ap(a)).get).toEqual(@either.pure(compose).ap(af).ap(ag).ap(a).get)

      it "should hold to homomorphism: forall f a . pure(f).ap(pure(a)) == pure(f(a))", ->
        f = (a)->a+20
        a = 10
        expect(@either.pure(f).ap(@either.pure(a)).get).toEqual(@either.pure(f(a)).get)

      it "should hold to interchange: forall af a . af.ap(pure(a)) == pure(->(f) {f(a)}).ap(af)", ->
        f = (a)->a+10
        a = 30
        expect(@right(f).ap(@either.pure(a)).get).toEqual(@either.pure((g)->g(a)).ap(@right(f)).get)
        expect(@left(f).ap(@either.pure(a)).get).toEqual(@either.pure((g)->g(a)).ap(@left(f)).get)

    describe "validation with a list", ->
      it "should accumulate the errors", ->
        x = @either.pure((a,b,c)->a+b+c).ap(@left @wlist ["error a"]).ap(@left @wlist ["error b"]).ap(@left @wlist ["error c"])
        expect(x.get.get).toEqual(["error a","error b","error c"])
        y = @either.pure((a,b,c)->a+b+c).ap(@left @wstring "error a").ap(@left @wstring "error b").ap(@left @wstring "error c")
        expect(y.get.get).toEqual("error a" + "error b" + "error c")
        z = @either.pure((a,b,c)->a+b+c).ap(@left @plus 2).ap(@left @plus 3).ap(@left @plus 4)
        expect(z.get.get).toEqual(2 + 3 + 4)

    describe "when used as a Monad", ->
      it "should hold to left identity: forall f,a . f(a) == return(a).bind(f)", ->
        a = 10
        f = (x)=>@right(x)
        expect(f(a).get).toEqual(@either.return(a).bind(f).get)
        f = (x)=>@left(x)
        expect(f(a).get).toEqual(@either.return(a).bind(f).get)

      it "should hold to right identity: forall ma . ma == ma.bind(x -> return(x))", ->
        a = 10
        expect(@right(a).get).toEqual(@right(a).bind((x)=>@either.return(x)).get)
        expect(@left(a).get).toEqual(@left(a).bind((x)=>@either.return(x)).get)

      it "should hold to associativity: forall ma,f,g . (ma.bind(f)).bind(g) == ma.bind(x -> f(x).bind(g))", ->
        a = 10
        f = (a)=>@right(a+10)
        g = (a)=>@right(a+30)
        expect((@right(a).bind(f)).bind(g).get).toEqual(@right(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@left(a+10)
        g = (a)=>@right(a+30)
        expect((@right(a).bind(f)).bind(g).get).toEqual(@right(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@left(a+10)
        g = (a)=>@left(a+30)
        expect((@right(a).bind(f)).bind(g).get).toEqual(@right(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@right(a+10)
        g = (a)=>@left(a+30)
        expect((@right(a).bind(f)).bind(g).get).toEqual(@right(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@right(a+10)
        g = (a)=>@right(a+30)
        expect((@left(a).bind(f)).bind(g).get).toEqual(@left(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@right(a+10)
        g = (a)=>@left(a+30)
        expect((@left(a).bind(f)).bind(g).get).toEqual(@left(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@left(a+10)
        g = (a)=>@right(a+30)
        expect((@left(a).bind(f)).bind(g).get).toEqual(@left(a).bind((x)->f(x).bind(g)).get)
        f = (a)=>@left(a+10)
        g = (a)=>@left(a+30)
        expect((@left(a).bind(f)).bind(g).get).toEqual(@left(a).bind((x)->f(x).bind(g)).get)
