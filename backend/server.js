const exprees = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db.js");
const cors = require("cors");
dotenv.config({});
const app = new exprees();

const { chats } = require("./data/chat");

app.use(cors());

//Connecting To DB
ConnectDB();

app.get("/api/v1/", (req, res) => {
  res.send("Chit-Chat API Running Successfully!!!");
});
app.get("/api/v1/chat", (req, res) => {
  res.send(chats);
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost: ${PORT}`);
});
