// convenience function for slicing a list of arguments, handling the case
// when the arguments is empty

var slice = function(args){return 1 <= args.length ? Array.prototype.slice.call(args,0) : []}

// dervice provides a way to introduce objects inbetween the prototype chain
// of the ctor and the intents. to take an example, consider that we have a 
// constructor "just", a constructor "maybe", with just.prototype = new maybe.
// then, say we want to insert a an object with constructor functor in the
// prototype chain, so just -> functor -> maybe. to do this we just invoke
// derive(just).from(functor). notice the optional "extents". we could mix in
// properties in an extents object if we wanted. this is useful to have
// properties specific to just, so we could do something like
//
// derive(just).from(functor, {
//   fmap: function(f) {...}
// });
//
// and this would mix in the function fmap into the functor instance that
// will exist in the chain just -> functor -> maybe

var derive = function(ctor) {
  return {
    from: function(intents,extents) {
      intents.prototype = ctor.prototype;
      ctor.prototype = new intents;
      if (extents !== null) {
        for (k in extents) {
          ctor.prototype[k] = extents[k];
        }
      }
      return ctor;
    }
  };
};

// provides a curried function of the function this method is applied to.
// an optional context may be passed into the curry invocation, which
// will be provided to the curried function once all the parameters have
// been applied. 
//
// the main idea is that curry returns a function which takes a splat
// of parameters, and when the number of parameters is greater than or
// equal to the necessary number of parameters to the curried function,
// the curried function is invoked.
//
// otherwise, the parameters are accumulated in a recursive manner using
// the named function "g" to keep track.

var curry = function(f,that) {
  var g;
  if (that == null){that = this;}
  return g = function() {
    var as = slice(arguments);
    if (as.length >= f.length){return f.apply(that,as)}
    else {return function(){return g.apply(that, as.concat(slice(arguments)))}}
  };
};

module.exports = {
  derive: derive,
  curry: curry
};
