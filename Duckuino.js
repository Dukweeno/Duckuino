/**
 *  Duckuino, an open source project licenced under MIT License
 *  GitHub repo can be found at the following link:
 *    - https://github.com/Nurrl/Duckuino
 */

/* jshint esversion: 6 */

/* Function to request files */
function getFile(sUrl) {
  /* Init request */
  var oReq = new XMLHttpRequest();

  /* Sending request */
  oReq.open("get", sUrl, false);
  oReq.overrideMimeType("text/plain");
  oReq.send(null);

  /* Getting response */
  if (oReq.readyState == 4 && (oReq.status == 200 || oReq.status === 0)) {
    return oReq.responseText;
  } else {
    return undefined;
  }
}

class Duckuino {
  constructor() {}

  listModules() {
    /* List all modules in the moduleList file */
    if (!this.moduleArray) {
      this.moduleArray = getFile("modules/moduleList").split('\n');
      this.moduleArray.pop();
    }

    /* Return the list */
    return this.moduleArray;
  }

  loadModule(moduleName) {
    /* Check if module exists */
    if (this.listModules().indexOf(moduleName) == -1) {
      console.error("Error: This module doesn't exist !");

      /* Module is not loaded */
      this.loadedModule = undefined;
    } else {
      /* Load module *//* jshint evil:true */
      this.loadedModule = eval(getFile("modules/" + moduleName + ".js"));
    }
  }

  compileCode(toCompile) {
    /* Init chronometer */
    var timerStart = window.performance.now();

    /* Check if module loaded */
    if (this.loadedModule === undefined) {
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 9,
        returnMessage: "Error: No module loaded !",
        errorsList: this.errorsList
      };
    }

    /* Check if code is not empty */
    if (toCompile === undefined || toCompile === "") {
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 9,
        returnMessage: "Error: No input was entered !",
        errorsList: this.errorsList
      };
    }

    /* Trim whitespaces and tabs */
    toCompile = toCompile.replace(/^ +| +$/gm, '');
    toCompile = toCompile.replace(/\t/g, '');

    /* Errors */
    this.errorsList = [];

    /* Preset all used vars */
    this.compiledCode = '';
    var commandKnown = false;
    var lastOutput, lastLineCount, currentOutput;

    /* Cut the input in lines */
    var lineArray = toCompile.split('\n');

    /* Loop every line */
    for (var i = 0; i < lineArray.length; i++)
    {
      /* Line empty, skip */
      if (lineArray[i] === '' || lineArray[i] === '\n')
        continue;

      /* Reset vars */
      commandKnown = false;
      currentOutput = '';

      /* Split lines in words */
      var argArray = lineArray[i].split(' ');
      var argOne = argArray[0];

      /* Parse commands */
      if (this.loadedModule.functionMap[argOne] !== undefined) {
        /* Execute the function add returned string to global string */
        currentOutput += this.loadedModule.functionMap[argOne](
          argArray,
          /**
           * This strange behavious returns function with a pointer
           * to 'this' without losing it, and passes it to module.
           */
          function (thisPtr, currentLine) {
            return function(errorMessage) {
              thisPtr.errorsList.push({
                errorMessage: errorMessage,
                errorLine: currentLine
              });
            };
          }(this, (i + 1)),
          /**
           * This is to reference the global object itself and to allow
           * acceding it into functionMap.
           */
          function (objModule) {
            return function() {
              return objModule;
            };
          }(this.loadedModule),
          /**
           * This one is to get the lastOutput, and in the same way trim
           * it from from the current compiledCode, this is a workaround for
           * the REPLAY command.
           */
          function (thisPtr, lastOutput, lastLineCount) {
            return function() {
              var tmpVar = thisPtr.compiledCode.split('\n');
              tmpVar.splice(-lastLineCount, lastLineCount - 1);
              thisPtr.compiledCode = tmpVar.join('\n');

              return lastOutput;
            };
          }(this, lastOutput, lastLineCount)
        );
      } else { /* Parse keystokes */
        var strokeArray = Array();

        for(var y = 0; y < argArray.length; y++) {

          if(this.loadedModule.commandMap[argArray[y]] !== undefined) {
            /* Push key to Array */
            strokeArray.push(this.loadedModule.commandMap[argArray[y]]);
          } else if(this.loadedModule.comboMap[argArray[y]] !== undefined) {
            /* Push key to Array */
            strokeArray.push(this.loadedModule.comboMap[argArray[y]]);
          } else if(this.loadedModule.keyMap[argArray[y]] !== undefined && y != 0) {
            /* Push key to Array */
            strokeArray.push('"' + this.loadedModule.keyMap[argArray[y]] + '"');
          } else {
            /* If command unknown, throw error */
            this.errorsList.push({
              errorMessage: "Unknown command or key: '" + argArray[y] + "'",
              errorLine: (i + 1)
            });
          }
        }

        /* Transform key array to string */
        currentOutput += this.loadedModule.computeKeys(strokeArray);
      }

      currentOutput += '\n';

      /* Calculate line count */
      lastLineCount = currentOutput.split('\n').length;

      /* Append this compiled line to global output */
      lastOutput = currentOutput;
      this.compiledCode += currentOutput;
    }

    /* Stop timer */
    var timerEnd = window.performance.now();
    var timeElapsed = (timerEnd - timerStart).toFixed(2);

    /* Return error if error and code if not */
    if (this.errorsList.length > 0) {
      /* Return error(s) */
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 1,
        returnMessage: function(errorsList) {
          var errorString = "The compiler returned some errors:\n";

          errorsList.forEach(function(errorObj) {
            errorString += "Line " + errorObj.errorLine + " -> " + errorObj.errorMessage + "\n";
          });

          return errorString;
        }(this.errorsList),
        errorsList: this.errorsList
      };
    } else {
      /* Return the compiled code */
      return {
        compiledCode: this.loadedModule.getFinalCode(this.compiledCode),
        compileTime: timeElapsed,

        returnCode: 0,
        returnMessage: "Info: Code successfully parsed in " + timeElapsed + "ms !"
      };
    }
  }
}
