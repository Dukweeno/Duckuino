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
      this.moduleArray = getFile("modules/modules").split('\n');
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

  /* TO-DO: getModuleInfos() {} */

  compileCode(compileStr) {
    /* Init timer */
    var timerStart = window.performance.now();

    /* Check if module loaded */
    if (this.loadedModule === undefined) {
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 9,
        returnMessage: "Error: No module loaded !",
        errorList: this.errorList
      };
    }

    /* Check if code is empty */
    if (compileStr === undefined || compileStr === "") {
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 9,
        returnMessage: "Error: No input was entered !",
        errorList: this.errorList
      };
    }

    /* Trim whitespaces and tabs */
    compileStr = compileStr.replace(/^ +| +$/gm, '');
    compileStr = compileStr.replace(/\t/g, '');

    /* Errors */
    this.errorList = [];

    /* Preset all used vars */
    this.dataStorage = new Object();
    this.compiledCode = '';

    var commandKnown;
    var lineStr;
    var lastLine = ''; var lastLineCount = 0;

    /* Cut the input in lines */
    var lineArray = compileStr.split('\n');

    /* Loop every line */
    for (var i = 0; i < lineArray.length; i++)
    {
      /* Line empty, skip */
      if (lineArray[i] === '' || lineArray[i] === '\n')
        continue;

      /* Reset vars */
      commandKnown = false;
      lineStr = '';

      /* Split lines in words */
      var argList = lineArray[i].split(' ');
      var argOne = argList[0];

      /* Parse commands */
      if (this.loadedModule.functionMap[argOne] !== undefined) {
        var µ = new Object({
          keyMap: this.loadedModule.keyMap,
          /**
           * Pushes the error to the global error list.
           */
          throwError: function(thisPtr, currentLine) {
            return function(errorMessage) {
              thisPtr.errorList.push({
                errorMessage: errorMessage,
                errorLine: currentLine
              });
            };
          }(this, (i + 1)),
          /**
           * This one is to get the lastLine, and in the same way trim
           * it from from the current compiledCode, this is a workaround for
           * the REPLAY command.
           */
          trimLast: function(thisPtr, lastLine, lastLineCount) {
            return function() {
              var tmpVar = thisPtr.compiledCode.split('\n');

              tmpVar.splice(-lastLineCount, lastLineCount - 1);
              thisPtr.compiledCode = tmpVar.join('\n');

              return lastLine;
            };
          }(this, lastLine, lastLineCount),
          /**
           * Those two function are used to store persistent data, i.e:
           * Default Delay.
           */
          setData: function(thisPtr) {
            return function(dataName, dataValue) {
              thisPtr.dataStorage[dataName] = dataValue;
            };
          }(this),
          getData: function(thisPtr) {
            return function(dataName) {
              return thisPtr.dataStorage[dataName];
            };
          }(this),
        });

        /* Execute the function and add the returned string to the current string */
        lineStr += this.loadedModule.functionMap[argOne](argList, µ);

        /* Post process the line */
        lineStr = this.loadedModule.postLine(lineStr, µ);
      } else { /* Parse keystokes */
        var strokeArray = Array();

        for(var y = 0; y < argList.length; y++) {

          if(this.loadedModule.commandMap[argList[y]] !== undefined) {
            /* Push key to Array */
            strokeArray.push(this.loadedModule.commandMap[argList[y]]);
          } else if(this.loadedModule.comboMap[argList[y]] !== undefined) {
            /* Push key to Array */
            strokeArray.push(this.loadedModule.comboMap[argList[y]]);
          } else if(this.loadedModule.keyMap[argList[y]] !== undefined && y != 0) {
            /* Push key to Array */
            strokeArray.push('"' + this.loadedModule.keyMap[argList[y]] + '"');
          } else {
            /* If command unknown, throw error */
            this.errorList.push({
              errorMessage: "Unknown command or key: '" + argList[y] + "'",
              errorLine: (i + 1)
            });
          }
        }

        /* Transform key array to string */
        lineStr += this.loadedModule.computeKeys(strokeArray);
      }

      /* Calculate line count */
      lastLineCount = lineStr.split('\n').length;

      /* Append this compiled line to global output */
      lastLine = lineStr;
      this.compiledCode += lineStr;
    }

    /* Stop timer */
    var timerEnd = window.performance.now();
    var timeElapsed = (timerEnd - timerStart).toFixed(2);

    /* Return error if error and code if not */
    if (this.errorList.length > 0) {
      /* Return error(s) */
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 1,
        returnMessage: function(errorList) {
          var errorString;

          if(errorList.length > 1) {
            errorString = "The compiler returned some errors:\n";
          } else {
            errorString = "The compiler returned an error:\n";
          }

          errorList.forEach(function(errorObj) {
            errorString += "Line " + errorObj.errorLine + " -> " + errorObj.errorMessage + "\n";
          });

          return errorString;
        }(this.errorList),
        errorList: this.errorList
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
