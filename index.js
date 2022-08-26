import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

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
