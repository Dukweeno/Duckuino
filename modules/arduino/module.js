/* jshint laxbreak: true */

new Object({
  functionMap: { /* Functions */
    REM: function(argList, µ) {
      argList.shift();

      µ.setData('nodelay', true);
      return '  // ' + argList.join(' ') + '\n';
    },

    TYPE: function(argList, µ) {
      argList.shift();

      if(argList.length < 1) {
        µ.throwError("No argument provided for TYPE");
        return;
      }

      if(µ.keyMap[argList[0]] !== undefined) {
        return '  typeKey(\'' + µ.keyMap[argList[0]] + '\');\n\n';
      } else {
        µ.throwError("Unknown command or key: '" + argList[0] + "'");
        return;
      }
    },

    STRING: function(argList, µ) {
      argList.shift();

      if(argList.length < 1) {
        µ.throwError("No argument provided for STRING");
        return;
      }

      var textString = argList.join(' ');

      // Replace all '"' by '\"' and all '\' by '\\'
      textString = textString.split('\\').join('\\\\').split('"').join('\\"');

      if(textString !== '') {
        return '  Keyboard.print(F("' + textString + '"));\n\n';
      }
    },

    DELAY: function(argList, µ) {
      argList.shift();

      if(argList.length < 1) {
        µ.throwError("No argument provided for DELAY");
        return;
      }

      if(!isNaN(argList[0])) {
        µ.setData('nodelay', true);

        return '  delay(' + argList[0] + ');\n';
      } else {
        µ.throwError("Invalid argument, DELAY only acceptes numbers");
        return;
      }
    },

    DEFAULTDELAY: function(argList, µ) { // Not working .-.
      argList.shift();

      if(argList.length < 1) {
        µ.throwError("No argument provided for DEFAULTDELAY");
        return;
      }

      if(!isNaN(argList[0])) {
        µ.setData('defaultdelay', argList[0]);
        µ.setData('nodelay', true);

        return '';
      } else {
        µ.throwError("Invalid argument, DEFAULTDELAY only acceptes numbers");
        return;
      }
    },
    DEFAULT_DELAY: function() {return this.DEFAULTDELAY.apply(this, [].slice.call(arguments));},

    REPEAT: function(argList, µ) {
      argList.shift();

      if(argList.length < 1) {
        µ.throwError("No argument provided for REPLAY");
        return;
      }

      var lastOutput = µ.trimLast();
      if(lastOutput === '') {
        throwError("Nothing to REPLAY, this is the first line");
        return;
      }

      lastOutput = '  ' + lastOutput.trim() + '\n';
      lastOutput = lastOutput.replace(/^  /gm,'    ');

      if(!isNaN(argList[0])) {
        µ.setData('nodelay', true);

        return '  for(int i = 0; i < ' + argList[0] + '; i++) {\n' + lastOutput + '  }\n\n';
      } else {
        µ.throwError("Invalid argument, REPLAY only acceptes numbers");
        return;
      }
    },
    REPLAY: function() {return this.REPEAT.apply(this, [].slice.call(arguments));}
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
    a:'\'a\'',
    b:'\'b\'',
    c:'\'c\'',
    d:'\'d\'',
    e:'\'e\'',
    f:'\'f\'',
    g:'\'g\'',
    h:'\'h\'',
    i:'\'i\'',
    j:'\'j\'',
    k:'\'k\'',
    l:'\'l\'',
    m:'\'m\'',
    n:'\'n\'',
    o:'\'o\'',
    p:'\'p\'',
    q:'\'q\'',
    r:'\'r\'',
    s:'\'s\'',
    t:'\'t\'',
    u:'\'u\'',
    v:'\'v\'',
    w:'\'w\'',
    x:'\'x\'',
    y:'\'y\'',
    z:'\'z\''
  },

  postLine: function(lineStr, µ) {
    var processedLine = lineStr;

    /* If the defaultdelay has been set, push delay to the line start */
    if(µ.getData('defaultdelay') !== undefined && µ.getData('nodelay') == false)
      processedLine = '  delay(' + µ.getData('defaultdelay') + ');\n' + processedLine;

    /* Reset the nodelay statement */
    µ.setData('nodelay', false);

    return processedLine;
  },

  computeKeys: function(keyArray) { /* Function who returns the code for keys combos */
    var toReturn = '';
    if(keyArray.length == 1) {
      toReturn = '  typeKey(' + keyArray[0] + ');\n\n';
    } else {
      for(var i = 0; i < keyArray.length; i++) {
        toReturn += '  Keyboard.press(' + keyArray[i] + ');\n';
      }

      toReturn += '  Keyboard.releaseAll();\n\n';
    }

    return toReturn;
  },

  getFinalCode: function(code) { /* Function who returns the usable code */
    return '/**\n'
    + ' * Made with Duckuino, an open-source project.\n'
    + ' * Check the license at \'https://github.com/Dukweeno/Duckuino/blob/master/LICENSE\'\n'
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
    + '\n'
    + code
    + '  // Ending stream\n'
    + '  Keyboard.end();\n'
    + '}\n\n'
    + '/* Unused endless loop */\n'
    + 'void loop() {}';
  }
});
