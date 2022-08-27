import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import fs from "fs";
import mysql from "mysql";
import path from 'path';
import { Server } from "socket.io";


const app = express();
//Server Listens On:
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});

const __dirname = path.resolve();
dotenv.config();
const certificate = fs
  .readFileSync("./db-mindly-care-ca-certificate.crt")
  .toString();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "JSESSION",
  })
);
app.use(cors());



// Conncetion to MySQL Database
const conn = mysql.createConnection({ host: "lin-7654-5099-mysql-primary.servers.linodedb.net", user: "linroot", password: process.env.GH_PASSWORD, database: process.env.GH_DATABASE, port: 3306, ssl: { ca: certificate } });

conn.connect((err) => {
  err ? console.log(err) : console.log("Connected to database 🙂");
});

//TODO Add all routes here
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", function (req, res) {
  if (req.session.uid) {
    res.redirect("dashboard");
  } else {
    res.render("login");
  }
});

app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  conn.query("SELECT * FROM `USERS` WHERE `Username` = " + `'${username}'`, (err, result) => {
    if (err) {
      console.log("Error!", err);
      res.render('login');
    }
    if (result === undefined || result.length < 1) { res.render('login') }
    else if (bcrypt.compareSync(password, result[0].password)) {
      req.session.username = username;
      req.session.loggedin = true;
      req.session.uid = result[0].Id;
      res.redirect('dashboard');
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('login');
    }
  });
});

app.get('/signup', (_, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const hashPassword = bcrypt.hashSync(password, 10);
  const code = Math.floor(100000 + Math.random() * 900000);

  conn.query(`SELECT * FROM USERS WHERE Username = '${username}' OR Email = '${email}'`, (err, result) => {
    if (err) {
      console.log("Error!, Signup failed", err);
      res.render('signup');
    }
    if (result.length > 0) {
      // console.log(result);
      res.render('signup');
    }
  );
});

app.get('/dashboard', function (req, res) {
  if (!req.session.loggedin) { res.redirect('login'); }
  console.log(req.session);
  res.render('dashboard', { sess: req.session });
});


app.get('/chat', function (req, res) {
  if (!req.session.loggedin) { res.redirect('login'); }
  else {
    req.session.cnames = []
    conn.query("SELECT USERS.Id, Username FROM USERS INNER JOIN CONTACTS ON USERS.Id = CONTACTS.MAIN_USER WHERE CONTACTS.CONN_USER = " + `${req.session.uid}`, (err, result) => {
      console.log(result);
      result.forEach(element => {
        req.session.cnames.push(element);
      });
      const io = new Server(server, {});
      io.sockets.on('connection', (socket) => {

        console.log(req.session);
        socket.on('getMsg', (data) => {

          conn.query(`SELECT Id,FromUser,ToUser,Content,Time FROM MESSAGES WHERE FromUser = ${req.session.uid} AND ToUser = ${data.id} OR (FromUser = ${data.id} AND ToUser = ${req.session.uid})`, (err, result) => {
            socket.emit('showMsg', { data: data, result: result });
          })
        })

        socket.on('newChat', () => {
          conn.query(`SELECT Id,Username FROM USERS WHERE is_professional = 1`, (err, result) => {
            result = result[Math.floor(Math.random() * result.length)];
            if (err) {
              console.log("err");
            }
            const rid = result.Id;
            req.session.cnames.push(result);
            conn.query(`INSERT INTO CONTACTS (MAIN_USER, CONN_USER) VALUES (${req.session.uid}, ${result.Id}),(${result.Id}, ${req.session.uid});`, (err, result) => {
            })
            socket.emit('newChatAdded', { id: rid });
          })
        })

        socket.on('getNames', () => {
          socket.emit('listContacts', { data: req.session.cnames });
        })

        socket.on('messageData', ({ data, toId }) => {
          conn.query(`INSERT INTO MESSAGES (Content, Time, FromUser, ToUser) VALUES ('${data}', NOW(), ${req.session.uid}, ${toId});`, (err, result) => {

          })
        })
      });

      res.render('chat', { sess: req.session });
    })
  }
})

//404 error handler page
app.use((_, res) => {
  res.status(500).json({ message: "404: Page Not Found", state: false });
});


