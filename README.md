#DuckuinoPlus
Simple DuckyScript to Arduino converter, improved version of https://github.com/Plazmaz/Duckuino

# Why DuckuinoPlus
You can use the entire project in the [Live](https://thecakeisgit.github.io/DuckuinoPlus/ "DuckuinoPlus Live") version, or reuse <code>js/duckuinoPlus.js</code> for standalone use :
<code>
// Create the instance
Duck = new Duckuino();

var DuckyScript = "CTRL ALT t"
+ "DELAY 1000"
+ "STRING gedit"
+ "ENTER"
+ "DELAY 1000"
+ "STRING Hello World !"

var ArduinoCode = Duck.toArduino(DuckyScript); 
</code>

# Live version:
https://thecakeisgit.github.io/DuckuinoPlus/
