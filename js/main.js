$(function() { // Wait for jQuery
  
  Duck = new Duckuino();

  $(".compile-but").click(function(e) {
    $(".arduino").val(Duck.toArduino($(".duckyscript").val()));
  });
  
  $(".dl-but").click(function(e) {
      // Create a zip and download
  });
});
