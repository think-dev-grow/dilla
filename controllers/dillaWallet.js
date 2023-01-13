const DillaWallet = require("../models/DillaWallet");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const randomize = require("randomatic");

const createDillaWallet = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const checkDillaWallet = await DillaWallet.findOne({ userID: id });

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const name = `${user.firstname} ${user.lastname}`;

  if (checkDillaWallet) {
    res.status(400);
    throw new Error("You already have a dilla wallet account.");
  }

  const dillaWallet = new DillaWallet({
    userID: id,
    accountName: name,
    accountNumber: randomize(0, 10),
  });

  const data = await dillaWallet.save();

  res.status(200).json({
    success: true,
    msg: "Dilla wallet has been created succesfully",
    data,
  });
});

const getDillaWallet = asyncHandler(async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);

    if (!user) {
      res.status(400);
      throw new Error("User does not exist");
    }

    const dillaWallet = await DillaWallet.findOne({ userID: id });

    if (dillaWallet) {
      res.status(400);
      throw new Error("You don't have dilla wallet account.");
    }

    res.status(200).json({ success: true, dillaWallet });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createDillaWallet,
  // topUp,
  // transferMoneyToDilla,
  getDillaWallet,
  // transferToMySan,
  // requestMoney,
};
