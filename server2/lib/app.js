"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
/*implement your server
code here*/
const server = http_1.default.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/web-scrape") {
        try {
            async function scrape() {
                const url = "https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/";
                const response = await axios_1.default.get(url);
                const $ = cheerio.load(response.data);
                const title = $("title").text();
                const desc = $('meta[name="description"]').attr("content");
                const imgUrls = [];
                $("img").each((i, image) => {
                    const imgUrl = $(image).attr("src");
                    imgUrls.push(imgUrl);
                });
                const data = {
                    Title: title,
                    Description: desc,
                    ImageUrls: imgUrls,
                };
                res.writeHead(200, { "Content-Type": "text/HTML" });
                res.end(JSON.stringify(data, null, 2));
            }
            scrape();
        }
        catch (err) {
            console.error(err);
        }
    }
    else {
        res.writeHead(404, { "Content-Type": "text/HTML" });
        res.end(JSON.stringify({ alert: "Route Unavailable" }));
    }
});
server.listen(3001, () => console.log(`Port Running`));
