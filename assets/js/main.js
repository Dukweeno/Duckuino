jQuery(function() { // Wait for jQuery

  init();

  // Check if download button can be used
  try {
    var isFileSaverSupported = !!new Blob();
  } catch (e) {}

  // Hijack console.log and console.error
  (function(){
    var oldLog = console.log;
    console.log = function (message) {
      $(".console").val("  ℹ - " + message + '\n');
      oldLog.apply(console, arguments);
    };
    var oldErrorLog = console.error;
    console.error = function (message) {
      $(".console").val("  ⚠ - " + message + '\n');
      oldErrorLog.apply(console, arguments);
    };
  })();

  // Create a little duck translator
  Duck = new Dckuinojs();

  // Compile button
  $(".compile-but").click(function(e) {
    var duckOutput = Duck.toArduino($(".duckyscript").val());

    if (duckOutput !== false)
    {
      $(".arduino").val(duckOutput);
      if (isFileSaverSupported)
        enableDl(500); // Enable download button
    }
    else {
      $(".arduino").val('Error, please see console...');
      disableDl(500); // Disable download button
    }
  });

  // Download button
  $(".dl-but").click(function(e) {
    if (!$(".dl-but").hasClass("disabled"))
    {
      // Create a zip and download
      var sketchName = "Dckuino.js-" + makeId(4);
      var zipHandler = new JSZip();

      // Add the payload as .ino
      zipHandler.file(sketchName + "/" + sketchName + ".ino", $(".arduino").val());
      // Add readme
      zipHandler.file("readme", $.ajax({
        url: 'readme.default',
        type: 'get',
        success: function(data) {return data;}
      }));
      // Download
      zipHandler.generateAsync({type:"blob"})
        .then(function(content) {
          saveAs(content, sketchName + ".zip");
        }
      );
    }
  });
});

function init()
{
  // Init page

  // Disable download button by default
  disableDl(500);

  // Clear console
  $(".console").val("");
}

function disableDl(time) {
  $(".dl-but").addClass("disabled").removeClass("hoverable");
  $(".dl-but span i.fa-ban").fadeTo(time, 1);
}

function enableDl(time) {
  $(".dl-but").removeClass("disabled").addClass("hoverable");
  $(".dl-but span i.fa-ban").fadeTo(time, 0);
}

function makeId(idLenght)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < idLenght; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
