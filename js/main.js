$(function() { // Wait for jQuery

  Duck = new Duckuino();

  $("#compileThis").click(function(e) {
      $("#arduiCode").val(Duck.compile($("#duckyScript").val()));
  });
});
