(function () {
/**
 * almond 0.0.2 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
/*jslint strict: false, plusplus: false */
/*global setTimeout: false */

var requirejs, require, define;
(function () {

    var defined = {},
        aps = [].slice,
        req;

    if (typeof define === "function") {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseName = baseName.split("/");
                baseName = baseName.slice(0, baseName.length - 1);

                name = baseName.concat(name.split("/"));

                //start trimDots
                var i, part;
                for (i = 0; (part = name[i]); i++) {
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            }
        }
        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(null, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.slice(0, index), relName);
            name = name.slice(index + 1);
            plugin = defined[prefix];

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            p: plugin
        };
    }

    function main(name, deps, callback, relName) {
        var args = [],
            usingExports,
            cjsModule, depName, i, ret, map;

        //Use name if no relName
        if (!relName) {
            relName = name;
        }

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            if (deps) {
                for (i = 0; i < deps.length; i++) {
                    map = makeMap(deps[i], relName);
                    depName = map.f;

                    //Fast path CommonJS standard dependencies.
                    if (depName === "require") {
                        args[i] = makeRequire(name);
                    } else if (depName === "exports") {
                        //CommonJS module spec 1.1
                        args[i] = defined[name] = {};
                        usingExports = true;
                    } else if (depName === "module") {
                        //CommonJS module spec 1.1
                        cjsModule = args[i] = {
                            id: name,
                            uri: '',
                            exports: defined[name]
                        };
                    } else if (depName in defined) {
                        args[i] = defined[depName];
                    } else if (map.p) {
                        map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                        args[i] = defined[depName];
                    }
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undefined) {
                    defined[name] = cjsModule.exports;
                } else if (!usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    }

    requirejs = req = function (deps, callback, relName, forceSync) {
        if (typeof deps === "string") {

            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return defined[makeMap(deps, callback).f];
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            //Drop the config stuff on the ground.
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = arguments[2];
            } else {
                deps = [];
            }
        }

        //Simulate async callback;
        if (forceSync) {
            main(null, deps, callback, relName);
        } else {
            setTimeout(function () {
                main(null, deps, callback, relName);
            }, 15);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function () {
        return req;
    };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal for the value. Adjust args.
            callback = deps;
            deps = [];
        }

        main(name, deps, callback);
    };

    define.amd = {};
}());

define("../tools/almond", function(){});

define('bass',[],function() {

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

define('either',[],function() {

  // algebraic data type either e a = left e | right a
  var left,right;

  // left :: e -> left e
  left = function(e) {
    if (this instanceof left) {this.get = e}
    else {return new left(e)}
  };

  // right :: a -> right a
  right = function(a) {
    if (this instanceof right) {this.get = a}
    else {return new right(a)}
  };

  return {
    left: left,
    right: right
  };
});

define('maybe',[],function() {

  // algebratic data type, maybe a = nothing | just a
  var nothing,just;

  // nothing :: () -> nothing
  nothing = function() {
    if (this instanceof nothing) {}
    else {return new nothing()}
  };

  // just :: a -> just a
  just = function(a) {
    if (this instanceof just) {this.get = a}
    else {return new just(a)}
  };

  return {
    nothing: nothing,
    just: just
  };
});

define('plus',[],function() {

  var plus;

  // plus :: a -> plus a
  plus = function(a) {
    if (this instanceof plus) {this.get = a}
    else {return new plus(a)}
  };

  return {
    plus: plus
  };
});

define('trampoline',[],function() {

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

define('wlist',[],function() {

  var wlist;

  // wlist :: a -> wlist a
  wlist = function(a) {
    if (this instanceof wlist) {this.get = a}
    else {return new wlist(a)}
  };

  wlist.prototype = Array;

  return {
    wlist: wlist
  };
});

define('wstring',[],function() {

  var wstring;

  // wstring :: a -> wstring a
  wstring = function(a) {
    if (this instanceof wstring) {this.get = a}
    else {return new wstring(a)}
  };

  wstring.prototype = String;

  return {
    wstring: wstring
  };
})
;
define('folder',["bass","maybe","either"], function(bass,maybe,either) {

  var instance = bass.instance;
  var curry = bass.curry;
  var folder = {};

  // fold :: (() -> b) -> (a -> b) -> maybe a -> b

  instance(folder,maybe.nothing,{
    fold: function(f,g) {return curry(f)()}
  });

  instance(folder,maybe.just,{
    fold: function(f,g) {return curry(g)(this.get)}
  });

  // fold :: (e -> c) -> (a -> c) -> either e a -> c

  instance(folder,either.left,{
    fold: function(f,g) {return curry(f)(this.get)}
  });

  instance(folder,either.right,{
    fold: function(f,g) {return curry(g)(this.get)}
  });

});

define('functor',["bass","maybe","either","trampoline"], function(bass,maybe,either,trampoline) {

  var instance = bass.instance;
  var curry = bass.curry;
  var functor = {};

  // fmap :: (a -> b) -> m a -> m b

  instance(functor,maybe.nothing,{
    fmap: function(f) {return maybe.nothing()}
  });

  instance(functor,maybe.just,{
    fmap: function(f) {return maybe.just(curry(f)(this.get))}
  });

  instance(functor,either.left,{
    fmap: function(f) {return either.left(this.get)}
  });

  instance(functor,either.right,{
    fmap: function(f) {return either.right(curry(f)(this.get))}
  });

  instance(functor,trampoline.done,{
    fmap: function(f) {
      return this.bind(function(a) {
        return trampoline.more(function() {
          return trampoline.done(f(a))
        })
      })
    }
  });
});

define('applicative',["bass","maybe","either","functor","folder"], function(bass,maybe,either,functor,folder) {

  var instance = bass.instance;
  var curry = bass.curry;

  var applicative = {
    // $ :: (a -> b) -> f a -> f b
    "$": function(f,fa) {return fa.fmap(f);}
  };

  // pure :: a -> f a

  maybe.pure = maybe.just
  either.pure = either.right

  // ap :: f (a -> b) -> f a -> f b

  instance(applicative,maybe.nothing,{
    ap: function(fa) {return maybe.nothing()}
  });

  instance(applicative,maybe.just,{
    ap: function(fa) {return fa.fmap(this.get)}
  });

  instance(applicative,either.left,{
    ap: function(fa) {
      var that = this;
      return fa.fold(function(e) {
        return either.left("mappend" in that.get ? that.get.mappend(e) : that.get)
      },function(a){return either.left(that.get)})
    }
  });

  instance(applicative,either.right,{
    ap: function(fa) {return fa.fmap(this.get)}
  });

  return {
    "$": applicative.$
  };
});

define('monad',["bass","maybe","either","trampoline"], function(bass,maybe,either,trampoline) {

  var instance = bass.instance;
  var curry = bass.curry;

  var monad = {
    ">>=": function(f) {return this.bind(f)}
  };

  // return :: a -> m a

  maybe.return = maybe.just
  either.return = either.right

  // bind :: m a -> (a -> m b) -> m b

  instance(monad,maybe.nothing,{
    bind: function(f) {return maybe.nothing()}
  });

  instance(monad,maybe.just,{
    bind: function(f) {return curry(f)(this.get)}
  });

  instance(monad,either.left,{
    bind: function(f) {return either.left(this.get)}
  });

  instance(monad,either.right,{
    bind: function(f) {return curry(f)(this.get)}
  });

  instance(monad,trampoline.done,{
    bind: function(f) {return trampoline.cont(this,f)}
  });

  return {
    ">>=": monad[">>="]
  }
});

define('monoid',["bass","plus","wstring","wlist"], function(bass,plus,wstring,wlist) {

  var instance = bass.instance;
  var curry = bass.curry;
  var monoid = {};

  // mempty :: a
  // mappend :: a -> a -> a

  instance(monoid,plus.plus,{
    mempty: 0,
    mappend: function(a) {return plus.plus(this.get + a.get)}
  });

  instance(monoid,wstring.wstring,{
    mempty: "",
    mappend: function(a) {return wstring.wstring(this.get + a.get)}
  });

  instance(monoid,wlist.wlist,{
    mempty: [],
    mappend: function(a) {return wlist.wlist(this.get.concat(a.get))}
  });

});

require([
  "bass"
  ,"either"
  ,"maybe"
  ,"plus"
  ,"trampoline"
  ,"wlist"
  ,"wstring"
  ,"applicative"
  ,"folder"
  ,"functor"
  ,"monad"
  ,"monoid"
],
function(bass,either,maybe,plus,trampoline,wlist,wstring,_) {
  return (window.bassline || (window.bassline = {
    bass: bass,
    maybe: maybe,
    either: either,
    trampoline: trampoline,
    plus: plus.plus,
    wlist: wlist.wlist,
    wstring: wstring.wstring
  }));
},"bassline",true);

define("../tools/module.js", function(){});
}());