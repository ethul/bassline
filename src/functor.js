define(["bass","maybe","either","trampoline"], function(bass,maybe,either,trampoline) {

  var instance = bass.instance;
  var curry = bass.curry;
  var functor = {};

  // fmap :: (a -> b) -> m a -> m b

  instance(functor,maybe.nothing,{
    fmap: function(f) {return maybe.nothing()}
  });

  instance(functor,maybe.just,{
    fmap: function(f) {return maybe.just(curry(f)(this.get))}
  });

  instance(functor,either.left,{
    fmap: function(f) {return either.left(this.get)}
  });

  instance(functor,either.right,{
    fmap: function(f) {return either.right(curry(f)(this.get))}
  });

  instance(functor,trampoline.done,{
    fmap: function(f) {
      return this.bind(function(a) {
        return trampoline.more(function() {
          return trampoline.done(f(a))
        })
      })
    }
  });
});
