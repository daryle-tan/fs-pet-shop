import express from "express";
import { readPetsFile } from './shared.js';
import { writeFile } from 'fs/promises';
import fs from "fs/promises";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/pets", (req, res) => {
    readPetsFile().then(obj => {
       res.send(obj);
    })
});

app.get("/pets/:id/", (req, res) => {
    readPetsFile().then(obj => {
        if (obj[req.params.id]) {
            res.send(obj[req.params.id])
        } else {
            res.sendStatus(404)
        }
    })
});

app.post("/pets", (req, res) => {
    const body = req.body;
    readPetsFile().then(obj => {
        const pets = obj;
        pets.push(body);
        res.send(pets)

        writeFile("pets.json", JSON.stringify(pets)).then((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send(pets)
            }
        })
    })
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})