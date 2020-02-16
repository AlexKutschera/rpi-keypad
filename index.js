"use strict";
exports.__esModule = true;
var rpio_1 = require("rpio");
var Keypad = /** @class */ (function () {
    /***
     * initializes keypad
     * @param keys - matrix of keys on keypad
     * @param rows - array of row GPIO pins
     * @param cols - array of column GPIO pins
     */
    function Keypad(keys, rows, cols) {
        this.keys = keys;
        this.rows = rows;
        this.cols = cols;
    }
    /**
     * get currently pressed key
     * @param checkLast - check whether the pressed key at last call was the same or different as current
     */
    Keypad.prototype.getKey = function (checkLast) {
        if (checkLast === void 0) { checkLast = true; }
        this.cols.forEach(function (value) {
            rpio_1.open(value, rpio_1.OUTPUT, rpio_1.LOW);
        });
        this.rows.forEach(function (value) {
            rpio_1.open(value, rpio_1.INPUT, rpio_1.PULL_UP);
        });
        var rowValue = -1;
        this.rows.forEach(function (value, index) {
            var tempRead = rpio_1.read(value);
            if (tempRead == 0)
                rowValue = index;
        });
        if (rowValue < 0 || rowValue >= this.rows.length) {
            this.exit();
            this.lastKey = null;
            return null;
        }
        this.cols.forEach(function (value) {
            rpio_1.open(value, rpio_1.INPUT, rpio_1.PULL_DOWN);
        });
        rpio_1.open(this.rows[rowValue], rpio_1.OUTPUT, rpio_1.HIGH);
        var colValue = -1;
        this.cols.forEach(function (value, index) {
            var tempRead = rpio_1.read(value);
            if (tempRead == 1)
                colValue = index;
        });
        if (colValue < 0 || colValue >= this.cols.length) {
            this.exit();
            this.lastKey = null;
            return null;
        }
        this.exit();
        if (checkLast && this.lastKey == this.keys[rowValue][colValue])
            return null;
        this.lastKey = this.keys[rowValue][colValue];
        return this.keys[rowValue][colValue];
    };
    Keypad.prototype.exit = function () {
        this.rows.forEach(function (value) {
            rpio_1.close(value);
        });
        this.cols.forEach(function (value) {
            rpio_1.close(value);
        });
    };
    return Keypad;
}());
exports["default"] = Keypad;
