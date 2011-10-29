define(["bass","maybe","either","trampoline"], function(bass,maybe,either,trampoline) {

  var instance = bass.instance;
  var curry = bass.curry;

  var monad = {
    ">>=": function(f) {return this.bind(f)}
  };

  // return :: a -> m a

  maybe.return = maybe.just
  either.return = either.right

  // bind :: m a -> (a -> m b) -> m b

  instance(monad,maybe.nothing,{
    bind: function(f) {return maybe.nothing()}
  });

  instance(monad,maybe.just,{
    bind: function(f) {return curry(f)(this.get)}
  });

  instance(monad,either.left,{
    bind: function(f) {return either.left(this.get)}
  });

  instance(monad,either.right,{
    bind: function(f) {return curry(f)(this.get)}
  });

  instance(monad,trampoline.done,{
    bind: function(f) {return trampoline.cont(this,f)}
  });

  return {
    ">>=": monad[">>="]
  }
});
