const DillaWallet = require("../models/DillaWallet");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const FlexPlan = require("../models/FlexPlan");
const asyncHandler = require("express-async-handler");

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

  var digits = Math.floor(Math.random() * 9000000000) + 1000000000;

  const dillaWallet = new DillaWallet({
    userID: id,
    accountName: name,
    accountNumber: digits,
  });

  const data = await dillaWallet.save();

  res.status(200).json({
    success: true,
    msg: "Dilla wallet has been created succesfully",
    data,
  });
});

const getDillaWallet = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const dillaWallet = await DillaWallet.findOne({ userID: id });

  // if (dillaWallet) {
  //   res.status(400);
  //   throw new Error("You don't have dilla wallet account.");
  // }

  res.status(200).json({ success: true, dillaWallet });
});

const topUp = asyncHandler(async (req, res) => {
  const { amount, reference } = req.body;
  const id = req.user.id;

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const hour = new Date().getHours() + 1;
  const minute = new Date().getMinutes();

  const check = minute <= 9 ? `0${minute}` : minute;

  const user = await User.findById(req.user.id);

  const dw = await DillaWallet.findOne({
    userID: id,
  });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (
    user.idBackStatus !== "approved" ||
    user.idBackStatus !== "approved" ||
    user.utilityBillStatus !== "approved"
  ) {
    res.status(400);
    throw new Error("Please complete your Kyc first.");
  }

  if (!dw) {
    res.status(400);
    throw new Error(
      "You can't perform this action, because you do not have a Dilla Wallet"
    );
  }

  if (!amount) {
    res.status(400);
    throw new Error("Please input the amount you want to save.");
  }

  const date = `${day}-${month}-${year}  `;
  const time = `${hour}:${check}`;

  const transaction = new Transaction({
    userId: id,
    transactionPlatform: "Dilla",
    transactionAmount: amount,
    transactionType: "Top Up",
    transactionDate: date,
    transactionTime: time,
    transactionReciept: reference,
  });

  const data = await transaction.save();

  const topUp = await DillaWallet.findOneAndUpdate(
    { userID: id },
    {
      $set: {
        accountBalance: dw.accountBalance + amount,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ msg: "Top up successful", topUp, data, success: true, day });
});

const getDillaTransactionHistory = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const transactionHistory = await Transaction.find({
    userId: id,
    transactionPlatform: "Dilla",
  }).sort({
    _id: -1,
  });

  res.status(200).json({ msg: "done", transactionHistory });
});

const dillaToDIB = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const id = req.user.id;

  const user = await User.findById(id);

  const flexPlan = await FlexPlan.findOne({
    userID: id,
  });

  const dw = await DillaWallet.findOne({
    userID: id,
  });

  if (
    user.idBackStatus !== "approved" ||
    user.idBackStatus !== "approved" ||
    user.utilityBillStatus !== "approved"
  ) {
    res.status(400);
    throw new Error("Please complete your Kyc first.");
  }

  if (!flexPlan) {
    res.status(400);
    throw new Error(
      "You can't perform this action, because you do not have a flex account"
    );
  }

  if (!dw) {
    res.status(400);
    throw new Error(
      "Unable to perform this action, because you do not have a dilla wallet"
    );
  }

  if (amount > dw.accountBalance) {
    res.status(404);
    throw new Error("Insufficient Funds");
  }

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const hour = new Date().getHours() + 1;
  const minute = new Date().getMinutes();

  const check = minute <= 9 ? `0${minute}` : minute;

  const date = `${day}-${month}-${year}  `;
  const time = `${hour}:${check}`;

  //Debit Dilla-Wallet Account
  await DillaWallet.findOneAndUpdate(
    { userID: id },
    {
      $set: {
        accountBalance: dw.accountBalance - amount,
      },
    },
    { new: true }
  );

  const dwTransactionHistory = new Transaction({
    userId: id,
    accountNumber: dw.accountNumber,
    name: user.kodeHex,
    transactionAmount: amount,
    transactionPlatform: "Dilla",
    transactionType: "Withdraw",
    transactionDate: date,
    transactionTime: time,
  });

  const dwReciept = await dwTransactionHistory.save();

  //Credit Flex
  await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { accountBalance: flexPlan.accountBalance + amount } },
    { new: true }
  );

  const flexTransactionHistory = new Transaction({
    userId: id,
    name: user.kodeHex,
    accountNumber: flexPlan.accountNumber,
    transactionAmount: amount,
    transactionPlatform: "Flex",
    transactionType: "Top Up",
    transactionDate: date,
    transactionTime: time,
  });

  const flexReciept = await flexTransactionHistory.save();

  res.status(200).json({
    msg: "Transfer to your DIB from dilla-wallet was successful",
    flexReciept,
    dwReciept,
    success: true,
  });
});

module.exports = {
  createDillaWallet,
  topUp,
  // transferMoneyToDilla,
  getDillaWallet,
  getDillaTransactionHistory,
  // transferToMySan,
  // requestMoney,
  dillaToDIB,
};
