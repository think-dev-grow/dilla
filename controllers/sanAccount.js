const San = require("../models/SanAccount");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");

const getSanAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const sanAccount = await San.findOne({ userID: id });

  res.status(200).json({ success: true, sanAccount });
});

const getSanTransactionHistory = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const transactionHistory = await Transaction.find({
    userId: id,
    transactionPlatform: "San",
  }).sort({
    _id: -1,
  });

  res.status(200).json({ msg: "done", transactionHistory });
});

module.exports = {
  getSanAccount,
  getSanTransactionHistory,
};
