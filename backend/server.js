const exprees = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db.js");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
dotenv.config({});
const app = new exprees();

app.use(cors());
app.use(exprees.json());
//Connecting To DB
ConnectDB();

//mounting Route
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);
//Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server Running at http://localhost: ${PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("Connted to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("Conncted");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room :" + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.uesrs not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
