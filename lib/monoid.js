var bass = require("./bass.js")
  , derive = bass.derive
  , plus = require("./plus.js")
  , wstring = require("./wstring.js")
  , wlist = require("./wlist.js")
  , monoid = function() {};

// mempty :: a
// mappend :: a -> a -> a

derive(plus).from(monoid,{
  mempty: 0,
  mappend: function(a) {return plus(this.get + a.get)}
});

derive(wstring).from(monoid,{
  mempty: "",
  mappend: function(a) {return wstring(this.get + a.get)}
});

derive(wlist).from(monoid,{
  mempty: [],
  mappend: function(a) {return wlist(this.get.concat(a.get))}
});

module.exports = {};
