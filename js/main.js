var consoleError = console.error;
console.error = function () {
	var message = [].join.call(arguments, " ");
	$("#console").text(message);
	consoleError.apply(console, arguments);
};

var editor = CodeMirror.fromTextArea(document.getElementById("arduiCode"), {
    lineNumbers: true,
	mode: "text/x-c++src",
	theme: "monokai"
});

var editor2 = CodeMirror.fromTextArea(document.getElementById("duckyScript"), {
    lineNumbers: true,
	mode: "text/vbscript",
	theme: "monokai"
});

$(function() { // Wait for jQuery
  Duck = new Duckuino();

  $("#compileThis").click(function(e) {
  	  console.clear();
  	  $('#console').html('&nbsp;');
  	  editor.getDoc().setValue(Duck.compile(editor2.getValue()));
  });
});



// Download button
$("#download").click(function() {
  var payloadValue = editor.getValue();
  var payloadName = $("#payloadName").val();
  if(payloadValue == undefined || payloadValue == '' || payloadValue == 'Error, look at the console console...' || payloadName == '' || payloadName == undefined){
    alert("Download Error: The payload or payload name are empty!");
    return;
  }
  var zip = new JSZip();

  zip.file(payloadName + ".ino", payloadValue);

  zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, ".zip");
  });
})