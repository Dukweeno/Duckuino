#Dckuino.js
Simple DuckyScript to Arduino converter, improved version of https://github.com/Plazmaz/Duckuino

*NOTE: If you are on linux, you might use the Arduino IDE from the website, not from apt, because the apt repo is not up to date.*

# Why Dckuino.js
You can use the entire project in the [Live](https://thecakeisgit.github.io/Dckuino.js/ "Dckuino.js Live") version, or reuse <code>dckuino.js</code> for standalone use :

```javascript
// Create the instance
Duck = new Dckuinojs();

var DuckyScript = "CTRL ALT t"
+ "DELAY 1000"
+ "STRING gedit"
+ "ENTER"
+ "DELAY 1000"
+ "STRING Hello World !"

var ArduinoCode = Duck.toArduino(DuckyScript);

console.log(ArduinoCode);
```
Output:

```c
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
}

void typeKey(int key)
{
  Keyboard.press(key);
  delay(50);
  Keyboard.release(key);
}

// Unused
void loop() {}
```

# Live version:
https://thecakeisgit.github.io/Dckuino.js/
