jQuery(function() { // Wait for jQuery

  var isFileSaverSupported = init();

  // Create a little duck translator
  Duck = new Dckuinojs();

  $(".compile-but").click(function(e) {
    var duckOutput = Duck.toArduino($(".duckyscript").val());

    if (duckOutput !== false)
    {
      $(".arduino").val(duckOutput);
      if (isFileSaverSupported)
        $(".dl-but").prop('disabled', false);
    }
    else {
      $(".arduino").val('Error, please see console...');
      $(".dl-but").prop('disabled', true);
    }
  });

  // Download button
  $(".dl-but").click(function(e) {
    // Create a zip and download
    var sketchName = "iLoveDuck-" + makeId(4);

    var zipHandler = new JSZip();
    zipHandler.file(sketchName + "/" + sketchName + ".ino", $(".arduino").val());
    zipHandler.file("readme", $.ajax({
      url: 'readme.default',
      type: 'post',
      success: function(data) {return data;}
    }));
    zipHandler.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(content, sketchName + ".zip");
      }
    );
  });
});

function init()
{
  // Init page
  $(".dl-but").prop('disabled', true); // Disable download button by default

  // Check if download button can be used
  try {
    return !!new Blob;
  } catch (e) {}
}

function makeId(idLenght)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < idLenght; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
