/*
 *  Dckuino.js, an open source project licenced under MIT License
 */

/* jshint esversion: 6 */
/* jshint laxbreak: true */

var arduinocommandMap = { // Key that can be typed
  ESCAPE:'KEY_ESC',
  ESC:'KEY_ESC',
  GUI:'KEY_LEFT_GUI',
  WINDOWS:'KEY_LEFT_GUI',
  COMMAND:'KEY_LEFT_GUI',
  MENU:'229',
  APP:'229',
  END:'KEY_END',
  SPACE:'\' \'',
  TAB:'KEY_TAB',
  PRINTSCREEN:'206',
  ENTER:'KEY_RETURN',
  RETURN:'KEY_RETURN',
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
  DEL:'KEY_DELETE',
  F1:'KEY_F1',
  F2:'KEY_F2',
  F3:'KEY_F3',
  F4:'KEY_F4',
  F5:'KEY_F5',
  F6:'KEY_F6',
  F7:'KEY_F7',
  F8:'KEY_F8',
  F9:'KEY_F9',
  F10:'KEY_F10',
  F11:'KEY_F11',
  F12:'KEY_F12',
  PAGEUP:'KEY_PAGE_UP',
  PAGEDOWN:'KEY_PAGE_DOWN'
};



var arduinocomboMap = { // Key that can only be used in combos
  ALT:'KEY_LEFT_ALT',
  SHIFT:'KEY_LEFT_SHIFT',
  CTRL:'KEY_LEFT_CTRL',
  CONTROL:'KEY_LEFT_CTRL',
  CTRL:'KEY_LEFT_CTRL',
  GUI:'KEY_LEFT_GUI',
};



var arduinokeyMap = { // Normal keys
  a:'a',
  b:'b',
  c:'c',
  d:'d',
  e:'e',
  f:'f',
  g:'g',
  h:'h',
  i:'i',
  j:'j',
  k:'k',
  l:'l',
  m:'m',
  n:'n',
  o:'o',
  p:'p',
  q:'q',
  r:'r',
  s:'s',
  t:'t',
  u:'u',
  v:'v',
  w:'w',
  x:'x',
  y:'y',
  z:'z'
};



var arduinoMap = {
  INIT: function() {
    return 0;
  },
  PROLOG: function() {
    return '#include "Keyboard.h"\n\n'
    + 'void typeKey(uint8_t key)\n'
    + '{\n'
    + '  Keyboard.press(key);\n'
    + '  delay(50);\n'
    + '  Keyboard.release(key);\n'
    + '}\n\n'
    + '/* Init function */\n'
    + 'void setup()\n'
    + '{\n'
    + '  // Begining the Keyboard stream\n'
    + '  Keyboard.begin();\n\n'
    + '  // Wait 500ms\n'
    + '  delay(500);\n\n'
  },
  EPILOG: function() {
    return '  // Ending stream\n'
    + '  Keyboard.end();\n'
    + '}\n\n'
    + '/* Unused endless loop */\n'
    + 'void loop() {}'
  },
  DELAY: function(time) {
    return '  delay(' + time + ');\n';
  },
  PARSE_STRING: function(str) {
    return '  Keyboard.print("' + str + '");\n'; 
  },
  KEY: function(key) {
    return '  typeKey(' + keyMap[key] + ');\n';
  },
  COMBOMAP: arduinocomboMap,
  COMMANDMAP: arduinocommandMap,
  KEYMAP: arduinokeyMap,
  KEYSTROKES: function(modifiers, keys, commands) {
    var s ='';
    for (i=0; i<modifiers.length; ++ i) {
        s +=  '  Keyboard.press(' + modifiers[i] + ');\n';
    }

    if (modifiers.length > 0) {
      if (keys.length > 0)
        s += '  Keyboard.press(\'' + keys[0] + '\');\n';

      if (commands.length > 0)
        s += '  Keyboard.press(' + commands[0] + ');\n';

      s += '  Keyboard.releaseAll();\n';

    } else {
      s += '  typeKey(' + keys.concat(commands)[0] + ');\n';
    }
    return s;
  }
};

// Count number of strings
var strCount = 0;
var constOut = '';

var digisparkcomboMap = {
  ALT:'MOD_ALT_LEFT',
  SHIFT:'MOD_SHIFT_LEFT',
  CTRL:'MOD_CONTROL_LEFT',
  CONTROL:'MOD_CONTROL_LEFT',
  CTRL:'MOD_CONTROL_LEFT',
  GUI:'MOD_GUI_LEFT',
};

var digisparkcommandMap = {
  ESCAPE:'KEY_ESC',
  ESC:'KEY_ESC',
  GUI:'KEY_LEFT_GUI',
  WINDOWS:'KEY_LEFT_GUI',
  COMMAND:'KEY_LEFT_GUI',
  MENU:'229',
  APP:'229',
  END:'KEY_END',
  SPACE:'KEY_SPACE',
  TAB:'KEY_TAB',
  PRINTSCREEN:'206',
  ENTER:'KEY_ENTER',
  RETURN:'KEY_ENTER',
  UPARROW:'KEY_ARROW_UP',
  DOWNARROW:'KEY_DOWN_ARROW',
  LEFTARROW:'KEY_LEFT_ARROW',
  RIGHTARROW:'KEY_ARIGHT_ARROW',
  UP:'KEY_UP_ARROW',
  DOWN:'KEY_DOWN_ARROW',
  LEFT:'KEY_LEFT_ARROW',
  RIGHT:'KEY_RIGHT_ARROW',
  CAPSLOCK:'KEY_CAPS_LOCK',
  DELETE:'KEY_DELETE',
  DEL:'KEY_DELETE',
  F1:'KEY_F1',
  F2:'KEY_F2',
  F3:'KEY_F3',
  F4:'KEY_F4',
  F5:'KEY_F5',
  F6:'KEY_F6',
  F7:'KEY_F7',
  F8:'KEY_F8',
  F9:'KEY_F9',
  F10:'KEY_F10',
  F11:'KEY_F11',
  F12:'KEY_F12',
  PAGEUP:'KEY_PAGE_UP',
  PAGEDOWN:'KEY_PAGE_DOWN',
};

var digisparkkeyMap = {
  a:'KEY_A',
  b:'KEY_B',
  c:'KEY_C',
  d:'KEY_D',
  e:'KEY_E',
  f:'KEY_F',
  g:'KEY_G',
  h:'KEY_H',
  i:'KEY_I',
  j:'KEY_J',
  k:'KEY_K',
  l:'KEY_L',
  m:'KEY_M',
  n:'KEY_N',
  o:'KEY_O',
  p:'KEY_P',
  q:'KEY_Q',
  r:'KEY_R',
  s:'KEY_S',
  t:'KEY_T',
  u:'KEY_U',
  v:'KEY_V',
  w:'KEY_W',
  x:'KEY_X',
  y:'KEY_Y',
  z:'KEY_Z',
  1:'KEY_1',
  2:'KEY_2',
  3:'KEY_3',
  4:'KEY_4',
  5:'KEY_5',
  6:'KEY_6',
  7:'KEY_7',
  8:'KEY_8',
  9:'KEY_9',
  0:'KEY_0'
};

var digisparkMap = {
  INIT: function() {
    strCount = 0;
    constOut = ''; 
    return 0;
  },
  PROLOG: function() {
    return '#include <avr/pgmspace.h>\n'
    + '#include "DigiKeyboard.h"\n'
    + constOut + '\n'
    + 'char buffer[256];\n\n'
    + '#define GetPsz(x) (strncpy_P(buffer, (char*)x, 256))\n'
    + '#define KEY_UP_ARROW\t\t0x52\n'
    + '#define KEY_DOWN_ARROW\t0x51\n'
    + '#define KEY_LEFT_ARROW\t\t0x50\n'
    + '#define KEY_RIGHT_ARROW\t\t0x4F\n'
    + '#define KEY_LEFT_GUI\t\t\t0xE3\n'
    + '#define KEY_ESC\t\t\t\t0x29\n'  
    + '#define KEY_TAB\t\t\t\t0x2B\n\n' 
    + 'void digiBegin() {\n'
    + '  DigiKeyboard.sendKeyStroke(0,0);\n'
    + '  DigiKeyboard.delay(50);\n'
    + '}\n\n'
    + 'void digiEnd() {\n'
    + '  const int led=1;\n'
    + '  pinMode(led, OUTPUT);\n'
    + '  while (1) {\n'
    + '    digitalWrite(led, !digitalRead(led));\n'
    + '    DigiKeyboard.delay(1000);\n'
    + '  }\n'
    + '}\n\n'
    + 'void printText(char *txt) {\n'
    + '  DigiKeyboard.print(txt);\n'
    + '  DigiKeyboard.update();\n' 
    + '}\n\n'
    + 'void setup() {\n'
    + '  digiBegin();\n\n'
    },
    EPILOG: function() {
      return '  digiEnd();\n\n'
    + '}\n'
    + '/* Unused endless loop */\n'
    + 'void loop() {}'
    },
    DELAY: function(time) {
      return  '  DigiKeyboard.delay('+ time + ');\n'
    },
    PARSE_STRING: function(str) {
      constOut = constOut + 'const char line' + strCount + '[] PROGMEM = "'+ str + '";\n'
      return '  // ' + str + '\n  printText(GetPsz(line' + strCount +'));\n'
    },
    KEY: function(key) {
      return '  DigiKeyboard.sendKeyStroke(\'' + keyMap[key] + '\');\n';
    },
    COMBOMAP: digisparkcomboMap,
    COMMANDMAP: digisparkcommandMap,
    KEYMAP: digisparkkeyMap,
    KEYSTROKES: function(modifiers, keys, commands) {
      key = (keys.length > 0 ? keys[0] : (commands.length > 0 ? commands[0] : 0));
      modifier = modifiers.join('|');
      keyparams = (modifier.length>0 ? key + ',' + modifier : key);
      if (modifiers.length>0) {
        return '  DigiKeyboard.sendKeyStroke(' + keyparams + ');\n';
      } else
        return '  DigiKeyboard.sendKeyStroke(' + key + ');\n';
      //return '  DigiKeyboard.sendKeyStroke('+ keyparams + ');\n  DigiKeyboard.update();\n';
    }
};

var devices = [
  {
    name: "Arduino",
    map:arduinoMap
  },
  {
    name: "Digispark",
    map: digisparkMap
  }];


class Dckuinojs {
  constructor() {
  }

  setBoard(board) {
    this.deviceMap = devices[board].map;
    this.keyMap = this.deviceMap['KEYMAP'];
    this.commandMap = this.deviceMap['COMMANDMAP'];
    this.comboMap = this.deviceMap['COMBOMAP'];
  }

  toArduino(inputCode, board)
  {
    this.setBoard(board)
    this.deviceMap['INIT']();

    // Check if the parameter is empty or undefined
    if (inputCode === '' || inputCode === undefined)
    {
      console.error('Error: No ducky script was entered !');
      return false;
    }  // Parsing

    var parsedDucky = this._parse(inputCode);
    if (parsedDucky === '' || parsedDucky === undefined)
    {
      return false;
    }  // Returning the total uploadable script

    return '/*\n'
    + ' * Generated with <3 by Dckuino.js, an open source project !\n'
    + ' */\n\n'
    + this.deviceMap['PROLOG']()
    + parsedDucky
    + this.deviceMap['EPILOG']();
  }

  // The parsing function
   _parse(toParse)
  {
    // Init chronometer
    var timerStart = Date.now();

    // Preset all used vars
    var parsedScript = '';
    var lastLines;
    var lastCount;
    var parsedOut = '';

    var commandKnown = false;
    var releaseAll = false;
    var noNewline = false;
    var noDelay = false;
    var nextNoDelay = false;

    var wordArray;
    var wordOne;

    // Init default delay
    var defaultDelay = 0;

    // Trim whitespaces
    toParse = toParse.replace(/^ +| +$/gm, '');

    // Remove all *ugly* tabs
    toParse = toParse.replace(/\t/g, '');

    // Cut the input in lines
    var lineArray = toParse.split('\n');

    // Loop every line
    for (var i = 0; i < lineArray.length; i++)
    {
      // Line empty, skip
      if (lineArray[i] === '' || lineArray[i] === '\n')
      {
        console.log('Info: Skipped line ' + (i + 1) + ', because was empty.');
        continue;
      }

      // Outputs, for REPLAY/REPEAT COMMANDS
      if (parsedOut !== undefined && parsedOut !== '')
      {
        lastLines = parsedOut;
        lastCount = ((lastLines.split('\n')).length + 1);
      }

      // Reset line buffer
      parsedOut = '';

      // Set to unknown command by default
      commandKnown = false;

      // releaseAll & noNewline & noDelay; *Line Modifiers*
      releaseAll = false;
      noNewline = false;
      noDelay = nextNoDelay;
      nextNoDelay = false;

      // Cut every line in words & store the first word in a var
      wordArray = lineArray[i].split(' ');
      wordOne = wordArray[0];

      // Parse commands
      switch(wordOne){
        case "STRING":
          wordArray.shift();

          var textString = wordArray.join(' ');
          parsedOut = '';

          // Create 256-byte chunks
          var chunks = textString.match(/[\s\S]{1,256}/g) || [];
          for (var chunk in chunks) {

            // Replace all '"' by '\"' and all '\' by '\\'
            textString = chunks[chunk].split('\\').join('\\\\').split('"').join('\\"');
            if (textString !== '')
            {
              strCount = strCount + 1
              parsedOut += this.deviceMap['PARSE_STRING'](textString); 
              commandKnown = true;
            } else {
              console.error('Error: at line: ' + (i + 1) + ', STRING needs a text');
              return;
            }
          }

          break;
        case "DELAY":
          wordArray.shift();

          if(wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', DELAY needs a time');
            return;
          }

          if (! isNaN(wordArray[0]))
          {
            parsedOut = this.deviceMap['DELAY'](wordArray[0]);
            commandKnown = true; noDelay = true; nextNoDelay = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', DELAY only acceptes numbers');
            return;
          }
          break;
        case "DEFAULT_DELAY":
        case "DEFAULTDELAY":
          wordArray.shift();

          if(wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', DEFAULT_DELAY needs a time');
            return;
          }

          if (! isNaN(wordArray[0]))
          {
            defaultDelay = wordArray[0];
            commandKnown = true; noNewline = true; noDelay = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', DEFAULT_DELAY only acceptes numbers');
            return;
          }
          break;
        case "TYPE":
          wordArray.shift();

          if(wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', TYPE needs a key');
            return;
          }

          if (this.keyMap[wordArray[0]] !== undefined)
          {
            commandKnown = true;
            // Replace the DuckyScript key by the Arduino key name
            parsedOut = this.deviceMap['KEY'](wordArray[0]);
          } else {
            console.error('Error: Unknown letter \'' + wordArray[0] +'\' at line: ' + (i + 1));
            return;
          }
          break;
        case "REM":
          wordArray.shift();

          // Placing the comment to arduino code
          if (wordArray.length > 0)
          {
            commandKnown = true; noDelay= true;
            parsedOut = '  // ' + wordArray.join(' ');
            if (i == (lineArray.length - 1))
              parsedOut += '\n';
          } else {
            commandKnown = true; noDelay= true;
            //console.error('Error: at line: ' + (i + 1) + ', REM needs a comment');
            parsedOut = '  //'
          }
          break;
        case "REPEAT":
        case "REPLAY":
          wordArray.shift();

          if (wordArray[0] === undefined || wordArray[0] === '') {
            console.error('Error: at line: ' + (i + 1) + ', REPEAT/REPLAY needs a loop count');
            return;
          }

          if (lastLines === undefined)
          {
            console.error('Error: at line: ' + (i + 1) + ', nothing to repeat, this is the first line.');
            return;
          }

          if (! isNaN(wordArray[0]))
          {
            // Remove the lines we just created
            var linesTmp = parsedScript.split('\n');
            linesTmp.splice(-lastCount, lastCount);

            if (linesTmp.join('\n') === '')
              parsedScript = linesTmp.join('\n');
            else {
              parsedScript = linesTmp.join('\n') + '\n';
            }

            // Add two spaces at Begining
            lastLines = lastLines.replace(/^  /gm,'    ');

            // Replace them
            parsedOut = '  for(int i = 0; i < ' + wordArray[0] + '; i++) {\n';
            parsedOut += lastLines;
            parsedOut += '  }\n';

            commandKnown = true; noDelay = true;
          } else {
            console.error('Error: at line: ' + (i + 1) + ', REPEAT/REPLAY only acceptes numbers');
            return;
          }
          break;
        default:
          var modifiers = [];
          var keys = [];
          var commands = [];

          if (wordArray.length == 1)
          {

            if (this.commandMap[wordArray[0]] !== undefined) {
              commandKnown = true;
              commands = [this.commandMap[wordArray[0]]]
            }else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }

          while (wordArray.length){
            if (this.comboMap[wordArray[0]] !== undefined)
            {
              modifiers = modifiers.concat(this.comboMap[wordArray[0]]);
              commandKnown = true;
              releaseAll = true;

            }else if (this.commandMap[wordArray[0]] !== undefined) {
              commands = commands.concat(this.commandMap[wordArray[0]]);
              commandKnown = true;
              releaseAll = true;

            }else if (this.keyMap[wordArray[0]] !== undefined) {
              keys = keys.concat(this.keyMap[wordArray[0]]);
              commandKnown = true;
              releaseAll = true;

            }else {
              commandKnown = false;
              break;
            }
            wordArray.shift();
          }
          parsedOut = this.deviceMap['KEYSTROKES'](modifiers, keys, commands);
      }

      if (!commandKnown)
      {
        console.error('Error: Unknown command or key \'' + wordArray[0] + '\' at line: ' + (i + 1) + '.');
        return;
      }

      // If there is a default delay add it
      if (defaultDelay > 0 && !noDelay)
        parsedOut = this.deviceMap['DELAY'](defaultDelay) + parsedOut;

      parsedScript += parsedOut; // Add what we parsed

      if (!noNewline)
        parsedScript += '\n'; // Add new line
    }

    var timerEnd = Date.now();
    var timePassed = new Date(timerEnd - timerStart);

    console.log('Done parsed ' + (lineArray.length) + ' lines in ' + timePassed.getMilliseconds() + 'ms');
    return parsedScript;
  }
}
