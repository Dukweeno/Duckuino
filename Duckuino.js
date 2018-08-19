/**
 *  Duckuino, an open source project licenced under MIT License
 *  GitHub repo can be found at the following link:
 *    - https://github.com/Nurrl/Duckuino
 */

/* jshint esversion: 6 */

/* Function to request files */
function getFile(sUrl) {
  /* Init request */
  let oReq = new XMLHttpRequest();
  //console.log("@<- " + sUrl);

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

class Modules {
  constructor() {
    /* Load modules *//* jshint evil:true */
    let modules = JSON.parse(getFile("modules/modules.json"));
    for (let x in modules) {
        let m = modules[x];
        m.meta = JSON.parse(getFile("modules/" + m.path + m.meta));
        m.module = eval(getFile("modules/" + m.path + m.module));
        if (Object.keys(m.meta.locales).length > 0) {
          let ls = m.meta.locales;
          for (let y in ls) {
            let l = ls[y];
            if (y == "_meta")
              continue;
            l.data = getFile("modules/" + m.path + l.path);
          }
          ls._meta.header = getFile("modules/" + m.path + ls._meta.header);
          for (let y in ls._meta.parts) {
            let f = ls._meta.parts[y];
            if (f == "_locale_")
              continue;
            ls._meta.parts[y] = getFile("modules/" + m.path + f);
          }
        }
    }
    this.list = modules;
  }
}

class Duckuino {
  constructor() {}

  compileCode(compileStr, withModule) {
    /* Init timer */
    let timerStart = window.performance.now();

    /* Check if module loaded */
    if (withModule === undefined) {
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

    let commandKnown;
    let lineStr;
    let lastLine = ''; let lastLineCount = 0;

    /* Cut the input in lines */
    let lineArray = compileStr.split('\n');

    /* Loop every line */
    for (let i = 0; i < lineArray.length; i++)
    {
      /* Line empty, skip */
      if (lineArray[i] === '' || lineArray[i] === '\n')
        continue;

      /* Reset lets */
      commandKnown = false;
      lineStr = '';

      /* Split lines in words */
      let argList = lineArray[i].split(' ');
      let argOne = argList[0];

      /* Parse commands */
      if (withModule.functionMap[argOne] !== undefined) {
        let µ = new Object({
          keyMap: withModule.keyMap,
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
              let tmplet = thisPtr.compiledCode.split('\n');

              tmplet.splice(-lastLineCount, lastLineCount - 1);
              thisPtr.compiledCode = tmplet.join('\n');

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
        lineStr += withModule.functionMap[argOne](argList, µ);

        /* Post process the line */
        lineStr = withModule.postLine(lineStr, µ);
      } else { /* Parse keystokes */
        let strokeArray = Array();

        for(let y = 0; y < argList.length; y++) {

          if(withModule.commandMap[argList[y]] !== undefined) {
            /* Push key to Array */
            strokeArray.push(withModule.commandMap[argList[y]]);
          } else if(withModule.comboMap[argList[y]] !== undefined) {
            /* Push key to Array */
            strokeArray.push(withModule.comboMap[argList[y]]);
          } else if(withModule.keyMap[argList[y]] !== undefined && y != 0) {
            /* Push key to Array */
            strokeArray.push(withModule.keyMap[argList[y]]);
          } else {
            /* If command unknown, throw error */
            this.errorList.push({
              errorMessage: "Unknown command or key: '" + argList[y] + "'",
              errorLine: (i + 1)
            });
          }
        }

        /* Transform key array to string */
        lineStr += withModule.computeKeys(strokeArray);
      }

      /* Calculate line count */
      lastLineCount = lineStr.split('\n').length;

      /* Append this compiled line to global output */
      lastLine = lineStr;
      this.compiledCode += lineStr;
    }

    /* Stop timer */
    let timerEnd = window.performance.now();
    let timeElapsed = (timerEnd - timerStart).toFixed(2);

    /* Return error if error and code if not */
    if (this.errorList.length > 0) {
      /* Return error(s) */
      return {
        compiledCode: undefined,
        compileTime: -1,

        returnCode: 1,
        returnMessage: function(errorList) {
          let errorString;

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
        compiledCode: withModule.getFinalCode(this.compiledCode),
        compileTime: timeElapsed,

        returnCode: 0,
        returnMessage: "Info: Code successfully parsed in " + timeElapsed + "ms !"
      };
    }
  }
}
