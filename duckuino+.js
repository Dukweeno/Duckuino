var keyMap = [ // Special keys
  ['ALT',
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
  'DEL'
  ],
  ['KEY_LEFT_ALT',
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
   'KEY_DELETE'
  ], // Normal keys
  ['A',
   'B',
   'C',
   'D',
   'E',
   'F',
   'G',
   'H',
   'I',
   'J',
   'K',
   'L',
   'M',
   'N',
   'O',
   'P',
   'Q',
   'R',
   'S',
   'T',
   'U',
   'V',
   'W',
   'X',
   'Y',
   'Z'
  ],
  [97,
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
  ]];

// The main function
function duckyCompile(toParse)
{
  // Check if the parameter is empty or undefined
  if (toParse == '' || toParse == undefined)
  {
    console.error('Error: No ducky script was entered !');
    return 'Error, please see console...';
  }  // Parsing

  var parsedDucky = parseDucky(toParse);
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
}// The parsing function

function parseDucky(toParse)
{
  var parsedScript = '';
  // Cuting the input in lines
  var lineArray = toParse.split('\n');
  // Var who indicates to release all at the line end
  var releaseAll = false;
  // Loop every line
  for (i = 0; i < lineArray.length; i++)
  {
    // Line empty, skip
    if (lineArray[i] == '' || lineArray[i] == '\n')
    {
      console.log('Info: Skipped line ' + (i + 1) + ', because was empty.');
      break;
    }    // Make sure to be false

    releaseAll = false;
    parsedScript += '\n';
    // Cutting every line in words
    var wordArray = lineArray[i].split(' ');
    // Handle commands
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
      }      // Replace all '"' by '\"' and all '\' by '\\'

      var textString = textString.split('\\').join('\\\\').split('"').join('\\"');
      if (textString != '')
      {
        parsedScript += '  Keyboard.print("' + textString + '");\n';
      } else {
        console.error('Error: at line: ' + (i + 1) + ', STRING needs a text to type...')
        return;
      }
    } else if (wordArray[0] == 'DELAY') {
      // Wipe the command
      wordArray.shift();
      if (wordArray[0] != undefined && wordArray[0] != '')
      {
        parsedScript += '  delay(' + wordArray[0] + ');\n';
      } else {
        console.error('Error: at line: ' + (i + 1) + ', DELAY needs a time to delay...')
        return;
      }      // Wiping other arguments

      while (wordArray.length) {
        wordArray.shift();
      }
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
      }      // Wiping other arguments

      while (wordArray.length) {
        wordArray.shift();
      }
    }    // Loop for special key

    while (wordArray.length)
    {
      var commandKnown = false;
      if (releaseAll && wordArray[0].length == 1)
      {
        for (z = 0; z < keyMap[2].length; z++)
        {
          commandKnown = true;
          if (wordArray[0] == keyMap[2][z])
          {
            // Replace the DuckyScript key by the Arduino key name
            parsedScript += '  Keyboard.press(' + keyMap[3][z] + ');\n';
            break;
          }
        }
      }
      for (y = 0; y < keyMap[0].length; y++)
      {
        if (wordArray[0] == keyMap[0][y])
        {
          commandKnown = true;
          if (wordArray.length == 1 && !releaseAll)
          {
            parsedScript += '  typeKey(' + keyMap[1][y] + ');\n';
          } else {
            // Indicate that we need to release all keys at EOL
            releaseAll = true;
            // Replace the DuckyScript key by the Arduino key name
            parsedScript += '  Keyboard.press(' + keyMap[1][y] + ');\n';
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
      console.error('Error: Unknown command \'' + wordArray[0] + '\' at line: ' + (i + 1) + '.')
      return;
    }    // If we need to release keys, we do

    if (releaseAll)
    parsedScript += '  Keyboard.releaseAll();\n';
  }
  console.log('Done parsed ' + (lineArray.length) + ' lines.');
  return parsedScript;
}
