const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const flexPlanRoutes = require("./routes/flexplan");
const targetPlanRoutes = require("./routes/targetPlan");
const dillaWalletRoutes = require("./routes/dillaWallet");
const sanAccountRoutes = require("./routes/sanAccount");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://ardilla-web.netlify.app"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Routes Middleware
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/flex", flexPlanRoutes);
app.use("/api/target", targetPlanRoutes);
app.use("/api/dilla-wallet", dillaWalletRoutes);
app.use("/api/san", sanAccountRoutes);

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
