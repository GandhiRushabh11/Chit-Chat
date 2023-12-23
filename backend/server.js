const exprees = require("express");
const dotenv = require("dotenv");
dotenv.config({});
const app = new exprees();

const { chats } = require("./data/chat");
const PORT = process.env.PORT || 8000;

app.get("/api/v1/", (req, res) => {
  res.send("Chit-Chat API Running Successfully!!!");
});
app.get("/api/v1/chat", (req, res) => {
  res.send(chats);
});
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost: ${PORT}`);
});
