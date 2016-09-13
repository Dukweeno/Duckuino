var commandMap = {
  ALT:'KEY_LEFT_ALT',
  GUI:'KEY_LEFT_GUI',
  WINDOWS:'KEY_LEFT_GUI',
  COMMAND:'KEY_LEFT_GUI',
  CTRL:'KEY_LEFT_CTRL',
  CONTROL:'KEY_LEFT_CTRL',
  SHIFT:'KEY_LEFT_SHIFT',
  ESCAPE:'KEY_ESC',
  MENU:'229',
  ESC:'KEY_LEFT_ESC',
  END:'KEY_END',
  SPACE:'\' \'',
  TAB:'KEY_TAB',
  PRINTSCREEN:'206',
  ENTER:'KEY_RETURN',
  UPARROW:'KEY_UP_ARROW',
  DOWNARROW:'KEY_DOWN_ARROW',
  LEFTARROW:'KEY_LEFT_ARROW',
  RIGHTARROW:'KEY_RIGHT_ARROW',
  CAPSLOCK:'KEY_CAPS_LOCK',
  DELETE:'KEY_DELETE',
  DEL:'KEY_DELETE'
};
var keyMap = {
  a:'97',
  b:'98',
  c:'99',
  d:'100',
  e:'101',
  f:'102',
  g:'103',
  h:'104',
  i:'105',
  j:'106',
  k:'107',
  l:'108',
  m:'109',
  n:'110',
  o:'111',
  p:'112',
  q:'113',
  r:'114',
  s:'115',
  t:'116',
  u:'117',
  v:'118',
  w:'119',
  x:'120',
  y:'121',
  z:'122'
};
class Duckuino{

  constructor(lang) {
    this.keyMap = keyMap;
    this.commandMap = commandMap;
  }

<<<<<<< Updated upstream
  compile(inputCode){
    var errorMsg = 'Error! check the console.';
    
    // Check if the parameter is empty or undefined
    if (inputCode == '' || inputCode == undefined){
      console.error('Error: the compiler was not able to identify the code as valid DuckyScript.');
      return errorMsg;
    }

    // Parsing
    var parsedDucky = this._parse(inputCode);
    if (parsedDucky == '' || parsedDucky == undefined){
      return errorMsg;
    }

    // Build the Arduino code skeleton
    return '// Init function\n'
    + 'void setup()\n'
    + '{\n'
    + '  // Start payload\n'
    + '  Keyboard.begin();\n\n'
    + '  // Wait 500ms\n'
    + '  delay(500);\n'
    + parsedDucky
    + '}\n'
    + '\n'
    + 'void typeKey(int key)\n'
    + '{\n'
    + '  Keyboard.press(key);\n'
    + '  delay(50);\n'
    + '  Keyboard.release(key);\n'
    + '}\n\n'
    + '// Unused\n'
    + 'void loop() {}';
  }

  // The parser
   _parse(toParse){
    var parsedScript = '';
=======
  parser(code){
    var parsed = '';
>>>>>>> Stashed changes

    // Remove unnecessary empty lines
    code = code.replace(/[\n]{2,}/g, '\n');

<<<<<<< Updated upstream
    // Split the input into lines
    var lineArray = toParse.split('\n');
=======
    // Split the DuckyScript into lines
    var lines = code.split('\n');
>>>>>>> Stashed changes

    // Indicate to release all at the of line
    var releaseAll = false;

<<<<<<< Updated upstream
    // Loop all lines
    for (var i = 0; i < lineArray.length; i++){
      
      // Skip line if empty
      if (lineArray[i] == '' || lineArray[i] == '\n'){
        break;
      }

      releaseAll = false;
      parsedScript += '\n';

      // Split line to words
      var wordArray = lineArray[i].split(' ');

      // Compile commands

      // STRING
      if (wordArray[0] == 'STRING'){
        // Get string text
        wordArray.shift();
        var textString = '';
        while (wordArray.length){
          if (wordArray.length > 1)
          textString += wordArray[0] + ' ';
           else
          textString += wordArray[0];
          wordArray.shift();
        }

        // Replace " with \" and \ with \\
        var textString = textString.split('\\').join('\\\\').split('"').join('\\"');
=======
    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];

      releaseAll = false;
      parsed += '\n';

      // Split line to words
      var words = line.split(' ');

      // Parse special commands
      if(words[0]== "STRING"){
        words.shift();
        var string = '';

        while (words.length){
          if (words.length > 1){
            string += words[0] + ' ';
          } else {
            string += words[0];
            words.shift();
          }
        }

        // Replace " with \" and \ with \\
        string = string.split('\\').join('\\\\').split('"').join('\\"');
>>>>>>> Stashed changes

        if (string != ''){
          parsed += '  Keyboard.print("' + string + '");\n';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', STRING requires text (e.g. STRING Example text).')
          return;
        }

<<<<<<< Updated upstream
      // DELAY
      } else if (wordArray[0] == 'DELAY') {
        // Get delay time
        wordArray.shift();
        if (wordArray[0] != undefined && wordArray[0] != ''){
          parsedScript += '  delay(' + wordArray[0] + ');\n';
=======
      // Command: DELAY
      } else if(words[0] == "DELAY"){
        words.shift();
        if (words[0] != undefined && words[0] != ''){
          parsed += '  delay(' + words[0] + ');\n';
>>>>>>> Stashed changes
        } else {
          console.error('Error: at line: ' + (i + 1) + ', DELAY requires a number (e.g. DELAY 1000)')
          return;
        }
<<<<<<< Updated upstream

        // Clear other arguments
        while (wordArray.length) {
          wordArray.shift();
        }

      // TYPE
      } else if (wordArray[0] == 'TYPE') {
        // Get type key
        wordArray.shift();
        if (wordArray[0] != undefined && wordArray[0] != ''){
          for (z = 0; z < keyMap[2].length; z++){
            commandKnown = true;
            if (wordArray[0] == keyMap[2][z]){
              // Replace the DuckyScript key by the Arduino key name
              parsedScript += '  typeKey(' + keyMap[3][z] + ');\n';
              break;
            }
=======
        // Clear other arguments
        while (words.length) {
          words.shift();
        }

      // Command: GUI/CONTROL/CTRL/COMMAND/WINDOWS/SHIFT/ALT
      } else if(words[0] == "GUI" || words[0] == "WINDOWS" || words[0] == "CTRL" || words[0] == "COMMAND" || words[0] == "ALT" || words[0] == "SHIFT"){
        var keep = words[0];
        keep = this.commandMap[keep];
        words.shift();
        var press = '';
        var release = '';
        while (words.length){
          var key = words[0];
          key = this.keyMap[key];
          if (words.length > 1){
            press +=  '    Keyboard.press(' + key + ');\n';
            release +=  '    Keyboard.release(' + key + ');\n';
          } else {
            press +=  '    Keyboard.press(' + key + ');\n';
            release +=  '    Keyboard.release(' + key + ');\n';
            words.shift();
>>>>>>> Stashed changes
          }
        }
        if (string != ''){
          parsed += '  Keyboard.press('+keep+');\n  '+press+'        delay(50);\n  '+release+'  Keyboard.release('+keep+');\n';
        } else {
<<<<<<< Updated upstream
          console.error('Error: at line: ' + (i + 1) + ', TYPE requires a key')
          return;
        }

        // Clear other arguments
        while (wordArray.length) {
          wordArray.shift();
        }

      // REM
      } else if(wordArray[0] == 'REM'){
        // Get the string
        wordArray.shift();
        var textString = '';
=======
          parsed += '  Keyboard.press('+keep+');\n    delay(50);\n  Keyboard.release('+keep+');\n';
        }
        // Clear other arguments
        while (words.length) {
          words.shift();
        }

      // Command: TYPE
      } else if(words[0] == "TYPE"){
        words.shift();
        if (words[0] != undefined && words[0] != ''){
          var key = words[0];
          key = this.keyMap[key];
          parsed += '  typeKey(' + key + ');\n';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', TYPE requires a key')
          return;
        }
>>>>>>> Stashed changes

        // Clear other arguments
        while (words.length) {
          words.shift();
        }

<<<<<<< Updated upstream
        // Replace all '"' with '\"' and '\' with '\\'
        var textString = textString.split('\\').join('\\\\').split('"').join('\\"');
        if (textString != ''){
          parsedScript += '  // ' + textString + '\n';
=======
      // Command: REM
      } else if(words[0] == "REM"){
        words.shift();

        if (words[0] != undefined && words[0] != '')
        {
          var remTmp = '  //';
          while (words.length) {
            remTmp += ' ' + words[0];
            words.shift();
          }
          parsed += remTmp+'\n';
>>>>>>> Stashed changes
        } else {
          console.error('Error: at line: ' + (i + 1) + ', REM requires a comment')
          return;
        }
      }

<<<<<<< Updated upstream
      while (wordArray.length){
        var commandKnown = false;
        if (releaseAll && wordArray[0].length == 1){
          for (var z = 0; z < keyMap[2].length; z++){
            if (wordArray[0] == keyMap[2][z]){
              commandKnown = true;

              // Swap keyboard codes
              parsedScript += '  Keyboard.press(' + keyMap[3][z] + ');\n';
              break;
            }
          }
        }

        for (var y = 0; y < this.keyMap[0].length; y++){
          if (wordArray[0] == this.keyMap[0][y]){
            commandKnown = true;
            if (wordArray.length == 1 && !releaseAll){
              parsedScript += '  typeKey(' + this.keyMap[1][y] + ');\n';
            } else {
              // Release all keys at EOL
              releaseAll = true;

              // Swap keyboard codes
              parsedScript += '  Keyboard.press(' + this.keyMap[1][y] + ');\n';
            }
            break;
          }
        }
        if (!commandKnown)
        break;
        wordArray.shift();
      }

      if (wordArray.length){
        console.error('Error: Unknown command or key \'' + wordArray[0] + '\' at line: ' + (i + 1) + '.')
        return;
      }

      // Release all keys if needed
      if (releaseAll)
      parsedScript += '  Keyboard.releaseAll();\n';
    }

    console.log('Done: compiling ' + (lineArray.length) + ' lines.');
    return parsedScript;
=======
      while (words.length){
        var key = words[0];

        if(this.keyMap[key] != undefined){
          key = this.keyMap[key];
          parsed += '  Keyboard.press(' + key + ');\n    delay(50);\n  Keyboard.release(' + key + ');\n';
        } else if(this.commandMap[key] != undefined){
          if (words.length == 1 && !releaseAll){
            parsed += '  typeKey(' + this.commandMap[key] + ');\n';
          } else {
            parsed += '  Keyboard.press("' + this.commandMap[key] + '");\n  delay(50);\n  Keyboard.release("' + this.commandMap[key] + '");\n';
          }
        }

        words.shift();
      }
    }

    console.log('Done: compiling ' + (lines.length) + ' lines.');

    // Build the Arduino code skeleton
    return '// Init function\n'
    + 'void setup()\n'
    + '{\n'
    + '  // Start payload\n'
    + '  Keyboard.begin();\n\n'
    + '  // Wait 500ms\n'
    + '  delay(500);\n'
    + parsed
    + '}\n'
    + '\n'
    + '// Unused\n'
    + 'void loop() {}';
>>>>>>> Stashed changes
  }
}
