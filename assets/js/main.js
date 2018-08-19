$(function() { /* Wait for jQuery */

  /* Init lets */
  let isCodeCompiled = false;
  let Duck = new Duckuino();
  let mods = new Modules().list;

  try {
    let isFileSaverSupported = !!new Blob();
  } catch (e) {}

  /* Compile button enable/disable */
  $(".input > textarea").keyup(function() {
    if($(this).val() !== "") {
      $(".process-but button").prop("disabled", false);
      $(".process-but select").prop("disabled", false);
    } else {
      $(".process-but button").prop("disabled", true);
      $(".process-but select").prop("disabled", true);
    }
  });

  /* Reset buttons */
  $(".copy-but").prop("disabled", true);
  $(".export .copy-but").text("Copy !");
  $(".dl-but button").prop("disabled", true);
  $(".dl-but select").prop("disabled", true);

  /* Compile button click */
  $(".process-but button").click(function() {
    let duckyScript = $(".input > textarea").val();
    let selectedModule = mods[$(".process-but select").find(":selected").val()];

    /* Load Duckuino & Compile */
    let compilerOut = Duck.compileCode(duckyScript, selectedModule.module);

    /* Check for error */
    if(compilerOut.returnCode === 0) {
      /* Set textarea text */
      $(".export > textarea").val(compilerOut.compiledCode);

      /* Enable buttons */
      $(".copy-but").prop("disabled", false);
      $(".export .copy-but").text("Copy !");

      /* Reset & (Re)Populate locales */
      $(".dl-but select").empty();
      $(".dl-but button").prop("disabled", true);
      $(".dl-but select").prop("disabled", true);
      for (let y in selectedModule.meta.locales) {
        let l = selectedModule.meta.locales[y];
        if (y == "_meta")
          continue;
        $(".dl-but select").append("<option value=\"" + y + "\">" + l.name + "</option>");
        /* Enable button only if there is one locale */
        $(".dl-but button").prop("disabled", false);
        $(".dl-but select").prop("disabled", false);
      }

      /* Show compilation infos */
      $(".process .tooltip > span").text(compilerOut.returnMessage);
      $(".process .tooltip").removeClass("error"); $(".process .tooltip").addClass("info");
      $(".process .tooltip").show();
    } else {
      /* Disable buttons and show compilation error */
      $(".dl-but button").prop("disabled", true);
      $(".dl-but select").prop("disabled", true);
      $(".copy-but").prop("disabled", true);

      /* Compilation error */
      $(".process .tooltip > span").text(compilerOut.returnMessage);
      $(".process .tooltip").removeClass("info"); $(".process .tooltip").addClass("error");
      $(".process .tooltip").show();
    }
  });

  /* List modules */
  for (let x in mods) {
    let m = mods[x];
    $(".process-but select")
      .append("<option value=\"" + x + "\">" + m.meta.displayname + "</option>");
  }

  /* Download button */
  $(".dl-but button").click(function() {
    let compilerOut = $(".export > textarea").val();

    let sketchName = "Sketch";
    let zipHandler = new JSZip();

    // Add the payload as .ino
    zipHandler.file(sketchName + "/" + sketchName + ".ino", compilerOut);

    // Add readme
    zipHandler.file("readme", $.ajax({
      url: 'readme.default',
      mimeType: 'text/plain',
      type: 'get',
      success: function(data) {return data;}
    }));

    // Craft the lib
    let lib = "";
    let selectedModule = mods[$(".process-but select").find(":selected").val()];
    let selectedLocale = selectedModule.meta.locales[$(".dl-but select").find(":selected").val()];
    for (let x in selectedModule.meta.locales._meta.parts) {
      let p = selectedModule.meta.locales._meta.parts[x];
      if (p == '_locale_')
        lib += selectedLocale.data;
      else
        lib += p;
    }

    // Append all to the zip
    zipHandler.file(
      sketchName + "/" + selectedModule.meta.locales._meta.name + ".cpp", lib);
    zipHandler.file(
      sketchName + "/" + selectedModule.meta.locales._meta.name + ".h",
      selectedModule.meta.locales._meta.header);

    // Download
    zipHandler.generateAsync({type:"blob"})
      .then(function(content) {
        saveAs(content, sketchName + ".zip");
      }
    );
  });

  /* Copy to clipboard button */
  $(".copy-but").click(function() {
    let copyTextarea = $(".export > textarea");
    copyTextarea.select();

    try {
      document.execCommand('copy');

      $(".copy-but").text("Copied !");
      $(".copy-but").prop("disabled", true);
    } catch (e) {/* Error */}
  });
});
