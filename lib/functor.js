// the functor module encapsulates those objects which may be mapped over.
// any object that satisfies the follow two laws may be a functor.
//
// it should hold to identity: forall a . functor(a) == functor(a).fmap(identity)
// it should hold to composition: forall a,f,g . functor(a).fmap(f compose g) = functor(a).fmap(g).fmap(f)
//
// in the laws, identity == function(a){return a;}
// also, f compose g == function(f,g){return function(x){return f(g(x));}}

var bass = require("./bass")
  , derive = bass.derive
  , curry = bass.curry
  , maybe = require("./maybe")
  , either = require("./either")
  , functor = function() {};

// the functor object is has an undefined method fmap that 
// must be define by each object that wants to be a functor
//
// the haskell function is as follows:
// fmap :: (a -> b) -> functor a -> functor b
//
// but we switch it up here since we have a functor object
// with a method fmap which takes a function and applies
// the function in the context of the functor, so really
// fmap takes function and returns a functor


// fmap for the maybe.nothing case is nothing. the context
// of nothing is well, nothing, so the function cannot be
// applied. so just return a new nothing.

derive(maybe.nothing).from(functor,{
  fmap: function(f) {
    return maybe.nothing();
  }
});

// fmap for the maybe.just case is a new just object where
// the function has been applied to the value wrapped by
// the just, and a new just is created with the result of
// the function's application.
//
// note that we curry the function before applying it so
// that you could pass in a function of any arity greater
// than zero and this will succeed in applying just one
// argument to the function

derive(maybe.just).from(functor,{
  fmap: function(f) {
    return maybe.just(curry(f)(this.get));
  }
});

// fmap for the either.left case is similar to the
// maybe.nothing case. we don't apply the function
// and persist the either's left value in a new
// either.left object

derive(either.left).from(functor,{
  fmap: function(f) {
    return either.left(this.get);
  }
});

// fmap for the either.right case is basically the same
// as for the maybe.just, please see above. the difference
// here is that we create a new either with the result of
// the funciton application

derive(either.right).from(functor,{
  fmap: function(f) {
    return either.right(curry(f)(this.get));
  }
});

module.exports = {};
