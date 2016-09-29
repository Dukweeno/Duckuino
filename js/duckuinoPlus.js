var commandMap = { // Key that can be typed
  ESCAPE:'KEY_LEFT_ESC',
  ESC:'KEY_LEFT_ESC',
  MENU:'229',
  END:'KEY_END',
  SPACE:'\' \'',
  TAB:'KEY_TAB',
  PRINTSCREEN:'206',
  ENTER:'KEY_RETURN',
  UPARROW:'KEY_UP_ARROW',
  DOWNARROW:'KEY_DOWN_ARROW',
  LEFTARROW:'KEY_LEFT_ARROW',
  RIGHTARROW:'KEY_RIGHT_ARROW',
  UP:'KEY_UP_ARROW',
  DOWN:'KEY_DOWN_ARROW',
  LEFT:'KEY_LEFT_ARROW',
  RIGHT:'KEY_RIGHT_ARROW',
  CAPSLOCK:'KEY_CAPS_LOCK',
  DELETE:'KEY_DELETE',
  DEL:'KEY_DELETE'
};

var comboMap = { // Key that can only be used in combos
  ALT:'KEY_LEFT_ALT',
  SHIFT:'KEY_LEFT_SHIFT',
  CTRL:'KEY_LEFT_CTRL',
  CONTROL:'KEY_LEFT_CTRL',
  GUI:'KEY_LEFT_GUI',
  WINDOWS:'KEY_LEFT_GUI',
  COMMAND:'KEY_LEFT_GUI'
};

var keyMap = { // Normal keys
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

class Duckuino {
  constructor() {
    this.keyMap = keyMap;
    this.commandMap = commandMap;
    this.comboMap = comboMap;
  }

  toArduino(inputCode)
  {
    // Check if the parameter is empty or undefined
    if (inputCode == '' || inputCode == undefined)
    {
      console.error('Error: No ducky script was entered !');
      return 'Error, please see console...';
    }  // Parsing

    var parsedDucky = this._parse(inputCode);
    if (parsedDucky == '' || parsedDucky == undefined)
    {
      return 'Error, please see console...';
    }  // Returning the total uploadable script

    return '// Init function\n'
    + 'void setup()\n'
    + '{\n'
    + '  // Begining the stream\n'
    + '  Keyboard.begin();\n\n'
    + '  // Waiting 500ms for init\n'
    + '  delay(500);\n'
    + '\n' + parsedDucky
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

  // The parsing function
   _parse(toParse)
  {
    var parsedScript = '';

    // Cuting the input in lines
    var lineArray = toParse.split('\n');

    // Loop every line
    for (var i = 0; i < lineArray.length; i++)
    {
      // Line empty, skip
      if (lineArray[i] == '' || lineArray[i] == '\n')
      {
        console.log('Info: Skipped line ' + (i + 1) + ', because was empty.');
        continue;
      }
      
      // Var who indicates to release all at the line end
      var releaseAll = false;

      // Command known
      var commandKnown = false;

      // Cutting every line in words
      var wordArray = lineArray[i].split(' ')
      var wordOne = wordArray[0];

      // Handle commands
      switch(wordOne){
        case "STRING":
          wordArray.shift();
          
          var textString = wordArray.join(' ');

          // Replace all '"' by '\"' and all '\' by '\\'
          var textString = textString.split('\\').join('\\\\').split('"').join('\\"');
          if (textString !== '')
          {
            parsedScript += '  Keyboard.print("' + textString + '");';
            commandKnown = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', STRING needs a text to type...')
            return;
          }
          break;
        case "DELAY":
          wordArray.shift();
		  
		  if(wordArray[0] == undefined || wordArray[0] == '') {
            console.error('Error: at line: ' + (i + 1) + ', DELAY needs a time to delay...')
            return;
          }
          
          if (! isNaN(wordArray[0]))
          {
            parsedScript += '  delay(' + wordArray[0] + ');\n';
            commandKnown = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', DELAY only acceptes numbers...')
            return;
          }
          break;
        case "TYPE":
          wordArray.shift();
          
		  if(wordArray[0] == undefined || wordArray[0] == '') {
            console.error('Error: at line: ' + (i + 1) + ', TYPE needs a key to type...')
            return;
          }
		  
          if (keyMap[wordArray[0]] !== undefined)
          {
            commandKnown = true;
            // Replace the DuckyScript key by the Arduino key name
            parsedScript += '  typeKey(' + keyMap[wordArray[0]] + ');\n';
          } else {
            console.error('Error: Unknown letter \'' + wordArray[0] +'\' at line: ' + (i + 1))
            return;		    
		  }
          break;
        case "REM":
          wordArray.shift();
          
          // Placing the comment to arduino code
          if (wordArray[0] !== undefined && wordArray[0] !== '')
          {
            commandKnown = true;
            parsedScript += '  // ' + wordArray.join(' ');
          } else {
            console.error('Error: at line: ' + (i + 1) + ', REM needs a comment...')
            return;
          }
          break;
        case "REPEAT":
		  commandKnown = true;
          break;
        default:
          if (wordArray.length == 1)
          {
            if (comboMap[wordArray[0]] !== undefined)
            {
              commandKnown = true;
              
              parsedScript += '  typeKey(' + comboMap[wordArray[0]] + ');\n';
            }else if (commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              
              parsedScript += '  typeKey(' + commandMap[wordArray[0]] + ');\n';
            }else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
          while (wordArray.length){
            if (comboMap[wordArray[0]] !== undefined)
            {
              commandKnown = true;
              releaseAll = true;
              
              parsedScript += '  Keyboard.press(' + comboMap[wordArray[0]] + ');\n';
            }else if (commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;
              
              parsedScript += '  Keyboard.press(' + commandMap[wordArray[0]] + ');\n';
            }else if (keyMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              releaseAll = true;
              
              parsedScript += '  Keyboard.press(' + keyMap[wordArray[0]] + ');\n';
            }else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
      }

      if (!commandKnown)
      {
        console.error('Error: Unknown command or key \'' + wordArray[0] + '\' at line: ' + (i + 1) + '.')
        return;
      }    
	  
	  // If we need to release keys, we do
      if (releaseAll)
        parsedScript += '  Keyboard.releaseAll();\n';
      
      parsedScript += '\n'; // New line
    }
	
    console.log('Done parsed ' + (lineArray.length) + ' lines.');
    return parsedScript;
  }
}
