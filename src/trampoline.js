define(function() {

  var trampoline,done,more,cont;

  // from http://apocalisp.wordpress.com/2011/10/26/tail-call-elimination-in-scala-monads/
  trampoline = {
    run: function() {
      var cur = this;
      var stack = [];
      var result = null;
      while (result === null) {
        x = cur.go(stack);
        cur = x.c;
        stack = x.s;
        result = x.r;
      }
      return result;
    }
  };

  // a
  done = function(a) {
    if (this instanceof done) {
      this.a = a;
      this.go = function(stack) {
        var c,s,r;
        if (!stack.length) {
          c = this; s = stack; r = this.a;
        }
        else {
          c = stack.shift()(this.a)
          s = stack; r = null;
        }
        return {c: c, s: s, r: r};
      };
    }
    else {return new done(a)}
  };

  // () -> trampoline a
  more = function(a) {
    if (this instanceof more) {
      this.a = a
      this.go = function(stack) {
        return {c: this.a(), s: stack, r: null};
      };
    }
    else {return new more(a)}
  };

  // trampoline a -> (a -> trampoline b)
  cont = function(a,f) {
    if (this instanceof cont) {
      this.a = a;
      this.f = f;
      this.go = function(stack) {
        stack.unshift(this.f);
        return {c: this.a, s: stack, r: null};
      };
    }
    else {return new cont(a,f)}
  };

  done.prototype = trampoline;
  more.prototype = trampoline;
  cont.prototype = trampoline;

  return {
    done: done,
    more: more,
    cont: cont
  };
});
