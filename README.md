#DuckuinoPlus
Simple DuckyScript to Arduino converter, improved version of https://github.com/Plazmaz/Duckuino

# Why DuckuinoPlus
You can use the entire project in the [Live](https://thecakeisgit.github.io/DuckuinoPlus/ "DuckuinoPlus Live") version, or reuse <code>js/duckuinoPlus.js</code> for standalone use :

```javascript
// Create the instance
Duck = new Duckuino();

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

```C
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
https://thecakeisgit.github.io/DuckuinoPlus/
