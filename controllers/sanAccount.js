const San = require("../models/SanAccount");
const User = require("../models/User");
const TargetPlan = require("../models/TargetPlan");
const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");
const FlexPlan = require("../models/FlexPlan");

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

const sanToDIB = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const id = req.user.id;

  const user = await User.findById(id);

  const flexPlan = await FlexPlan.findOne({
    userID: id,
  });

  const sanAccount = await San.findOne({
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

  if (!sanAccount) {
    res.status(400);
    throw new Error(
      "Unable to perform this action, because you do not have a san account"
    );
  }

  if (amount > sanAccount.accountBalance) {
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

  const sanTransactionHistory = new Transaction({
    userId: id,
    accountNumber: sanAccount.accountNumber,
    name: user.kodeHex,
    transactionAmount: amount,
    transactionPlatform: "San",
    transactionType: "Withdraw",
    transactionDate: date,
    transactionTime: time,
  });

  const sanReciept = await sanTransactionHistory.save();

  //Debit San Account
  await San.findOneAndUpdate(
    { userID: id },
    {
      $set: {
        accountBalance: sanAccount.accountBalance - amount,
      },
    },
    { new: true }
  );

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
    msg: "Transfer to your DIB from san was successful",
    flexReciept,
    sanReciept,
    success: true,
  });
});

const sanToDream = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const id = req.user.id;

  const user = await User.findById(id);

  const targetPlan = await TargetPlan.findOne({
    userID: id,
  });

  const sanAccount = await San.findOne({
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

  if (!targetPlan) {
    res.status(400);
    throw new Error("You can't perform this action, because do not exist");
  }

  if (!sanAccount) {
    res.status(400);
    throw new Error(
      "Unable to perform this action, because you do not have a san account"
    );
  }

  if (amount > sanAccount.accountBalance) {
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

  const sanTransactionHistory = new Transaction({
    userId: id,
    accountNumber: sanAccount.accountNumber,
    name: user.kodeHex,
    transactionAmount: amount,
    transactionPlatform: "San",
    transactionType: "Withdraw",
    transactionDate: date,
    transactionTime: time,
  });

  const sanReciept = await sanTransactionHistory.save();

  //Debit San Account
  await San.findOneAndUpdate(
    { userID: id },
    {
      $set: {
        accountBalance: sanAccount.accountBalance - amount,
      },
    },
    { new: true }
  );

  //Credit Target
  await TargetPlan.findOneAndUpdate(
    { userID: id },
    { $set: { accountBalance: targetPlan.accountBalance + amount } },
    { new: true }
  );

  const targetTransactionHistory = new Transaction({
    userId: id,
    name: user.kodeHex,
    accountNumber: targetPlan.accountNumber,
    transactionAmount: amount,
    transactionPlatform: "Target",
    transactionType: "Top Up",
    transactionDate: date,
    transactionTime: time,
  });

  const targetReciept = await targetTransactionHistory.save();

  res.status(200).json({
    msg: "Transfer to your Dream account from san was successful",
    targetReciept,
    sanReciept,
    success: true,
  });
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

  const sanAccount = await San.findOne({
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

  if (!sanAccount) {
    res.status(400);
    throw new Error(
      "You can't perform this action, because you do not have a San account"
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
    transactionPlatform: "San",
    transactionAmount: amount,
    transactionType: "Top Up",
    transactionDate: date,
    transactionTime: time,
    transactionReciept: reference,
  });

  const data = await transaction.save();

  const topUp = await San.findOneAndUpdate(
    { userID: id },
    {
      $set: {
        accountBalance: sanAccount.accountBalance + amount,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ msg: "Top up successful", topUp, data, success: true, day });
});

module.exports = {
  getSanAccount,
  getSanTransactionHistory,
  sanToDIB,
  sanToDream,
  topUp,
};
