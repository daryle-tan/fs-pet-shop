import express from "express";
import { readPetsFile } from './shared.js';
import { writeFile } from 'fs/promises';
import { send } from "process";

const app = express();
const PORT = 3000;

app.use(express.json());


app.get("/pets", (req, res, next) => {
    readPetsFile().then(obj => {
        res.send(obj);
    })
    .catch(next);
});

app.get("/pets/:id", (req, res, next) => {
    readPetsFile().then(obj => {
        if (obj[req.params.id]) {
            res.send(obj[req.params.id]);
        }
    })
    .catch(next); 
});

app.post("/pets", (req, res, next) => {
    const body = req.body;
    const newPet = {
        name: req.body.name,
        kind: req.body.kind,
        age: Number(req.body.age)
    };
    readPetsFile().then(obj => {
        const pets = obj;
        pets.push(body);
       
        if (newPet.name === "" || newPet.kind === "" || newPet.age !== Number(newPet.age)) {
            console.log("im here")
            return res.status(400)
                .set('content-type', 'text/plain')
                .send("Bad Request")
        }
        
        writeFile("pets.json", JSON.stringify(pets)).then((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send(pets)
            }
        })
    })
    .catch(next);
});

app.use((req, res, next) => {
    if()
    return res.set('content-type', 'text/plain')
              .status(404)
              .send("Not Found")
})

app.get("/blah", (req, res, next) => {
    readPetsFile().then((err, obj) => {
        if (err) return next(err);
        console.log(obj);
    });
  });

app.use((err, req, res, next) => {
    console.error(err.stack);
    return res.set('content-type', 'text/plain')
              .status(500)
              .send("Internal Server Error")
  });

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})

