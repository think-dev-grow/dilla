const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Routes Middleware
app.use("/api/auth", authRoutes);

//Routes
app.get("/", (req, res) => {
  res.send("Welcome to Ardilla");
});

//Error Middleware
app.use(errorHandler);

//Connect to DB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server connect on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
