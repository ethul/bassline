var bass = require("./bass")
  , derive = bass.derive
  , curry = bass.curry
  , maybe = require("./maybe")
  , either = require("./either")
  , monad = function() {};

// return :: a -> m a

maybe.return = maybe.just
either.return = either.right

// bind :: m a -> (a -> m b) -> m b

derive(maybe.nothing).from(monad,{
  bind: function(f) {return maybe.nothing()}
});

derive(maybe.just).from(monad,{
  bind: function(f) {return curry(f)(this.get)}
});

derive(either.left).from(monad,{
  bind: function(f) {return either.left(this.get)}
});

derive(either.right).from(monad,{
  bind: function(f) {return curry(f)(this.get)}
});

module.exports = {};
