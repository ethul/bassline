// wstring :: a -> wstring a
var wstring = function(a) {
  if (this instanceof wstring) {
    this.get = a;
  }
  else {
    return new wstring(a);
  }
};

wstring.prototype = String;

module.exports = wstring;
