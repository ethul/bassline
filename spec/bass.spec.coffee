requirejs = require "requirejs"
requirejs.config nodeRequire: require

requirejs ["src/bass.js"], (bass) ->
  describe "when the bass module is used", ->
    beforeEach ->
      @curry = bass.curry

    describe "when a function is curried", ->
      it "should accept parameters partially", ->
        f = (a,b,c) -> a + b + c
        g = @curry(f)
        expect(g(1)(2)(3)).toEqual(f 1,2,3)
        expect(g(1,2)(3)).toEqual(f 1,2,3)
        expect(g(1)(2,3)).toEqual(f 1,2,3)
        expect(g(1,2,3)).toEqual(f 1,2,3)
        expect(g()()()()()()()(1)(2)(3)).toEqual(f 1,2,3)
