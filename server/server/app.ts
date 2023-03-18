
import url from 'url';

import http, { IncomingMessage, Server, ServerResponse } from "http";
/*
implement your server code here
*/
import fs, { writeFileSync, existsSync} from "fs";
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
  createdAt: Date,
  updatedAt: Date,
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
      if(req.url === "/") {
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify(parse));
      }
    }
    if (req.method === "POST") {
      if(req.url === "/data") {
        let result = "";
      req.on('data', (chunk) => {
        result += chunk;
        result;
      })
        req.on('end', () => {
        const data: fileInfo = JSON.parse(result)
        data.createdAt = dateNow;
        const totalNoOfEmployee = data.employees.length;
        data.noOfEmployees = totalNoOfEmployee;
        const name = data.organization
        // if(name){
        //   let id = parse && parse.length === 0 ? 1 : parse[parse.length - 1].id;
        //   parse.push(data);
        // }
        if (name) {
          let id = 1;
          if (parse && parse.length > 0) {
            id = parse[parse.length - 1].id + 1;
          }
          data.id = id
          parse.push(data);
        }
        const jsonString = JSON.stringify(parse, null, 2);
        fs.writeFileSync('./server/inputs/database.json', jsonString);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({parse}));
      })
        
      }
    }
    if(req.method === 'PUT') {
      if(req.url && req.url.includes('/data/')) {
          const id = parseInt(req.url.split("/")[2])
        let result = "";
        req.on('data', data => {
          result += data
          result;
        })
        
        req.on('end', () => {
            let parseData: fileInfo = JSON.parse(result);
          parseData.updatedAt = dateNow;
          parseData.noOfEmployees = parseData.employees.length;
          const newParse = parse.findIndex(item => item.id === id)
          if(newParse !== -1) {
             parse[newParse] = {...parse[newParse], ...parseData }
     
             }
     
        const jsonString = JSON.stringify(parse, null, 2);
        fs.writeFileSync('./server/inputs/database.json', jsonString);
        res.writeHead(200, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({ parse }));
          })
       }
      
   }
    if (req.method === "DELETE") {
      if(req.url && req.url.includes('/data/')) {
         const id = parseInt(req.url.split("/")[2])
         const newParse = parse.findIndex(item => item.id === id)
          if(newParse !== -1) {
              parse.splice(newParse, 1)
            const jsonString = JSON.stringify(parse, null, 2)
            fs.writeFileSync('./server/inputs/database.json', jsonString)
             }
          res.writeHead(200, {'Content-Type': 'application/json'})
          res.end(JSON.stringify({ parse }));
        };
      }
    })

server.listen(3005);