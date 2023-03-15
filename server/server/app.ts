
import url from 'url';

import http, { IncomingMessage, Server, ServerResponse } from "http";
/*
implement your server code here
*/
import fs, { writeFileSync } from "fs";
// import { parse } from 'path';
// import { buffer } from 'stream/consumers';
// let path = "./server/inputs/database.json"

let parse: any[] = []
if(fs.existsSync("./server/inputs/database.json")){
  const data: any = fs.readFileSync("./server/inputs/database.json", 'utf-8');
  let parse = JSON.parse(data);
} else {
  fs.writeFileSync("./server/inputs/database.json", JSON.stringify(parse))
};



const dateNow = new Date()
interface fileInfo {
  organization: string,
  createdAt: string,
  updatedAt: string,
  products: string[],
  marketValue: string,
  address: string,
  ceo: string,
  country: string,
  id: number,
  noOfEmployees:number,
  employees:string[]
}

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      if(req.url === "/api") {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({parse}));
      }else{
        fs.writeFileSync("./server/inputs/database.json", "uft8")
      }
    }
    if (req.method === "POST") {
      if(req.url === "/api/data") {
        let result = "";
      req.on('data', (chunk) => {
        result += chunk;
        result;
        
        req.on('end', () => {
        const data = JSON.parse(result)
        data.createdAt = dateNow;
        const numId = data.id;
        const id = numId;
        const name = data.organization
        // if(name){
        //   let id = parse && parse.length === 0 ? 1 : parse[parse.length - 1].id;
        //   parse.push(data);
        // }
        if (name) {
          let id = 1;
          if (parse && parse.length > 0) {
            id = parse[parse.length - 1].id;
          }
        parse.push(data);
        }
        const jsonString = JSON.stringify(parse, null, 2);
        fs.writeFileSync('./server/inputs/database.json', jsonString);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end("Database Created");
      })
        
      })
     }
    }
    if(req.method === 'PUT') {
        req.on('data', data => {
          let parseData = JSON.parse(data);
          parseData.updatedAt = dateNow;
          const id = parseData.id;
          data.forEach((value:fileInfo, index:number) => {
            if(value.id === id){
              data[index] = parseData;
            }
          })
          const jsonString = JSON.stringify(parseData, null, 2);
        fs.writeFileSync('./server/inputs/database.json', jsonString);
        res.writeHead(200, {'Content-Type': 'application/json'})
          res.end('Database updated');
        })
      
    }
    if (req.method === "DELETE") {
      req.on('data', data => {
        let parseData = JSON.parse(data);
        const id = parseData.id;
        let database = fs.readFileSync('./server/inputs/database.json', 'utf-8');
        let jsonData = JSON.parse(database);
        
        if (!Array.isArray(jsonData)) {
          jsonData = [jsonData];
        }
        
        let filteredData = jsonData.filter((value:fileInfo, index:number) => value.id !== id);
        fs.writeFileSync('./server/inputs/database.json', JSON.stringify(filteredData), 'utf-8');
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end('Database Deleted');
      });
    }
});

server.listen(3005);
