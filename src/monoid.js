define(["bass","plus","wstring","wlist"], function(bass,plus,wstring,wlist) {

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
