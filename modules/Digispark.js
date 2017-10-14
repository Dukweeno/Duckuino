/* jshint laxbreak: true */

new Object({
  moduleMeta: { /* Module infos */
    displayName: 'Digispark',
    version: 1.0,
    author: '@alcyonsecurity / NIXU'
  },

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
        return '  printText(F("' + textString + '"));\n\n';
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

        return '  DigiKeyboard.delay(' + argList[0] + ');\n';
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
    SPACE:'KEY_SPACE',
    TAB:'KEY_TAB',
    PRINTSCREEN:'206',
    ENTER:'KEY_ENTER',
    RETURN:'KEY_ENTER',
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
    ALT:'MOD_ALT_LEFT',
    SHIFT:'MOD_SHIFT_LEFT',
    CTRL:'MOD_CONTROL_LEFT',
    CONTROL:'MOD_CONTROL_LEFT',
    GUI:'MOD_GUI_LEFT',
    WINDOWS:'MOD_GUI_LEFT',
  },

  keyMap: { /* Normal keys */
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

    var keys = [];

    // Get rid of the double quotes that the main module adds for normal keys
    for(var i = 0; i < keyArray.length; i++) {
      keys.push(keyArray[i].replace(/"/g,''));
    }

    return '  DigiKeyboard.sendKeyStroke('  + keys.join('|') + ');\n';
  },

  getFinalCode: function(compiledCode) { /* Function who returns the usable code */

    return '#include "DigiKeyboard.h"\n'
    + '#define KEY_UP_ARROW     0x52\n'
    + '#define KEY_DOWN_ARROW   0x51\n'
    + '#define KEY_LEFT_ARROW   0x50\n'
    + '#define KEY_RIGHT_ARROW  0x4F\n'
    + '#define KEY_LEFT_GUI     0xE3\n'
    + '#define KEY_ESC          0x29\n'  
    + '#define KEY_TAB          0x2B\n\n' 
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
    + 'void printText(fstr_t *txt) {\n'
    + '  DigiKeyboard.print(txt);\n'
    + '  DigiKeyboard.update();\n' 
    + '}\n\n'
    + 'void setup() {\n'
    + '  digiBegin();\n\n'
    + compiledCode
    + '  digiEnd();\n\n'
    + '}\n\n'
    + '/* Unused endless loop */\n'
    + 'void loop() {}';
  }
});
