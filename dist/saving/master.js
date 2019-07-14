"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const events_1 = require("events");
const os_1 = require("os");
const path_1 = require("path");
class Paralio extends events_1.EventEmitter {
    constructor(input) {
        super();
        this.workers = 0;
        this._input = [];
        this.input = input;
        this.max = os_1.cpus().length;
        this.workerPath = path_1.resolve(__dirname, "./worker");
        this.run();
    }
    on(event, listener) {
        super.on(event, listener);
    }
    emit(event, data) {
        return super.emit(event, data);
    }
    consume() {
        const item = this._input.pop();
        this.emit('consume', [this._input, item]);
        return item || null;
    }
    end() {
        return this._input.length <= 0;
    }
    run() {
        this._input = this.input.slice();
        this.initWorkers();
    }
    initWorkers() {
        cluster_1.default.setupMaster({
            exec: this.workerPath,
        });
        for (let i = 0; i < this.max; i++) {
            if (this._input.length <= 0)
                break;
            const wk = cluster_1.default.fork();
            this.workers++;
            wk.on('message', this.initOnMessage(wk));
            wk.send(this.package());
        }
        this.emit('start', this);
    }
    package() {
        return this.consume();
    }
    initOnMessage(w) {
        return () => {
            if (this.end()) {
                w.kill();
                if (--this.workers <= 0) {
                    this.emit('end', this);
                }
            }
            else {
                w.send(this.package());
            }
        };
    }
}
exports.Paralio = Paralio;
