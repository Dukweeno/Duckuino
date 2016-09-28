$(function() { // Wait for jQuery

  Duck = new Duckuino();

  $("#compileThis").click(function(e) {
  	  editor.getDoc().setValue(Duck.compile($("#duckyScript").val()));
  });
});
