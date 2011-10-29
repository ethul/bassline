define(["bass","maybe","either"], function(bass,maybe,either) {

  var instance = bass.instance;
  var curry = bass.curry;
  var folder = {};

  // fold :: (() -> b) -> (a -> b) -> maybe a -> b

  instance(folder,maybe.nothing,{
    fold: function(f,g) {return curry(f)()}
  });

  instance(folder,maybe.just,{
    fold: function(f,g) {return curry(g)(this.get)}
  });

  // fold :: (e -> c) -> (a -> c) -> either e a -> c

  instance(folder,either.left,{
    fold: function(f,g) {return curry(f)(this.get)}
  });

  instance(folder,either.right,{
    fold: function(f,g) {return curry(g)(this.get)}
  });

});
