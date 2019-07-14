"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const input_1 = require("./input");
const helpers_1 = require("./helpers");
const path_1 = require("path");
const master_1 = require("./saving/master");
(() => __awaiter(this, void 0, void 0, function* () {
    const urls = yield input_1.loadURLs();
    const outDist = input_1.getDist();
    const browser = yield puppeteer_1.default.launch({
        headless: helpers_1.inProd,
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    });
    yield Promise.all(urls.map((url) => __awaiter(this, void 0, void 0, function* () {
        return new Promise((res) => __awaiter(this, void 0, void 0, function* () {
            const page = yield browser.newPage();
            const images = [];
            page.on('response', e => {
                if (e.request().resourceType() !== 'image')
                    return;
                const rImageType = /image\/(\w+)/;
                const contentType = e.headers()['content-type'];
                if (e.ok()) {
                    const matches = rImageType.exec(contentType);
                    images.push([e.url(), matches ? matches[1] : 'jpg']);
                }
            });
            page.on('load', () => {
                res(helpers_1.filterReps(images));
                // if (!page.isClosed()) page.close()
            });
            yield page
                .goto(url, {
                timeout: 0,
                waitUntil: 'domcontentloaded',
            })
                .then(() => page.evaluate(() => {
                for (let i = 1; i < 51; i++) {
                    window.setTimeout(() => {
                        document.documentElement.scrollBy(0, innerHeight / 2);
                    }, 150 * i);
                }
            }));
        }));
    })))
        .then(x => {
        browser.close();
        return x;
    })
        .then(sites => {
        const input = sites.reduce((acc, arr) => {
            acc.push(...arr.map(([url, ext]) => [url, path_1.resolve(outDist, `${helpers_1.hash()}.${ext}`)]));
            return acc;
        }, []);
        const master = new master_1.Paralio(input);
        master.on('consume', ([xs, x]) => {
            console.log(x);
            if (xs.length === 0) {
                setTimeout(() => {
                    console.log("I'm done!");
                    process.exit(0);
                }, 4000);
            }
        });
    });
}))();
