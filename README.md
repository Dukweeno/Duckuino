#Duckuino
Simple DuckyScript -> Arduino converter/compiler, Props to Thecakeisgit/DuckuinoPlus for the original compiler.

The original Rubber Ducky cannot perform Mouse control, But the Duckuino sure can (Well.. at least only this compiler).

Live version here: https://d4n5h.github.io/Duckuino/



# Added functionality
1. Added support for: REM,ESCAPE and REPLAY/REPEAT.
2. Added support for mouse movements and clicks ("MOUSEMOVE xPos,yPos,wheelPos" | "MOUSECLICK left/right/middle").
3. Fixed empty lines bug.
4. Rearranged the code and files.
5. Added simple Bootstrap CDN UI.
6. Switched to associative arrays/objects to reduce the use of For loops.
7. Added functionality for key combos.
8. Removed console.error for comands (i'll try to reimplement it back again).
