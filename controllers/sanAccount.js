const San = require("../models/SanAccount");
const User = require("../models/User");
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

module.exports = {
  getSanAccount,
  getSanTransactionHistory,
  sanToDIB,
};
