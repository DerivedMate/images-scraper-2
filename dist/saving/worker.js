"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const output_1 = require("../output");
const http_1 = require("../http");
class Worker {
    constructor() {
        this.context = {};
        process.on('newListener', l => {
            // process.stdout.write(`[Worker]> New worker #${process.pid} connected!`)
            console.log(`[Worker]> New worker #${process.pid} connected!`);
        });
        process.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
            if (!msg)
                return;
            const p = this.onMessage(msg);
            let res = p instanceof Promise
                ? yield p.catch((err) => {
                    console.log(`[W:${process.pid}]> ERROR: "${err.message}"\nSTACK: ${err.stack};\n MESSAGE: ${msg};\n Bailing out!`);
                    process.disconnect();
                })
                : p;
            process.send && process.send(res);
        }));
    }
    onMessage(msg) {
        return void 0;
    }
}
exports.Worker = Worker;
new (class extends Worker {
    onMessage([url, dist]) {
        return new Promise(res => {
            const file = output_1.createFile(dist);
            http_1.downloadFile(url, file);
            file.on('close', () => res("Here's a postcard!"));
        });
    }
})();
