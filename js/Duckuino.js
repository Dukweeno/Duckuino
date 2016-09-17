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

  parser(code){
    var parsed = '';

    // Remove unnecessary empty lines
    code = code.replace(/[\n]{2,}/g, '\n');

    // Split the DuckyScript into lines
    var lines = code.split('\n');

    // Indicate to release all at the of line
    var releaseAll = false;
    var countRepeats = 1;
    for (var i = 0; i < lines.length; i++) {

      var line = lines[i];

      releaseAll = false;
      parsed += '\n';

      // Split line to words
      var words = line.split(' ');

      // Parse special commands
      if(words[0]== "STRING"){
        words.shift();

        if (words[0] != undefined && words[0] != '')
        {
          var string = '';
          while (words.length) {
            string += ' ' + words[0];
            words.shift();
          }

          // Replace all " with \" and all \ with \\
          string = string.replace(/\\/g, '\\\\');
          string = string.replace(/"/g, '\\"');

          parsed += '  Keyboard.print(\'' + string + '\');';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', STRING requires a text')
          return;
        }

      // Command: DELAY
      } else if(words[0] == "DELAY"){
        words.shift();
        if (words[0] != undefined && words[0] != ''){
          parsed += '  delay(' + words[0] + ');\n';
        } else {
          console.error('Error: at line: ' + (i + 1) + ', DELAY requires a number (e.g. DELAY 1000)')
          return;
        }

        continue;

      // Command: GUI/CONTROL/CTRL/COMMAND/WINDOWS/SHIFT/ALT
      } else if(words[0] == "GUI" || words[0] == "WINDOWS" || words[0] == "CTRL" || words[0] == "COMMAND" || words[0] == "ALT" || words[0] == "SHIFT"){
        //var keep = words[0];
        //keep = this.commandMap[keep];
        //words.shift();
        var press = '';
        var release = '';

        while (words.length){
          var key = words[0];
          if(this.keyMap[key] != undefined){
            key = this.keyMap[key];
          } else if(this.commandMap[key] != undefined){
            key = this.commandMap[key];
          }
          if (words.length > 1){
            press +=  '    Keyboard.press(\'' + key + '\');\n';
            release +=  '    Keyboard.release(\'' + key + ');\n';
          } else {
            press +=  '    Keyboard.press(\'' + key + '\');\n';
            release +=  '    Keyboard.release(\'' + key + '\');\n';
          }
          words.shift();
        }
        parsed += '  '+press+'delay(50);\n  '+release;

        // Clear other arguments
        continue;

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

        continue;

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

          parsed += remTmp;
        } else {
          console.error('Error: at line: ' + (i + 1) + ', REM requires a comment')
          return;
        }

      // Command: MOUSEMOVE
      } else if(words[0] == "MOUSEMOVE"){
        words.shift();

        if (words[0] != undefined && words[0] != ''){
          var mouseParams = words[0].split(',');

          parsed += '  Mouse.move('+mouseParams[0]+', '+mouseParams[1];

          if(mouseParams[2] != undefined && mouseParams[2] != ''){
            parsed += ', '+mouseParams[2];
          }

          parsed += ');';
          words.shift();
        } else {
          console.error('Error: at line: ' + (i + 1) + ', MOUSEMOVE requires at least two parameters')
          return;
        }

      // Command: MOUSECLICK
      } else if(words[0] == "MOUSECLICK"){
        words.shift();
        words[0] = words[0].toUpperCase();

        if (words[0] == 'LEFT' || words[0] == 'RIGHT' || words[0] == 'MIDDLE' && words[0] != undefined && words[0] != ''){
          parsed += '  Mouse.click(\'MOUSE_'+words[0]+'\');'
          words.shift();
        } else {
          console.error('Error: at line: ' + (i + 1) + ', MOUSECLICK requires key (left/middle/right)')
          return;
        }

      // Command: REPEAT / REPLAY
      } else if(words[0] == "REPEAT" || words[0] == "REPLAY" ){
        words.shift();

        if (words[0] != undefined && words[0] != ''){
          // Get the code to repeat/replay
          var lines = code.split('\n');
          var lastLine = lines.length-2;
          lastLine = lines[lastLine];

          // Get rid of last parsed line
          var parsedLines = parsed.split('\n');
          var lastParsed = parsedLines.length-2;
          parsedLines[lastParsed] = '';

          parsed = parsedLines.join('\n');
          var replay = '\n  for (int rID_'+countRepeats+' = 0; rID_'+countRepeats+' < '+words[0]+'; rID_'+countRepeats+'++) {';
          replay += this.parser(lastLine);
          replay += '\n  };\n';
          parsed += replay;

          countRepeats++;
          words.shift();

        } else {
          console.error('Error: at line: ' + (i + 1) + ', REPLAY/REPEAT requires a number')
          return;
        }

      // Everything else
      } else {
        while (words.length){
          var key = words[0];

          if(this.keyMap[key] != undefined){
            key = this.keyMap[key];
            parsed += '  Keyboard.press(\' '+ key +' \');\n    delay(50);\n  Keyboard.release(\'' + key + '\');\n';
          } else if(this.commandMap[key] != undefined){
            if (words.length == 1 && !releaseAll){
              parsed += '  typeKey(' + this.commandMap[key] + ');\n';
            } else {
              parsed += '  Keyboard.press(\'' + this.commandMap[key] + '\');\n  delay(50);\n  Keyboard.release(\'' + this.commandMap[key] + '\');\n';
            }
          }

          words.shift();
        }
      }
    }
    parsed = parsed.replace(/[\n]{2,}/g, '\n\n');
    return parsed;
  }

  compile(code){
    // Build the Arduino code skeleton
    return '// Init function\n'
    + 'void setup()\n'
    + '{\n'
    + '  // Start payload\n'
    + '  Mouse.begin();\n'
    + '  Keyboard.begin();\n\n'
    + '  // Wait 500ms\n'
    + '  delay(500);\n'
    + this.parser(code)
    + '\n'
    + '  // End payload\n'
    + '  Keyboard.end();\n'
    + '  Mouse.end();\n'
    + '}\n'
    + '\n'
    + '// Unused\n'
    + 'void loop() {}';
  }
}
