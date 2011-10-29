define(function() {

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
