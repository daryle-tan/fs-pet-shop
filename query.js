import pg from "pg";

const pool = new pg.Pool({
  database: "pet-shop",
  // user: "dbuser",
  // host: "database.server.com",
  // password: "secretpassword"
  // port:
});

pool.query("SELECT * FROM pets").then((res) => {
  console.log(res.rows);
  pool.end();
});
