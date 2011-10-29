define(function() {

  var slice;

  // convenience function for slicing a list of arguments, handling the case
  // when the arguments is empty
  slice = function(args){return 1 <= args.length ? Array.prototype.slice.call(args,0) : []}

  var instance,curry;

  // provides a way to add properties into the prototype of an object. this
  // is used by functional classes to add their behavior into those objects
  // that may exhibit such behavior.
  instance = function(base,obj,methods) {
    for (var k in base){obj.prototype[k] = base[k]}
    for (var k in methods){obj.prototype[k] = methods[k]}
  }

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
  curry = function(f,that) {
    var g;
    if (that == null){that = this;}
    return g = function() {
      var as = slice(arguments);
      if (as.length >= f.length){return f.apply(that,as)}
      else {return function(){return g.apply(that, as.concat(slice(arguments)))}}
    };
  };

  return {
    instance: instance,
    curry: curry
  };
});
