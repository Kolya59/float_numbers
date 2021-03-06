"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var Elem = /** @class */ (function () {
    function Elem(val, changed) {
        this._val = val;
        this._changed = changed;
    }
    Object.defineProperty(Elem.prototype, "val", {
        get: function () {
            return this._val;
        },
        set: function (n) {
            this._val = n;
            this._changed = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Elem.prototype, "changed", {
        get: function () {
            return this._changed;
        },
        enumerable: true,
        configurable: true
    });
    Elem.isEqual = function (x, y) {
        return x.val == y.val;
    };
    return Elem;
}());
function mergeNumbers(x, y, l) {
    switch (true) {
        case Math.abs(y.val - x.val) > 2 * l:
            break;
        case Math.abs(y.val - x.val) <= l:
            if (x.changed) {
                y.val = x.val;
            }
            else {
                x.val = y.val;
            }
            break;
        default:
            if (!x.changed) {
                x.val += l;
                y.val = x.val;
            }
    }
    return [x, y];
}
// Parse input.txt data
var content = fs_1.default.readFileSync('../input.txt', 'utf-8').split("\n");
var header = content[0].split(' ');
var l = parseInt(header[0]);
var n = parseInt(header[1]);
var items = [];
// Convert number frequency to Elem frequency
rxjs_1.from(content[1].split(' ')).pipe(operators_1.map(function (item) { return parseInt(item); })).subscribe(function (next) {
    items.push(new Elem(next, false));
});
// Sort frequency
items.sort(function (x, y) { return +(x.val > y.val); });
// Merge items
for (var i = 1; i < n; i++) {
    var res = mergeNumbers(items[i - 1], items[i], l);
    items[i - 1] = res[0];
    items[i] = res[1];
}
// Count distinct items
var result = 1;
for (var i = 1; i < n; i++) {
    if (!Elem.isEqual(items[i], items[i - 1])) {
        result++;
    }
}
console.log(items);
console.log(result);
// Write results
fs_1.default.writeFileSync('../output.txt', JSON.stringify(result));
