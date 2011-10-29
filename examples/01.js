(function() {
  var bass = bassline.bass, either = bassline.either, wlist = bassline.wlist;
  var error, nonEmpty, success, thankYou, validateEmail, validateFirstName, validateLastName;

  nonEmpty = function(message,value) {
    if (value === "") {return either.left(wlist([message+" cannot be empty"]));}
    else {return either.right(value);}
  };

  validateFirstName = bass.curry(nonEmpty)("first name");
  validateLastName = bass.curry(nonEmpty)("last name");
  validateEmail = bass.curry(nonEmpty)("email");

  thankYou = function(firstName,lastName,email) {
    return "thank you for your submission " + firstName + " " + lastName + " (" + email + ")!";
  };

  error = function(errors) {
    return $("aside").html("<ul><li>" + (errors.get.join("</li><li>")) + "</li></ul>");
  };

  success = function(message) {
    $("aside").html(message);
    $("#firstName").val("");
    $("#lastName").val("");
    return $("#email").val("");
  };

  $("form").submit(function(e) {
    e.preventDefault();
    return either.pure(thankYou).
      ap(validateFirstName($("#firstName").val())).
      ap(validateLastName($("#lastName").val())).
      ap(validateEmail($("#email").val())).
      fold(error,success);
  });
}).call(this);
