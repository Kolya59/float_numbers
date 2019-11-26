import express from 'express';
import fs from 'fs';
import { from } from 'rxjs'
import { count, distinct, map, reduce, tap } from 'rxjs/operators';

const app: express.Application = express();

function mergeNumbers(x: number, y: number, l: number): number {
    switch (true) {
        case isNaN(x):
            return y;
        case Math.abs(y - x) > 2 * l:
            return x;
        case Math.abs(y - x) <= l:
            return y;
        default:
            return x + l;
    }
}

// Parse input data
let content = fs.readFileSync('./app/input', 'utf-8').split("\n");
let l = parseInt(content[0][0]);
let n = parseInt(content[0][1]);
let items: number[] = [];

from(content[1].split(' ')).pipe(
    map((item: string) => parseInt(item))
).subscribe((next) => items.push(next));

// Sort frequency
items.sort((x: number, y: number) => +(x > y));

// Merge items
items.forEach((item: number, index: number) => items[index] = mergeNumbers(items[index - 1], item, l));

let result: number;
from(items).pipe(
    count((item: number, index: number) => Math.abs(item - items[index - 1] || Number.MAX_SAFE_INTEGER) > l)
).subscribe((next: number) => {
    result = next;
    fs.writeFileSync('./app/output', result);
});


app.get('/', function (req, res) {
    res.send({items, result});
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
