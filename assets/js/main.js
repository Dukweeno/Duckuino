$(function() { /* Wait for jQuery */

  /* Init vars */
  var isCodeCompiled = false;
  var LocKey = new LocaleKeyboard();
  var Duck = new Duckuino();

  try {
    var isFileSaverSupported = !!new Blob();
  } catch (e) {}

  /* Compile button enable/disable */
  $(".input > textarea").keyup(function() {
    if($(this).val() !== "") {
      $(".process-but").prop("disabled", false);
      $(".export .copy-but").text("Copy !");
    } else {
      $(".process-but").prop("disabled", true);
    }
  });

  /* Compile button click */
  $(".process-but").click(function() {
    var duckyScript = $(".input > textarea").val();
    var selectedModule = $(".process .module-select").find(":selected").text();

    /* Load Duckuino & Compile */
    Duck.loadModule(selectedModule);
    var compilerOut = Duck.compileCode(duckyScript);

    /* Check for error */
    if(compilerOut.returnCode === 0) {
      /* Set textarea text */
      $(".export > textarea").val(compilerOut.compiledCode);

      /* Enable buttons */
      $(".dl-but").prop("disabled", false);
      $(".copy-but").prop("disabled", false);

      /* Show compilation infos */
      $(".process .tooltip > span").text(compilerOut.returnMessage);
      $(".process .tooltip").removeClass("error"); $(".process .tooltip").addClass("info");
      $(".process .tooltip").show();
    } else {
      /* Disable buttons and show compilation error */
      $(".dl-but").prop("disabled", true);
      $(".copy-but").prop("disabled", true);

      /* Compilation error */
      $(".process .tooltip > span").text(compilerOut.returnMessage);
      $(".process .tooltip").removeClass("info"); $(".process .tooltip").addClass("error");
      $(".process .tooltip").show();
    }
  });

  /* List locales */
  LocKey.listLocales().forEach(function (localeName) {
    $(".export .locale-select").append("<option name=\"" + localeName + "\">" + localeName + "</option>");
  });

  /* List modules */
  Duck.listModules().forEach(function (moduleName) {
    $(".process .module-select").append("<option name=\"" + moduleName + "\">" + moduleName + "</option>");
  });

  /* Download button */
  $(".export .dl-but").click(function() {
    var compilerOut = $(".export > textarea").val();

    var sketchName = "Sketch";
    var zipHandler = new JSZip();

    // Add the payload as .ino
    zipHandler.file(sketchName + "/" + sketchName + ".ino", compilerOut);
    // Add readme
    zipHandler.file("readme", $.ajax({
      url: 'readme.default',
      mimeType: 'text/plain',
      type: 'get',
      success: function(data) {return data;}
    }));

    // Add custom version of Keyboard lib if needed
    if ($(".export .locale-select").find(":selected").text() !== "en_US") {
      // Set the locale
      LocKey.setLocale($(".export .locale-select").find(":selected").text());

      // Append all to the zip
      zipHandler.file(sketchName + "/Keyboard.cpp", LocKey.getSource());
      zipHandler.file(sketchName + "/Keyboard.h", LocKey.getHeader());
    }

    // Download
    zipHandler.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(content, sketchName + ".zip");
      }
    );
  });

  /* Copy to clipboard button */
  $(".export .copy-but").click(function() {
    var copyTextarea = $(".export > textarea");
    copyTextarea.select();

    try {
      document.execCommand('copy');

      $(".export .copy-but").text("Copied !");
      $(".export .copy-but").prop("disabled", true);
    } catch (e) {/* Error */}
  });
});
