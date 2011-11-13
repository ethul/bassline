// wlist :: a -> wlist a
var wlist = function(a) {
  if (this instanceof wlist) {
    this.get = a;
  }
  else {
    return new wlist(a);
  }
};

wlist.prototype = Array;

module.exports = wlist;
