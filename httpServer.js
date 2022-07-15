import { fstat, readFile } from 'fs';
import http from 'http';
import { readPetsFile } from './shared.js';

const petRegExp = /^\/pets\/(.*)$/;

const server = http.createServer((req, res) => {
    const url = new URL('http://localhost:3000' + req.url);
    const matches = req.url.match(petRegExp);   
    if (req.url === '/pets' && req.method === 'GET') {    
        readPetsFile().then((data) => {
            res.writeHead(200, { "Content-Type": "application/JSON" });
            res.end(JSON.stringify(data));
        });
    } else if (matches && req.method === "GET") {
        const id = matches[1];
        readPetsFile().then((data) => {
            if (data[id]) {
                
                res.end(JSON.stringify(data[id]));
            } else {
                res.writeHead(404);
                res.end();
          }
        })
    } else {
        res.writeHead(404);
        res.end()
    }
});

server.listen(3000, () => {
    console.log("server started on port 3000");
});



// import http from 'http';
// import { readPetsFile } from './shared.js';

// const petRegExp = /^\/pets\/(.*)$/;

// const server = http.createServer((req, res) => {
//     const url = new URL('http://localhost:3000' + req.url);
    
//     if (req.url === '/pets' && req.method === 'GET') {
       
//         readPetsFile().then((data) => {
//             res.end(JSON.stringify(data));
//         });
//     } else {
//         res.writeHead(404);
//         res.end()
//     }
// });

// server.listen(3000, () => {
//     console.log("server started on port 3000");
// });
