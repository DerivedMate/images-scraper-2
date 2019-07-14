"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.createFile = (dist) => fs_extra_1.default.createWriteStream(dist, {
    encoding: 'utf-8',
});
