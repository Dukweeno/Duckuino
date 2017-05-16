/* jshint laxbreak: true */

new Object({
  moduleMeta: { /* Module infos */
    displayName: 'Arduino',
    version: 1.0,
    author: 'Nurrl'
  },

  functionMap: { /* Functions */
    REM: function(argArray) {
      argArray.shift();

      return '  // ' + argArray.join(' ') + '\n';
    },

    STRING: function(argArray, throwError) {
      argArray.shift();

      if(!argArray.length) {
        throwError("No argument provided for STRING");
        return;
      }

      var textString = argArray.join(' ');

      // Replace all '"' by '\"' and all '\' by '\\'
      textString = textString.split('\\').join('\\\\').split('"').join('\\"');

      if(textString !== '')
        return '  Keyboard.print("' + textString + '");\n';
    },

    DELAY: function(argArray, throwError, getThis) {
      argArray.shift();

      if(!argArray.length) {
        throwError("No argument provided for DELAY");
        return;
      }

      if(!isNaN(argArray[0]))
        return '  delay(' + argArray[0] + ');';
      else
        throwError("Invalid argument, DELAY only acceptes numbers");
    },

    DEFAULTDELAY: function(argArray, throwError, getThis) { // Not working .-.
      argArray.shift();

      if(!argArray.length) {
        throwError("No argument provided for DEFAULTDELAY");
        return;
      }

      if(!isNaN(argArray[0])) {
        // Need to fix DEFAULTDELAY
        return '';
      }
      else
        throwError("Invalid argument, DEFAULTDELAY only acceptes numbers");
    },

    REPLAY: function(argArray, throwError, getThis, trimBack) {
      argArray.shift();

      if(!argArray.length) {
        throwError("No argument provided for REPLAY");
        return;
      }

      var lastOutput = '  ' + trimBack().trim() + '\n';
      lastOutput = lastOutput.replace(/^  /gm,'    ');

      if(!isNaN(argArray[0]))
        return '  for(int i = 0; i < ' + argArray[0] + '; i++) {\n' + lastOutput + '  }\n';
      else
        throwError("Invalid argument, REPLAY only acceptes numbers");
    }
  },

  commandMap: { /* Key that can be typed */
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
  },

  comboMap: { /* Key that can only be used in combos */
    ALT:'KEY_LEFT_ALT',
    SHIFT:'KEY_LEFT_SHIFT',
    CTRL:'KEY_LEFT_CTRL',
    CONTROL:'KEY_LEFT_CTRL'
  },

  keyMap: { /* Normal keys */
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
  },

  computeKeys: function(keyArray) { /* Function who returns the code for keys combos */
    var toReturn = '';
    if(keyArray.length == 1) {
      toReturn = '  typeKey(' + keyArray[0] + ');\n';
    } else {
      for(var i = 0; i < keyArray.length; i++) {
        toReturn += '  Keyboard.press(' + keyArray[i] + ');\n';
      }

      toReturn += '  Keyboard.releaseAll();\n';
    }

    return toReturn;
  },

  getFinalCode: function(compiledCode) { /* Function who returns the usable code */
    return '/*\n'
    + ' * Generated with <3 by Duckuino, an open source project !\n'
    + ' */\n\n'
    + '#include "Keyboard.h"\n\n'
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
    + '  delay(500);\n'
    + compiledCode
    + '  // Ending stream\n'
    + '  Keyboard.end();\n'
    + '}\n\n'
    + '/* Unused endless loop */\n'
    + 'void loop() {}';
  }
});
