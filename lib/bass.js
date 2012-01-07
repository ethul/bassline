
// The slice function is a helper method that has two purposes. First,
// it will convert an arguments object to a proper Array when one is
// passed. Second, it will handle undefined and null, mapping them to an
// empty Array. When an Array is passed to the function, it will return
// the array as-is.

var slice = function(args) {
  if (args !== undefined && args !== null && args.length >= 1) {
    return Array.prototype.slice.call(args,0);
  }
  else {
    return [];
  }
};

// The derive function provides a way to place an object (intent) in the
// prototype chain for the given constructor (ctor). Additional
// properties may also be provided (extents) that will be mixed into the
// constructor's prototype. Consider the following example, and assume
// that prototype chain for just is just -> maybe -> Object
//
// derive(just).from(functor, {
//   fmap: function(f) {...}
// });
//
// As a result, the just constructor will have functor inserted into its
// prototype chain and the fmap function will be mixed into the functor
// prototype as well to provide objects created using the just
// constructor with fmap along with any other properties in functor. So
// the protoype chain now looks like just -> functor -> maybe -> Object.

var derive = function(ctor) {
  return {
    from: function(intent,extents) {
      intent.prototype = ctor.prototype;
      ctor.prototype = new intent;
      if (extents !== null) {
        for (k in extents) {
          ctor.prototype[k] = extents[k];
        }
      }
      return ctor;
    }
  };
};

// The curry function can be used to take a function which accepts n
// arguments and supply them one at a time, each time getting back a new
// function which accepts n-1 arguments.
//
// It is also possible to provide any m number of arguments to a
// function taking n arguments where m < n. This will produce a new
// function taking n-m arguments.
//
// A context (that) may also be passed to invoke the curried function
// within some alternative context. If that is not supplied, then the
// default this will be used.

var curry = function(f,that) {
  var g;
  if (that == null){that = this;}
  return g = function() {
    var as = slice(arguments);
    if (as.length >= f.length){return f.apply(that,as)}
    else {return function(){return g.apply(that, as.concat(slice(arguments)))}}
  };
};

// The toString function allows for the conversion of an Object to its
// string representation. This can be used to detect the "type" of an
// Object.

var toString = function(a) {
  return Object.prototype.toString.call(a);
};

module.exports = {
  derive: derive,
  curry: curry,
  slice: slice,
  toString: toString
};
