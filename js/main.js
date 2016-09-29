var consoleError = console.error;
console.error = function () {
	var message = [].join.call(arguments, " ");
	$("#console").text(message);
	rConsole.apply(console, arguments);
};

var editor = CodeMirror.fromTextArea(document.getElementById("arduiCode"), {
    lineNumbers: true,
	mode: "text/x-c++src"
});

var editor2 = CodeMirror.fromTextArea(document.getElementById("duckyScript"), {
    lineNumbers: true,
	mode: "text/vbscript"
});

$(function() { // Wait for jQuery
  Duck = new Duckuino();

  $("#compileThis").click(function(e) {
  	  console.clear();
  	  $('#console').html('&nbsp;');
  	  //clear();
  	  editor.getDoc().setValue(Duck.compile(editor2.getValue()));
  });
});
