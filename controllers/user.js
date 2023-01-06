const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, password } = req.body;

  const check = await User.findById(req.params.id);

  if (!check) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const validPassword = await bcrypt.compare(oldPassword, check.password);

  if (!validPassword) {
    res.status(400);
    throw new Error("Your old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(password, salt);

  const data = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { password: hash } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `password change  successfully`,
    data,
  });
});
