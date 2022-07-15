import express from "express";
import { readPetsFile } from './shared.js';
import fs from "fs/promises"

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/pets", (req, res) => {
    readPetsFile().then(str => {
       res.send(str);
    })
});

app.get("/pets/:id/", (req, res) => {
    readPetsFile().then(str => {
        if (str[req.params.id]) {
            res.send(str[req.params.id]);         
        } else {
            res.status(404).send('Not Found')
        }
    })
});



app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
} )