define(function() {

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
