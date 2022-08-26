import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
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
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true, name: 'JSESSION' }));
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



app.get('/login', function (req, res) {
  if (req.session.uid) { res.redirect('dashboard'); }
  else { res.render('login'); }
});

app.post('/login', function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  conn.query("SELECT password FROM `USERS` WHERE `email` = " + `'${email}'`, (err, result) => {
    if (err) {
      console.log("Error!", err);
      res.render('login');
    }
    if (result === undefined || result.length < 1) { res.render('login') }
    else if (bcrypt.compareSync(password, result[0].password)) {
      req.session.email = email;
      req.session.loggedin = true;
      req.session.uid = result[0].Id;
      res.redirect('dashboard');
    }
    else {
      res.redirect('login');
    }
  })
});


app.get('/signup', (_, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  const hashPassword = bcrypt.hashSync(password, 10);
  const code = Math.floor(100000 + Math.random() * 900000);

  conn.query(`SELECT * FROM USERS WHERE Username = '${username}' OR Email = '${email}'`, (err, result) => {
    if (err) {
      console.log("Error!, Signup failed", err);
      res.render('signup');
    }
    if (result.length > 0) {
      console.log(result);
      res.render('signup');
    }
    else {
      conn.query(`INSERT INTO USERS (Username, Email, Password, twilio_code) VALUES ('${username}', '${email}', '${hashPassword}', '${code}');`, (err, result) => {
        if (err) console.log(err);
        res.redirect('login');
      })
    }
  })
});


app.get('/dashboard', function (req, res) {
  res.render('dashboard');
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
