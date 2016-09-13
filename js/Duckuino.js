var keyMap = [
  // Special keys
  [
    'ALT',
    'GUI',
    'CTRL',
    'CONTROL',
    'SHIFT',
    'WINDOWS',
    'COMMAND',
    'MENU',
    'ESC',
    'END',
    'SPACE',
    'TAB',
    'PRINTSCREEN',
    'ENTER',
    'UPARROW',
    'DOWNARROW',
    'LEFTARROW',
    'RIGHTARROW',
    'CAPSLOCK',
    'DELETE',
    'DEL',
    'ESCAPE'
  ],
  [
    'KEY_LEFT_ALT',
    'KEY_LEFT_GUI',
    'KEY_LEFT_CTRL',
    'KEY_LEFT_CTRL',
    'KEY_LEFT_SHIFT',
    'KEY_LEFT_GUI',
    'KEY_LEFT_GUI',
    '229',
    'KEY_LEFT_ESC',
    'KEY_END',
    '\' \'',
    'KEY_TAB',
    '206',
    'KEY_RETURN',
    'KEY_UP_ARROW',
    'KEY_DOWN_ARROW',
    'KEY_LEFT_ARROW',
    'KEY_RIGHT_ARROW',
    'KEY_CAPS_LOCK',
    'KEY_DELETE',
    'KEY_DELETE',
    'KEY_ESC'
  ],
  // Normal keys
  [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ],
  [
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    111,
    112,
    113,
    114,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122
  ]
];

class Duckuino {

  constructor(lang) {
    this.keyMap = keyMap;
  }

  compile(inputCode){

    // Check if the parameter is empty or undefined
    if (inputCode == '' || inputCode == undefined)
    {
      console.error('Error: No ducky script was entered !');
      return 'Error, please see console...';
    }

    // Parsing
    var parsedDucky = this._parse(inputCode);
    if (parsedDucky == '' || parsedDucky == undefined)
    {
      return 'Error, please see console...';
    }

    // Returning the total uploadable script
    return '// Init function\n'
    + 'void setup()\n'
    + '{\n'
    + '  // Begining the stream\n'
    + '  Keyboard.begin();\n\n'
    + '  // Waiting 500ms for init\n'
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

  // The parsing function
   _parse(toParse)
  {
    var parsedScript = '';

    // Remove unnecessary empty lines
    toParse = toParse.replace(/[\n]{2,}/g, '\n');
    
    // Cuting the input in lines
    var lineArray = toParse.split('\n');

    // Var who indicates to release all at the line end
    var releaseAll = false;

    // Loop every line
    for (var i = 0; i < lineArray.length; i++)
    {
      // Line empty, skip
      if (lineArray[i] == '' || lineArray[i] == '\n')
      {
        console.log('Info: Skipped line ' + (i + 1) + ', because was empty.');
        break;
      }

      // Make sure to be false
      releaseAll = false;
      parsedScript += '\n';

      // Cutting every line in words
      var wordArray = lineArray[i].split(' ');

      // Handle commands

      // STRING
      if (wordArray[0] == 'STRING')
      {
        // Wipe the command
        wordArray.shift();
        var textString = '';
        while (wordArray.length)
        {
          if (wordArray.length > 1)
          textString += wordArray[0] + ' ';
           else
          textString += wordArray[0];
          wordArray.shift();
        }

        // Replace all '"' by '\"' and all '\' by '\\'
        var textString = textString.split('\\').join('\\\\').split('"').join('\\"');

        if (textString != '')
        {
          parsedScript += '  Keyboard.print("' + textString + '");\n';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', STRING needs a text to type...')
          return;
        }

        // DELAY
      } else if (wordArray[0] == 'DELAY') {

        // Wipe the command
        wordArray.shift();
        if (wordArray[0] != undefined && wordArray[0] != '')
        {
          parsedScript += '  delay(' + wordArray[0] + ');\n';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', DELAY needs a time to delay...')
          return;
        }

        // Wiping other arguments
        while (wordArray.length) {
          wordArray.shift();
        }

      // TYPE
      } else if (wordArray[0] == 'TYPE') {

        // Wipe the command
        wordArray.shift();
        if (wordArray[0] != undefined && wordArray[0] != '')
        {
          for (z = 0; z < keyMap[2].length; z++)
          {
            commandKnown = true;
            if (wordArray[0] == keyMap[2][z])
            {
              // Replace the DuckyScript key by the Arduino key name
              parsedScript += '  typeKey(' + keyMap[3][z] + ');\n';
              break;
            }
          }
        } else {
          console.error('Error: at line: ' + (i + 1) + ', TYPE needs a key to type...')
          return;
        }

        // Wiping other arguments
        while (wordArray.length) {
          wordArray.shift();
        }

      // REM
      } else if(wordArray[0] == 'REM'){

        // Wipe the command
        wordArray.shift();
        var textString = '';

        while (wordArray.length)
        {
          if (wordArray.length > 1)
          textString += wordArray[0] + ' ';
           else
          textString += wordArray[0];
          wordArray.shift();
        }

        // Replace all '"' by '\"' and all '\' by '\\'
        var textString = textString.split('\\').join('\\\\').split('"').join('\\"');
        if (textString != '')
        {
          parsedScript += '  // ' + textString + '\n';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', REM was left empty')
          return;
        }
      }

      while (wordArray.length)
      {
        var commandKnown = false;
        if (releaseAll && wordArray[0].length == 1)
        {
          for (var z = 0; z < keyMap[2].length; z++)
          {
            if (wordArray[0] == keyMap[2][z])
            {
              commandKnown = true;

              // Replace the DuckyScript key by the Arduino key name
              parsedScript += '  Keyboard.press(' + keyMap[3][z] + ');\n';
              break;
            }
          }
        }
        for (var y = 0; y < this.keyMap[0].length; y++)
        {
          if (wordArray[0] == this.keyMap[0][y])
          {
            commandKnown = true;
            if (wordArray.length == 1 && !releaseAll)
            {
              parsedScript += '  typeKey(' + this.keyMap[1][y] + ');\n';
            } else {
              // Indicate that we need to release all keys at EOL
              releaseAll = true;

              // Replace the DuckyScript key by the Arduino key name
              parsedScript += '  Keyboard.press(' + this.keyMap[1][y] + ');\n';
            }
            break;
          }
        }
        if (!commandKnown)
        break;
        wordArray.shift();
      }
      if (wordArray.length)
      {
        console.error('Error: Unknown command or key \'' + wordArray[0] + '\' at line: ' + (i + 1) + '.')
        return;
      }

      // If we need to release keys, we do
      if (releaseAll)
      parsedScript += '  Keyboard.releaseAll();\n';
    }

    console.log('Done parsed ' + (lineArray.length) + ' lines.');
    return parsedScript;
  }
}
