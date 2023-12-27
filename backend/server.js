const exprees = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db.js");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
const postmanToOpenApi = require("postman-to-openapi");
const path = require("path");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

dotenv.config({});
const app = new exprees();

app.use(cors());
app.use(exprees.json());
//Connecting To DB
ConnectDB();

//Serving Swagger Documentation
const swaggerDocument = YAML.load("./postman/swagger.yml");
app.use("/swagger", swaggerUi.serve);
app.get("/swagger", swaggerUi.setup(swaggerDocument));
//mounting Route
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);
//Error Middleware
app.use(notFound);
app.use(errorHandler);

//generate the swagger UI

/* postmanToOpenApi(
  "postman/Chit-Chat API.postman_collection.json",
  path.join("postman/swagger.yml"),
  { defaultTags: "General" }
).then((res) => {
  let result = YAML.load("postman/swagger.yml");
  console.log(result.servers[0].url);
  result.servers[0].url = "/";
  app.use("/swagger", swaggerUi.serve);
  app.get("/swagger", swaggerUi.setup(result));
  //app.use("/swagger", swaggerUi.serve, swaggerUi.setup(result));
}); */
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
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.uesrs not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
