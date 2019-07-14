"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inProd = process.env['NODE_ENV'] === 'production';
exports.hash = () => new Array(5)
    .fill(0)
    .reduce((acc) => (acc += Math.floor(Math.random() * 999 + 999).toString(16)), '');
const rGetExt = new RegExp("\.(jpeg|jpg|tiff|gif|bmp|png|webp|svg|svgz)", "i");
exports.ext = (url) => {
    const matches = rGetExt.exec(url);
    if (matches)
        return matches[1];
    else {
        debugger;
        return "jpg";
    }
};
exports.filterReps = (arr) => {
    const out = [];
    for (const x of new Set(arr).values()) {
        out.push(x);
    }
    return out;
};
