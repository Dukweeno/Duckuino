# Duckuino [![release](https://img.shields.io/github/release/Nurrl/Duckuino/all.svg)](https://github.com/Nurrl/Duckuino/releases) [![GitHub issues](https://img.shields.io/github/issues/Nurrl/Duckuino.svg)](https://github.com/Nurrl/Duckuino/issues)
Simple **DuckyScript** to **Arduino** converter.

If you need to perform mouse emulation then use [d4n5h's Duckuino](https://github.com/d4n5h/Duckuino).

*NOTE: If you are on linux, you might use the Arduino IDE from the website, not from apt, because the apt repo is not up to date.*

### Warning: Release note
This release is an unstable version, for now some things may or may not work, please [*open an issue*](https://github.com/Nurrl/Duckuino/issues/new) if you find a bug.

*The stable version will be released in few days, maybe :D*
## Live version:
https://nurrl.github.io/Duckuino/

## Why Duckuino ?
You can compile **Duckyscript** to **Arduino** code directly through the [live](https://nurrl.github.io/Duckuino/ "Duckuino Live") version, or reuse `Duckuino.js` for standalone use :
```javascript
let Duck = new Duckuino();
let mods = new Modules().list;

let output = Duck.compileCode("STRING This is a test string !", mods[0].module);
/*   ^- Here will be the final compiled code                         |
**        and errors if applicable.                                  |
**                                      Here is the selected module -/
**
** Note: You can iterate through the list and find the desired one,
** by default, `0` will be the first module.
*/
```
# Members
  - [Plazmaz](https://github.com/Plazmaz)
  - [Nurrl](https://github.com/Nurrl)
