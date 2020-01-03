import fs from 'fs';
import { from } from 'rxjs'
import { map } from 'rxjs/operators';

class Elem {
  private _val: number;
  private _changed: boolean;

  public get val(): number {
    return this._val;
  }

  public set val(n: number) {
    this._val = n;
    this._changed = true
  }

  public get changed(): boolean {
    return this._changed
  }

  constructor(val: number, changed: boolean) {
    this._val = val;
    this._changed = changed;
  }

  static isEqual(x: Elem, y: Elem): boolean {
    return x.val == y.val
  }
}

function mergeNumbers(x: Elem, y: Elem, l: number, fr: Map<number, number>): Elem[] {
  const xFr: number = fr.get(x.val) || 0;
  const yFr: number = fr.get(y.val) || 0;
  console.log(x, y, fr.get(x.val), fr.get(y.val));
  switch (true) {
    case Math.abs(y.val - x.val) > 2 * l:
      break;
    case Math.abs(y.val - x.val) <= l:
      if (x.changed && xFr > yFr) {
        fr.set(x.val, xFr + 1);
        fr.set(y.val, yFr - 1);
        y.val = x.val;
        break
      }
      if (yFr >= xFr) {
        fr.set(x.val, xFr - 1);
        fr.set(y.val, yFr + 1);
        x.val = y.val;
      } else {
        fr.set(x.val, xFr + 1);
        fr.set(y.val, yFr - 1);
        y.val = x.val;
      }
      break;
    default:
      if (!x.changed) {
        fr.set(x.val, xFr - 1);
        fr.set(y.val, yFr - 1);
        x.val += l;
        y.val = x.val;
        fr.set(x.val, fr.get(x.val) as number + 1)
      }
  }
  return [x, y]
}

// Parse input.txt data
let content = fs.readFileSync('./input.txt', 'utf-8').split("\n");
let header = content[0].split(' ');
let l = parseInt(header[0]);
let n = parseInt(header[1]);
let items: Elem[] = [];
let freq: Map<number, number> = new Map();

// Convert number frequency to Elem frequency
from(content[1].split(' ')).pipe(
  map((item: string) => parseInt(item))
).subscribe((next) => {
  items.push(new Elem(next, false));
  freq.set(next, (freq.get(next) as number || 0) + 1)
});

// Sort frequency
items.sort((x: Elem, y: Elem) => +(x.val > y.val));

// Merge items
for (let i = 1; i < n; i++) {
  const res = mergeNumbers(items[i - 1], items[i], l, freq);
  items[i-1] = res[0];
  items[i] = res[1];
}

// Count distinct items
let result: number = 1;
for (let i = 1; i < n; i++) {
  if (!Elem.isEqual(items[i], items[i - 1])) {
    result++;
  }
}
console.log(items);
console.log(result);
console.log(freq);
// Write results
fs.writeFileSync('./output.txt', JSON.stringify(result));
