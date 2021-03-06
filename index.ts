import {open, close, read, INPUT, OUTPUT, LOW, HIGH, PULL_UP, PULL_DOWN} from "rpio";
import {EventEmitter} from "events";

export default class Keypad extends EventEmitter {

    private keys: string[][];
    private rows: number[];
    private cols: number[];
    private lastKey: string;
    private pullInterval: any = null;

    /***
     * initializes keypad
     * @param keys - matrix of keys on keypad
     * @param rows - array of row GPIO pins
     * @param cols - array of column GPIO pins
     * @param enableEvents - automatic polling handled by Keypad class, use
     * @param pullRate - to set polling interval
     */
    constructor(keys: string[][], rows: number[], cols: number[], enableEvents: boolean = false, pullRate: number = 100) {
        super();
        this.keys = keys;
        this.rows = rows;
        this.cols = cols;
        this.enableEvents(enableEvents, pullRate);
    }

    /**
     * get currently pressed key
     * @param checkLast - check whether the pressed key at last call was the same or different as current
     */
    getKey(checkLast: boolean = true): null | string {
        this.cols.forEach(value => {
            open(value, OUTPUT, LOW);
        });
        this.rows.forEach(value => {
            open(value, INPUT, PULL_UP);
        });

        let rowValue = -1;
        this.rows.forEach((value, index) => {
            let tempRead = read(value);
            if (tempRead == 0) rowValue = index;
        });
        if (rowValue < 0 || rowValue >= this.rows.length) {
            this.exit();
            this.lastKey = null;
            return null;
        }

        this.cols.forEach(value => {
            open(value, INPUT, PULL_DOWN);
        });
        open(this.rows[rowValue], OUTPUT, HIGH);

        let colValue = -1;
        this.cols.forEach((value, index) => {
            let tempRead = read(value);
            if (tempRead == 1) colValue = index;
        });

        if (colValue < 0 || colValue >= this.cols.length) {
            this.exit();
            this.lastKey = null;
            return null;
        }

        this.exit();
        if (checkLast && this.lastKey == this.keys[rowValue][colValue]) return null;
        this.lastKey = this.keys[rowValue][colValue];
        return this.keys[rowValue][colValue];
    }

    enableEvents(enable: boolean, pullRate: number = 100) {
        if (this.pullInterval !== null) {
            clearInterval(this.pullInterval);
            this.pullInterval = null;
        }
        if (enable) {
            this.pullInterval = setInterval(() => {
                let actualKey = this.getKey();
                if (actualKey !== null) {
                    this.emit("keypress", actualKey);
                }
            }, pullRate);
        }
    }

    private exit() {
        this.rows.forEach(value => {
            close(value);
        });
        this.cols.forEach(value => {
            close(value);
        });
    }

}