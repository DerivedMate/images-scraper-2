"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("path");
exports.loadURLs = () => {
    const arg = process.argv[2];
    const isURL = new RegExp('https?://w+.w{2,3}.*');
    if (typeof arg === 'undefined')
        throw new Error(`Did you forget to pass path to the urls file? I'm outta here!`);
    return fs_extra_1.default
        .readFile(path_1.resolve(__dirname, arg), 'utf-8')
        .then(JSON.parse)
        .then(json => {
        if (!Array.isArray(json))
            throw new Error("You gave me something else than a string array! I'm outta here!");
        return json;
    })
        .catch(err => {
        debugger;
        return [];
    });
};
exports.getDist = () => {
    const arg = process.argv[3];
    if (typeof arg === 'undefined')
        throw new Error("Ya forgot to gimme the dist path... the 2nd arg... I'm outta here!");
    return path_1.resolve(__dirname, arg);
};
