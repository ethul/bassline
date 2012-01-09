// the applicative module encapsulates those objects
// seminal paper on applicatives: http://www.soi.city.ac.uk/~ross/papers/Applicative.html
var bass = require("./bass")
  , derive = bass.derive
  , curry = bass.curry
  , maybe = require("./maybe")
  , either = require("./either")
  , listw = require("./listw")
  , functor = require("./functor")
  , folder = require("./folder")
  , applicative = function() {};

// ap :: f (a -> b) -> f a -> f b
// pure :: a -> f a

derive(maybe.nothing).from(applicative,{
  ap: function(fa) {
    return maybe.nothing();
  }
});

derive(maybe.just).from(applicative,{
  ap: function(fa) {
    return fa.fmap(this.get);
  }
});

derive(either.left).from(applicative,{
  ap: function(fa) {
    var that = this;
    return fa.fold(
      function(e) {
        return either.left("mappend" in that.get ? that.get.mappend(e) : that.get)
      },
      function(a) {
        return either.left(that.get);
      }
    );
  }
});

derive(either.right).from(applicative,{
  ap: function(fa) {
    return fa.fmap(this.get);
  }
});

derive(listw.listw).from(applicative,{
  ap: function(fa) {
    return listw.listw(this.get.reduce(function(b,f) {
      return b.concat(fa.get.map(function(a) {
        return curry(f)(a);
      }));
    },[]));
  }
});

maybe.pure = maybe.just
either.pure = either.right
listw.pure = function(a){return listw.listw([a]);}

module.exports = {};
