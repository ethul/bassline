var bass = require("./bass")
  , derive = bass.derive
  , curry = bass.curry
  , maybe = require("./maybe")
  , either = require("./either")
  , folder = function() {};

// fold :: (() -> b) -> (a -> b) -> maybe a -> b

derive(maybe.nothing).from(folder,{
  fold: function(f,g) {return curry(f)()}
});

derive(maybe.just).from(folder,{
  fold: function(f,g) {return curry(g)(this.get)}
});

// fold :: (e -> c) -> (a -> c) -> either e a -> c

derive(either.left).from(folder,{
  fold: function(f,g) {return curry(f)(this.get)}
});

derive(either.right).from(folder,{
  fold: function(f,g) {return curry(g)(this.get)}
});

module.exports = {};
