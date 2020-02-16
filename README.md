# rpi-keypad
a simple matrix keypad library for the raspberry pi

## installation
```
npm i rpi-keypad
```

## sample usage
typescript usage
```typescript
import Keypad from "rpi-keypad";
```
javascript usage
```javascript
var Keypad = require("rpi-keypad");

var input = new Keypad(
    [
        ["1", "2", "3", "A"],
        ["4", "5", "6", "B"],
        ["7", "8", "9", "C"],
        ["*", "0", "#", "D"],
    ],
    [40, 38, 36, 32],
    [37, 35, 33, 31]
);
    
setInterval(() => {
    var key = keypad.getKey();
    if (key != null){
        console.log("key pressed: " + key);
    } else {
        console.log("no key pressed");
    }
}, 100);
```
