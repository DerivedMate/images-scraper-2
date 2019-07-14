"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const rHttps = /^https:\/\//;
const rHttp = /^http:\/\//;
exports.downloadFile = (url, dist) => {
    if (rHttps.test(url))
        https_1.default.get(url, res => res.pipe(dist));
    else if (rHttp.test(url))
        http_1.default.get(url, res => res.pipe(dist));
    else if (/data:\/\//.test(url))
        dist.write(url);
};
