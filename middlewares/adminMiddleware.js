const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isAdmin = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    //Verify Token
    const verified = jwt.verify(token, process.env.JWT);

    res.send(verified);

    // const id = verified.

    // req.user = verified;
    // next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

module.exports = isAdmin;
