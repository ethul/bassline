
// A promise can be in one of three states: unfulfilled, fulfilled, or
// failed. When a promise is created with a value, it is transitioned
// into the fulfilled state. With no value upon creation, the promise is
// in the unfulfilled state.
//
// The caller may transition the promise from the unfulfilled state to
// the fulfilled state by invoking p.fulfill(a) for some promise p and a
// value a. To transition the promise into failure, the caller may
// invoke p.fail(e) for some promise p and an error e.
//
// Promises may be chained together using the bind method where bind
// accepts a function what takes a value and returns a promise. The fold
// method may be used for convenience as a handler for the last value in
// the bind chain. Fold accepts two functions: the first is a handler
// for ... and the second accepts a value for processing.

var promise = exports.promise = function(a) {
  if (this instanceof promise) {
    this.acc = [];
    this.state = a !== undefined ? fulfilled(a) : unfulfilled()
    this.get = function() {return this.state.get;};
    this.fulfilled = function() {return this.state.fulfilled;};
    this.failed = function() {return this.state.failed;};
    this.fail = function(e) {fail(e,this).run();};
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

    this.fold = function(f,g) {
      this.bind(function(a){g(a);return promise();});
    };
  }
  else {
    return new promise(a);
  }
};

// Representation of the unfulfilled state, which may transition the
// promise into the fulfilled or failed state. When transition into the
// fulfilled state, all of the accumulated continutations will be
// executed in turn with the fulfilled value.

var unfulfilled = function() {
  if (this instanceof unfulfilled) {
    this.fulfilled = false;
    this.failed = false;
    this.get = undefined;
    this.fulfill = function(a,promise) {
      promise.state = fulfilled(a);
      promise.acc.forEach(function(f){f(a);});
    };
    this.fail = function(e,promise) {
      promise.state = failed(e);
      promise.acc = [];
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
    this.fulfilled = true;
    this.failed = false;
    this.get = a;
    this.fulfill = function(){};
    this.fail = function(){};
  }
  else {
    return new fulfilled(a);
  }
};

// Representation of the failed state. Once a promise has been failed it
// may not be transitioned to another state. The error causing the
// failure is wrapped within this representation.

var failed = function(e) {
  if (this instanceof failed) {
    this.fulfilled = false;
    this.failed = true;
    this.get = e;
    this.fulfill = function(){};
    this.fail = function(){};
  }
  else {
    return new failed(e);
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
var fail = function(e,promise) {
  if (this instanceof fail) {
    this.run = function() {
      promise.state.fail(e,promise);
    };
  }
  else {
    return new fail(e,promise);
  }
};
