import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql";

const app = express();
dotenv.config();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Conncetion to MySQL Database
var conn = mysql.createConnection({ host: "garudahacks.mysql.database.azure.com", user: "garuda@garudahacks", password: process.env.GH_PASSWORD, database: process.env.GH_DATABASE, port: 3306 });
conn.connect((err) => {
  err ? console.log(err) : console.log('Connected to database 🙂');
})


//TODO Add all routes here
app.get("/", (req, res) => {
  res.send("We are all set for Garuda Hacks");
});

//404 error handler page
app.use((_, res) => {
  res.status(500).json({ message: "404: Page Not Found", state: false });
});

//Server Listens On:
const port = 3000;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
