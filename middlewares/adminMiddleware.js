const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const admin = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please login");
    }

    //Verify Token
    const verified = jwt.verify(token, process.env.JWT);

    const id = verified.id;

    const user = await User.findById(id);

    const { isAdmin } = user;

    res.send(isAdmin);

    // if (!isAdmin) {
    //   res.status(401);
    //   throw new Error("Not authorized,You can't carry out this operation.");
    // }
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please login");
  }
});

module.exports = admin;
