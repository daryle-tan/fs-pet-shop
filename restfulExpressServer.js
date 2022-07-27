import express from "express";
import pg from "pg";

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new pg.Pool({
  database: "pet-shop",
});

app.get("/pets", (req, res, next) => {
  pool
    .query("SELECT * FROM pets")
    .then((data) => {
      res.send(data.rows);
    })
    .catch(next);
});

app.get("/pes/:id", (req, res, next) => {
  const id = req.params.id;
  pool
    .query(`SELECT * FROM pets WHERE id = $1;`, [id])
    .then((data) => {
      const pet = data.rows[0];
      if (pet) {
        res.send(pet);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next);
});

app.post("/pets", (req, res, next) => {
  // const name = req.body.name;
  // const kind = req.body.kind;
  // const age = Number(req.body.age);
  const { name, kind, age } = req.body;
  pool
    .query(
      // `INSERT INTO pets(name, kind, age) VALUES('${name}', '${kind}', '${age}');`
      `INSERT INTO pets(name, kind, age) VALUES($1, $2, $3) RETURNING *;`,
      [name, kind, age]
    )
    .then((data) => {
      if (req.body) {
        res.send(data.rows[0]);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(next);
});

app.patch("/pets/:id", (req, res, next) => {
  const index = req.params.id;
  const body = req.body;
  pool
    .query(
      `UPDATE pets SET name = COALESCE($1, name),
                        age = COALESCE($2, age),
                       kind = COALESCE($3, kind)
                  WHERE id = COALESCE($4, id)
                  RETURNING *;`,
      [body.name, body.age, body.kind, index]
    )
    .then((data) => {
      if (body.name) {
        console.log(data);
        res.send(data.rows[0]);
      } else {
        res.sendStatus(400);
      }
    })
    .catch(next);
});

app.delete("/pets/:id", (req, res, next) => {
  const id = req.params.id;
  pool
    .query("DELETE FROM pets WHERE id = $1 RETURNING *;", [id])
    .then((data) => {
      console.log(data);
      if (data.rows.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(data.rows[0]);
      }
    })
    .catch(next);
});

app.use((err, req, res, next) => {
  return res
    .set("content-type", "text/plain")
    .status(500)
    .send("Internal Server Error");
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// app.post("/pets", (req, res) => {
//   readPetsFile().then((obj) => {
//     const body = req.body;
//     const pets = obj;
//     pets.push(body);

//     fs.writeFile("pets.json", JSON.stringify(pets)).then((err) => {
//       if (err) {
//         res.status(404);
//       } else {
//         res.send(body);
//       }
//     });
//   });
// });

// app.get("/pets/:id", (req, res) => {
//   readPetsFile().then((obj) => {
//     const index = req.params.id;
//     if (obj[index]) {
//       res.type("application/json");
//       res.send(obj[index]);
//     } else {
//       res.sendStatus(404);
//     }
//   });
// });

// app.patch("/pets/:id", (req, res) => {
//   const index = req.params.id;
//   const body = req.body;
//   //   const newPet = {
//   //     name: req.body.name,
//   //     kind: req.body.kind,
//   //     age: Number(req.body.age),
//   //   };
//   readPetsFile().then((obj) => {
//     const pets = obj[index];
//     if (body.name) {
//       pets.name = body.name;
//     } else {
//       res.sendStatus(404);
//     }

//     writeFile("pets.json", JSON.stringify(obj)).then((err) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(pets);
//       }
//     });
//   });
// });

// app.delete("/pets/:id", (req, res) => {
//   const index = req.params.id;
//   readPetsFile().then((obj) => {
//     if (obj[index]) {
//       obj.splice(index, 1);
//     }

//     fs.writeFile("pets.json", JSON.stringify(obj)).then((err) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(obj[index]);
//       }
//     });
//   });
// });
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
