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
