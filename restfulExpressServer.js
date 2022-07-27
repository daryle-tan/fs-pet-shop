// import bodyParser from "body-parser";
// import morgan from "morgan";
import express from "express";
import { writeFile } from "fs";
import fs from "fs/promises";
import { readPetsFile } from "./shared.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.post("/pets", (req, res) => {
  readPetsFile().then((obj) => {
    const body = req.body;
    const pets = obj;
    pets.push(body);

    fs.writeFile("pets.json", JSON.stringify(pets)).then((err) => {
      if (err) {
        res.status(404);
      } else {
        res.send(body);
      }
    });
  });
});

app.get("/pets/:id", (req, res) => {
  readPetsFile().then((obj) => {
    const index = req.params.id;
    if (obj[index]) {
      res.type("application/json");
      res.send(obj[index]);
    } else {
      res.sendStatus(404);
    }
  });
});

app.patch("/pets/:id", (req, res) => {
  const index = req.params.id;
  const body = req.body;
  //   const newPet = {
  //     name: req.body.name,
  //     kind: req.body.kind,
  //     age: Number(req.body.age),
  //   };
  readPetsFile().then((obj) => {
    const pets = obj[index];
    if (body.name) {
      pets.name = body.name;
    } else {
      res.sendStatus(404);
    }

    fs.writeFile("pets.json", JSON.stringify(obj)).then((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send(pets);
      }
    });
  });
});

app.delete("/pets/:id", (req, res) => {
  const index = req.params.id;
  readPetsFile().then((obj) => {
    if (obj[index]) {
      obj.splice(index, 1);
    }

    fs.writeFile("pets.json", JSON.stringify(obj)).then((err) => {
      if (err) {
        res.send(err);
      } else {
        res.send(obj[index]);
      }
    });
  });
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
