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
    // Create a zip and download
  var payloadValue = editor.getValue();
  var payloadName = $("#payloadName").val();

    var zipHandler = new JSZip();
    zipHandler.file(payloadName + "/" + payloadName + ".ino", $(".arduino").val());
    zipHandler.file("readme", $.ajax({
      url: 'readme.default',
      type: 'get',
      success: function(data) {return data;}
    }));
    zipHandler.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(payloadValue, payloadName + ".zip");
      }
    );
});