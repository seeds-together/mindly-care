import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from 'fs';
import mysql from "mysql";
import path from 'path';

const app = express();
const __dirname = path.resolve();
dotenv.config();
const certificate = fs.readFileSync('./db-mindly-care-ca-certificate.crt').toString();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Conncetion to MySQL Database
var conn = mysql.createConnection({ host: "lin-7654-5099-mysql-primary.servers.linodedb.net", user: "linroot", password: process.env.GH_PASSWORD, database: process.env.GH_DATABASE, port: 3306, ssl: { ca: certificate } });
conn.connect((err) => {
  err ? console.log(err) : console.log('Connected to database 🙂');
})


//TODO Add all routes here
app.get("/", (req, res) => {
  res.render('index');
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
