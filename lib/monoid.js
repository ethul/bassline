var bass = require("./bass")
  , derive = bass.derive
  , sum = require("./sum")
  , product = require("./product")
  , stringw = require("./stringw")
  , listw = require("./listw")
  , monoid = function() {};

// mempty :: a

listw.mempty = function() {return listw.listw([]);};
stringw.mempty = function() {return stringw.stringw("");};
sum.mempty = function() {return sum.sum(0);};
product.mempty = function() {return product.product(1);};

// mappend :: a -> a -> a

derive(sum.sum).from(monoid,{
  mempty: 0,
  mappend: function(a) {return sum.sum(this.get + a.get)}
});

derive(product.product).from(monoid,{
  mempty: 1,
  mappend: function(a) {return product.product(this.get * a.get)}
});

derive(stringw.stringw).from(monoid,{
  mempty: "",
  mappend: function(a) {return stringw.stringw(this.get + a.get)}
});

derive(listw.listw).from(monoid,{
  mempty: [],
  mappend: function(a) {return listw.listw(this.get.concat(a.get))}
});

module.exports = {};
