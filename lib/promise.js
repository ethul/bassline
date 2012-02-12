
// TODO: ethul, the promise is limited such that it does not recognize
// failure. This is definitely something to add in, but for now the
// caller may attempt to resolve the error before calling fulfill or
// just throw the error as an exception.

// A promise can be in one of two states: unfulfilled or fulfilled. When
// a promise is created with a value, it is transitioned into the
// fulfilled state. With no value upon creation, the promise is created
// in the unfulfilled state.
//
// The caller may transition the promise from the unfulfilled state to
// the fulfilled state by invoking p.fulfill(a) for some promise p and a
// value a.
//
// Promises may be chained together using the bind method where bind
// accepts a function what takes a value and returns a promise. The fold
// method may be used for convenience as a handler for the last value in
// the bind chain.

var promise = exports.promise = function(a) {
  if (this instanceof promise) {
    this.acc = [];
    this.state = a !== undefined ? fulfilled(a) : unfulfilled()
    this.get = function() {return this.state.get;};
    this.fulfilled = function() {return this.state.fulfilled;};
    this.fulfill = function(a) {done(a,this).run();};

    this.fmap = function(f) {
      return this.bind(function(a){
        return promise(f(a));
      });
    };

    this.return = function(a) {return promise(a);};
    this.bind = function(f) {
      var p = promise();
      cont(function(a){
        cont(function(b){
          p.fulfill(b);
        },f(a)).run();
      },this).run();
      return p;
    };

    this.fold = function(f) {
      this.bind(function(a){f(a);return promise();});
    };
  }
  else {
    return new promise(a);
  }
};

// Representation of the unfulfilled state, which may transition the
// promise into the fulfilled state. When transition into the fulfilled
// state, all of the accumulated continutations will be executed in turn
// with the fulfilled value.

var unfulfilled = function() {
  if (this instanceof unfulfilled) {
    this.get = undefined;
    this.fulfilled = false;
    this.fulfill = function(a,promise) {
      promise.state = fulfilled(a);
      promise.acc.forEach(function(f){f(a);});
    };
  }
  else {
    return new unfulfilled();
  }
};

// Representation of the fulfilled state. Once a promise has been
// fulfilled it may not be transitioned to another state. The resulting
// value is wrapped by this representation.

var fulfilled = function(a) {
  if (this instanceof fulfilled) {
    this.get = a;
    this.fulfilled = true;
    this.fulfill = function(){};
  }
  else {
    return new fulfilled(a);
  }
};

// Signals that trigger the corresponding state transition when run, or
// in the case of the continuation signal, will accumulate the given
// continutation k into the accumulator of the promise, or invoke the
// continutation if the promise has already been fulfilled.

var cont = function(k,promise) {
  if (this instanceof cont) {
    this.run = function() {
      if (promise.state.fulfilled) k(promise.state.get);
      else promise.acc.push(k);
    };
  }
  else {
    return new cont(k,promise);
  }
};

var done = function(a,promise) {
  if (this instanceof done) {
    this.run = function() {
      promise.state.fulfill(a,promise);
    };
  }
  else {
    return new done(a,promise);
  }
};
