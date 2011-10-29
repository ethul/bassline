requirejs = require "requirejs"
requirejs.config
  nodeRequire: require
  baseUrl: "src/"

requirejs ["bass","trampoline","functor","monad"], (bass,trampoline,functor,monad) ->
  describe "when the trampoline module i used", ->
    beforeEach ->
      @trampoline = trampoline

    beforeEach ->
      @done = @trampoline.done
      @more = @trampoline.more
      @cont = @trampoline.cont

    it "should compute fib", ->
      fib = (n) =>
        if n < 2 then @done(n)
        else fib(n-1).bind((x)->fib(n-2).fmap((y) -> x + y))
      x = fib(10)
      y = x.run()
      expect(y).toEqual(55)
