"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var rpio_1 = require("rpio");
var events_1 = require("events");
var Keypad = /** @class */ (function (_super) {
    __extends(Keypad, _super);
    /***
     * initializes keypad
     * @param keys - matrix of keys on keypad
     * @param rows - array of row GPIO pins
     * @param cols - array of column GPIO pins
     * @param enableEvents - automatic polling handled by Keypad class, use
     * @param pullRate - to set polling interval
     */
    function Keypad(keys, rows, cols, enableEvents, pullRate) {
        if (enableEvents === void 0) { enableEvents = false; }
        if (pullRate === void 0) { pullRate = 100; }
        var _this = _super.call(this) || this;
        _this.pullInterval = null;
        _this.keys = keys;
        _this.rows = rows;
        _this.cols = cols;
        _this.enableEvents(enableEvents, pullRate);
        return _this;
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
    Keypad.prototype.enableEvents = function (enable, pullRate) {
        var _this = this;
        if (pullRate === void 0) { pullRate = 100; }
        if (this.pullInterval !== null) {
            clearInterval(this.pullInterval);
            this.pullInterval = null;
        }
        if (enable) {
            this.pullInterval = setInterval(function () {
                var actualKey = _this.getKey();
                if (actualKey !== null) {
                    _this.emit("keypress", actualKey);
                }
            }, pullRate);
        }
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
}(events_1.EventEmitter));
exports.default = Keypad;
