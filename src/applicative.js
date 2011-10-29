define(["bass","maybe","either","functor","folder"], function(bass,maybe,either,functor,folder) {

  var instance = bass.instance;
  var curry = bass.curry;

  var applicative = {
    // $ :: (a -> b) -> f a -> f b
    "$": function(f,fa) {return fa.fmap(f);}
  };

  // pure :: a -> f a

  maybe.pure = maybe.just
  either.pure = either.right

  // ap :: f (a -> b) -> f a -> f b

  instance(applicative,maybe.nothing,{
    ap: function(fa) {return maybe.nothing()}
  });

  instance(applicative,maybe.just,{
    ap: function(fa) {return fa.fmap(this.get)}
  });

  instance(applicative,either.left,{
    ap: function(fa) {
      var that = this;
      return this.fold(function(e) {
        return either.left("mappend" in that.get ? e.mappend(fa.get) : e)
      },function(a){return either.left(that.get)})
    }
  });

  instance(applicative,either.right,{
    ap: function(fa) {return fa.fmap(this.get)}
  });

  return {
    "$": applicative.$
  };
});
