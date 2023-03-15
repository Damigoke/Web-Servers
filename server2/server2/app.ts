import http, { IncomingMessage, Server, ServerResponse } from "http";
import * as cheerio from "cheerio";
import axios from "axios";
/*implement your server 
code here*/

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET" && req.url === "/web-scrape") {
      try {
        async function scrape() {
          const url = "https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/";
          const response = await axios.get(url);
          const $ = cheerio.load(response.data);
          const title = $("title").text();
          const desc = $('meta[name="description"]').attr("content");
          const imgUrls: string[] = [];
          $("img").each((i: any, image: any) => {
            const imgUrl: any = $(image).attr("src");
            imgUrls.push(imgUrl);
          });
          const data = {
            Title: title,
            Description: desc,
            ImageUrls: imgUrls,
          };
          res.writeHead(200, { "Content-Type": "text/HTML" })
          res.end(JSON.stringify(data, null, 2));
        }
        scrape();
      } catch (err) {
        console.error(err);
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/HTML" })
      res.end(JSON.stringify({ alert: "Route Unavailable" }));
    }
  }
);
server.listen(3001, () => console.log(`Port Running`));
