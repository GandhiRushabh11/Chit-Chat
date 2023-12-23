const exprees = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./config/db.js");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");
dotenv.config({});
const app = new exprees();

app.use(cors());
app.use(exprees.json());
//Connecting To DB
ConnectDB();

//mounting Route
app.use("/api/v1/user", userRoutes);

//Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost: ${PORT}`);
});
