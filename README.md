# Duckuino
Simple DuckyScript to Arduino converter.

If you need to perform mouse emulation then use [d4n5h's Duckuino](https://github.com/d4n5h/Duckuino).

*NOTE: If you are on linux, you might use the Arduino IDE from the website, not from apt, because the apt repo is not up to date.*

# Live version:
https://nurrl.github.io/Duckuino/

# Why Duckuino ?
You can compile duckyscript to arduino code directly through the [live](https://nurrl.github.io/Duckuino/ "Duckuino Live") version, or reuse <code>Dckuino.js</code> for standalone use :
```javascript
// Create the instance
Duck = new Dckuinojs();

var DuckyScript = "CTRL ALT t\n"
+ "DELAY 1000\n"
+ "STRING gedit\n"
+ "ENTER\n"
+ "DELAY 1000\n"
+ "STRING Hello World !"

var ArduinoCode = Duck.toArduino(DuckyScript);

console.log(ArduinoCode);
```
Output:

```c
/*
 * Generated with <3 by Dckuino.js, an open source project !
 */

#include <Keyboard.h>

void typeKey(int key)
{
  Keyboard.press(key);
  delay(50);
  Keyboard.release(key);
}

// Init function
void setup()
{
  // Begining the stream
  Keyboard.begin();

  // Waiting 500ms for init
  delay(500);

  Keyboard.press(KEY_LEFT_CTRL);
  Keyboard.press(KEY_LEFT_ALT);
  Keyboard.press(116);
  Keyboard.releaseAll();

  delay(1000);

  Keyboard.print("gedit");

  typeKey(KEY_RETURN);

  delay(1000);

  Keyboard.print("Hello World !");
  // Ending stream
  Keyboard.end();
}

// Unused
void loop() {}
```
# Members
  - [Plazmaz](https://github.com/Plazmaz)
  - [Nurrl](https://github.com/Nurrl)

