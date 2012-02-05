// The slice function is a helper method that has two purposes. First,
// it will convert an arguments object to a proper Array when one is
// passed. Second, it will handle undefined and null, mapping them to an
// empty Array. When an Array is passed to the function, it will return
// the array as-is.

var slice = exports.slice = function(args) {
  if (args !== undefined && args !== null && args.length >= 1) {
    return Array.prototype.slice.call(args,0);
  }
  else {
    return [];
  }
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

var curry = exports.curry = function(f,that) {
  var g;
  if (that == null){that = this;}
  return g = function() {
    var as = slice(arguments);
    if (as.length >= f.length){return f.apply(that,as)}
    else {return function(){return g.apply(that, as.concat(slice(arguments)))}}
  };
};
