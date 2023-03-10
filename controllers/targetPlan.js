const TargetPlan = require("../models/TargetPlan");
var abbreviate = require("number-abbreviate");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");
// const randomize = require("randomatic");

const createTP = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);

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

  var digits = Math.floor(Math.random() * 9000000000) + 1000000000;

  const data = new TargetPlan({
    userID: id,
    accountNumber: digits,
  });

  const targetPlan = await data.save();

  res.status(200).json({
    msg: "wise people creat a target and save",
    targetPlan,
    success: true,
  });
});

const targetPlanName = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const targetId = req.params.id;

  const { name } = req.body;

  const user = await User.findById(id);

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

  if (!name) {
    res.status(400);
    throw new Error("Please enter a name for your target plan.");
  }

  const targetPlan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    {
      $set: {
        name: name,
      },
    },
    { new: true }
  );

  res.status(200).json({
    msg: "fun name",
    targetPlan,
    success: true,
  });
});

const autoTargetPlanEarn = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const targetId = req.params.id;
  const { ern } = req.body;

  const user = await User.findById(req.user.id);

  const targetAcct = await TargetPlan.findOne({ _id: targetId });

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

  if (!targetAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!ern) {
    res.status(400);
    throw new Error("Please input how much you earn.");
  }

  const psr1 = abbreviate(ern * 0.4);
  const psr2 = abbreviate(ern * 0.6);
  const psr3 = abbreviate(ern * 0.8);

  const psrange = [psr1, `${psr1}-${psr2}`, `${psr2}-${psr3}`];
  const cPsr = [ern * 0.4, ern * 0.6, ern * 0.8];

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { earn: ern, psr: psrange, cPsr } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const autoTargetPlanExp = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const targetId = req.params.id;

  const { value } = req.body;

  const user = await User.findById(req.user.id);

  const tpData = await TargetPlan.findOne({ _id: targetId });

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

  if (!tpData) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!value) {
    res.status(400);
    throw new Error("Please input how much you spend.");
  }

  const index = value - 1;

  const diff = tpData.earn - tpData.cPsr[index];

  const autoSavingRate = diff * 0.4;

  const autoSavingTarget = tpData.cPsr[index] * 6;

  const autoDuration = autoSavingTarget / autoSavingRate;

  // Cast (run check)

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    {
      $set: {
        exp: tpData.cPsr[index],
        autoDuration,
        autoSavingTarget,
        autoSavingRate,
      },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `exp`,
    value,
    index,
    plan,
  });
});

const customTargetPlanSavingTarget = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const targetId = req.params.id;

  const { savingTarget } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

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

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!savingTarget) {
    res.status(400);
    throw new Error("Please input how much you save.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { customSavingTarget: savingTarget, type: "custom" } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const customTargetPlanSavingRate = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { savingRate } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

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

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!savingRate) {
    res.status(400);
    throw new Error("Please input how much you want to save.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { customSavingRate: savingRate } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const customTargetPlanDuration = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { duration } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

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

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!duration) {
    res.status(400);
    throw new Error("Please input how long you want to save.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { customDuration: duration } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const getTargetPlanAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const user = await User.findById(req.user.id);

  //this will be modified to find base on the target id
  const targetPlan = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!targetPlan) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  res.status(200).json({ success: true, targetPlan });
});

const getTargetPlans = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  //this will be modified to find base on the target id
  const targetPlan = await TargetPlan.find({
    userID: id,
    activate: true,
    dreamType: "private",
  });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!targetPlan) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  res.status(200).json({ success: true, targetPlan });
});

const getTargetPublicPlans = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  //this will be modified to find base on the target id
  const targetPlan = await TargetPlan.find({
    userID: id,
    activate: true,
    dreamType: "public",
  });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!targetPlan) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  res.status(200).json({ success: true, targetPlan });
});

const setSavingPeriod = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const targetId = req.params.id;

  const { period } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!period) {
    res.status(400);
    throw new Error("Please input the period you want to save.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { savingPeriod: period } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Great choice cadet `,
    plan,
  });
});

const setType = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { type } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!type) {
    res.status(400);
    throw new Error("Please select your prefferd dream type.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { dreamType: type } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Great choice ${user.kodeHex} `,
    plan,
  });
});

const calcIntrest = async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  let value;

  const user = await User.findById(req.user.id);

  const targetAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!targetAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (targetAcct.type === "custom") {
    value = ~~targetAcct?.customDuration;
  } else {
    value = ~~targetAcct?.autoDuration;
  }

  const month = new Date().getMonth();
  const calenderYears = new Date().getFullYear();
  const day = new Date().getDate();

  //add custom duration
  const calenderLength = value;

  const calender = [
    { val: 1, day: 31, date: { month: 1, year: calenderYears } },
    { val: 2, day: 28, date: { month: 2, year: calenderYears } },
    { val: 3, day: 31, date: { month: 3, year: calenderYears } },
    { val: 4, day: 30, date: { month: 4, year: calenderYears } },
    { val: 5, day: 31, date: { month: 5, year: calenderYears } },
    { val: 6, day: 30, date: { month: 6, year: calenderYears } },
    { val: 7, day: 31, date: { month: 7, year: calenderYears } },
    { val: 8, day: 31, date: { month: 8, year: calenderYears } },
    { val: 9, day: 30, date: { month: 9, year: calenderYears } },
    { val: 10, day: 31, date: { month: 10, year: calenderYears } },
    { val: 11, day: 30, date: { month: 11, year: calenderYears } },
    { val: 12, day: 31, date: { month: 12, year: calenderYears } },
    { val: 13, day: 31, date: { month: 1, year: calenderYears + 1 } },
    { val: 14, day: 28, date: { month: 2, year: calenderYears + 1 } },
    { val: 15, day: 31, date: { month: 3, year: calenderYears + 1 } },
    { val: 16, day: 30, date: { month: 4, year: calenderYears + 1 } },
    { val: 17, day: 31, date: { month: 5, year: calenderYears + 1 } },
    { val: 18, day: 30, date: { month: 6, year: calenderYears + 1 } },
    { val: 19, day: 31, date: { month: 7, year: calenderYears + 1 } },
    { val: 20, day: 31, date: { month: 8, year: calenderYears + 1 } },
    { val: 21, day: 30, date: { month: 9, year: calenderYears + 1 } },
    { val: 22, day: 31, date: { month: 10, year: calenderYears + 1 } },
    { val: 23, day: 30, date: { month: 11, year: calenderYears + 1 } },
    { val: 24, day: 31, date: { month: 12, year: calenderYears + 1 } },
    { val: 25, day: 31, date: { month: 1, year: calenderYears + 2 } },
    { val: 26, day: 28, date: { month: 2, year: calenderYears + 2 } },
    { val: 27, day: 31, date: { month: 3, year: calenderYears + 2 } },
    { val: 28, day: 30, date: { month: 4, year: calenderYears + 2 } },
    { val: 29, day: 31, date: { month: 5, year: calenderYears + 2 } },
    { val: 30, day: 30, date: { month: 6, year: calenderYears + 2 } },
    { val: 31, day: 31, date: { month: 7, year: calenderYears + 2 } },
    { val: 32, day: 31, date: { month: 8, year: calenderYears + 2 } },
    { val: 33, day: 30, date: { month: 9, year: calenderYears + 2 } },
    { val: 34, day: 31, date: { month: 10, year: calenderYears + 2 } },
    { val: 35, day: 30, date: { month: 11, year: calenderYears + 2 } },
    { val: 36, day: 31, date: { month: 12, year: calenderYears + 2 } },
    { val: 37, day: 31, date: { month: 1, year: calenderYears + 3 } },
    { val: 38, day: 28, date: { month: 2, year: calenderYears + 3 } },
    { val: 39, day: 31, date: { month: 3, year: calenderYears + 3 } },
    { val: 40, day: 30, date: { month: 4, year: calenderYears + 3 } },
    { val: 41, day: 31, date: { month: 5, year: calenderYears + 3 } },
    { val: 42, day: 30, date: { month: 6, year: calenderYears + 3 } },
    { val: 43, day: 31, date: { month: 7, year: calenderYears + 3 } },
    { val: 44, day: 31, date: { month: 8, year: calenderYears + 3 } },
    { val: 45, day: 30, date: { month: 9, year: calenderYears + 3 } },
    { val: 46, day: 31, date: { month: 10, year: calenderYears + 3 } },
    { val: 47, day: 30, date: { month: 11, year: calenderYears + 3 } },
    { val: 48, day: 31, date: { month: 12, year: calenderYears + 3 } },
    { val: 49, day: 31, date: { month: 1, year: calenderYears + 4 } },
    { val: 50, day: 28, date: { month: 2, year: calenderYears + 4 } },
    { val: 51, day: 31, date: { month: 3, year: calenderYears + 4 } },
    { val: 52, day: 30, date: { month: 4, year: calenderYears + 4 } },
    { val: 53, day: 31, date: { month: 5, year: calenderYears + 4 } },
    { val: 54, day: 30, date: { month: 6, year: calenderYears + 4 } },
    { val: 55, day: 31, date: { month: 7, year: calenderYears + 4 } },
    { val: 56, day: 31, date: { month: 8, year: calenderYears + 4 } },
    { val: 57, day: 30, date: { month: 9, year: calenderYears + 4 } },
    { val: 58, day: 31, date: { month: 10, year: calenderYears + 4 } },
    { val: 59, day: 30, date: { month: 11, year: calenderYears + 4 } },
    { val: 60, day: 31, date: { month: 12, year: calenderYears + 4 } },
    { val: 61, day: 31, date: { month: 1, year: calenderYears + 5 } },
    { val: 62, day: 28, date: { month: 2, year: calenderYears + 5 } },
    { val: 63, day: 31, date: { month: 3, year: calenderYears + 5 } },
    { val: 64, day: 30, date: { month: 4, year: calenderYears + 5 } },
    { val: 65, day: 31, date: { month: 5, year: calenderYears + 5 } },
    { val: 66, day: 30, date: { month: 6, year: calenderYears + 5 } },
    { val: 67, day: 31, date: { month: 7, year: calenderYears + 5 } },
    { val: 68, day: 31, date: { month: 8, year: calenderYears + 5 } },
    { val: 69, day: 30, date: { month: 9, year: calenderYears + 5 } },
    { val: 70, day: 31, date: { month: 10, year: calenderYears + 5 } },
    { val: 71, day: 30, date: { month: 11, year: calenderYears + 5 } },
    { val: 72, day: 31, date: { month: 12, year: calenderYears + 5 } },
  ];

  const R = 0.11;
  const perAnnum = 365;
  const cb =
    targetAcct.type === "custom"
      ? targetAcct.customSavingRate
      : targetAcct.autoSavingRate;

  let int = [];
  let intrestDuration = [];

  const savingPeriod = calender.splice(month, calenderLength);

  //intrest per month
  const sum = savingPeriod.reduce((p, c, i) => {
    const f1 = (i + 1) * cb;
    const f2 = R * c.day;

    const ipp = (f1 * f2) / perAnnum;

    int.push(ipp);
    // intrestDuration.push(c.date);
    intrestDuration.push({ ipp, date: c.date, amount: (i + 1) * cb });

    return int;
  }, cb);

  //acc. intrest
  const runSum = sum.reduce((p, c) => {
    return p + c;
  }, 0);

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    {
      $set: {
        totalIntrest: runSum,
        intrestPerMonth: sum,
        breakdown: intrestDuration,
        paymentDate: day,
      },
    },
    { new: true }
  );

  res.status(200).json({
    plan,
    msg: "successful calculation",
    success: true,
    cb,
    value,
  });
};

const targetPlanStatus = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { status } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!status) {
    res.status(400);
    throw new Error("Please input the period you want to save.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { targetStatus: status } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Target plan status has been set to ${status}`,
    plan,
  });
});

const activatePlanAPI = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { activatePlan: true } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Plan has been activated `,
    plan,
  });
});

const topUp = asyncHandler(async (req, res) => {
  const { amount, reference } = req.body;
  const id = req.user.id;
  const targetId = req.params.id;

  const day = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const hour = new Date().getHours() + 1;
  const minute = new Date().getMinutes();

  const check = minute <= 9 ? `0${minute}` : minute;

  const user = await User.findById(req.user.id);

  const targetPlan = await TargetPlan.findOne({
    _id: targetId,
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

  if (!targetPlan) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!amount) {
    res.status(400);
    throw new Error("Please input the amount you want to save.");
  }

  const date = `${day}-${month}-${year}  `;
  const time = `${hour}:${check}`;

  const transaction = new Transaction({
    userId: id,
    transactionPlatform: "Target",
    transactionAmount: amount,
    transactionType: "Top Up",
    transactionDate: date,
    transactionTime: time,
    // transactionDestination: "flex",
    // transactionOrigin: "flex",
    transactionReciept: reference,
  });

  const data = await transaction.save();

  const topUp = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    {
      $set: {
        accountBalance: targetPlan.accountBalance + amount,
      },
    },
    { new: true }
  );

  res
    .status(200)
    .json({ msg: "Top up successful", topUp, data, success: true, day });
});

const getTargetTransactionHistory = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const transactionHistory = await Transaction.find({
    userId: id,
    transactionPlatform: "Target",
  }).sort({
    _id: -1,
  });

  res.status(200).json({ msg: "done", transactionHistory });
});

const calculateTotalTargetBalance = asyncHandler(async (req, res) => {
  const { id } = req.user;

  let array1 = [];

  let tb;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }

  const allTargetBalance = await TargetPlan.find({ userID: id }).select(
    "accountBalance"
  );

  allTargetBalance.map(({ accountBalance }) => {
    return array1.push(accountBalance);
  });

  const initialValue = 0;

  tb = array1.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue
  );

  res.status(200).json({ tb });
});

const extendTargetPlan = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { savingTarget, savingRate, period, password } = req.body;

  const user = await User.findById(req.user.id);

  const targetAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!targetAcct) {
    res.status(400);
    throw new Error(
      "You can't perform this action, Target account don't exist"
    );
  }

  if (!savingTarget || !savingRate || !period || !password) {
    res.status(400);
    throw new Error("Please fill form correctly.");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    res.status(400);
    throw new Error("Wrong credentials ");
  }

  if (targetAcct.type === "auto") {
    if (
      savingRate < targetAcct.autoSavingRate ||
      savingTarget < targetAcct.autoSavingTarget
    ) {
      res.status(400);
      throw new Error(
        " Please check saving target and saving rate , and try again"
      );
    } else {
      await TargetPlan.findOneAndUpdate(
        { _id: targetId },
        {
          $set: {
            autoSavingRate: savingRate,
            autoSavingTarget: savingTarget,
            savingPeriod: period,
          },
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        msg: `Your target Plan has been extended successfully `,
      });
    }
  } else {
    if (
      savingRate < targetAcct.customSavingRate ||
      savingTarget < targetAcct.customSavingTarget
    ) {
      res.status(400);
      throw new Error(
        "Please check saving target and saving rate , and try again"
      );
    } else {
      await TargetPlan.findOneAndUpdate(
        { _id: targetId },
        {
          $set: {
            customSavingRate: savingRate,
            customSavingTarget: savingTarget,
            savingPeriod: period,
          },
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        msg: `Your target Plan has been extended successfully `,
      });
    }
  }
});

const updateTargetPlan = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { name, source, password } = req.body;

  const user = await User.findById(req.user.id);

  const targetAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!targetAcct) {
    res.status(400);
    throw new Error(
      "You can't perform this action, Target account don't exist"
    );
  }

  if (!name || !savingRate || !period || !password) {
    res.status(400);
    throw new Error("Please fill form correctly.");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    res.status(400);
    throw new Error("Wrong credentials ");
  }
});

const setDisplayType = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { type } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!type) {
    res.status(400);
    throw new Error("Please input the period you want to save.");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { displayType: type } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Target plan type has been set to ${type}`,
    plan,
  });
});

const setDescription = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const targetId = req.params.id;

  const { description } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await TargetPlan.findOne({ _id: targetId });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  const plan = await TargetPlan.findOneAndUpdate(
    { _id: targetId },
    { $set: { description: description } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `description has been set successfully`,
    plan,
  });
});

const joinTarget = asyncHandler(async (req, res) => {
  const referralId = req.params.id;
  const targetId = req.params.targetId;
  console.log(targetId);
  res.send(
    `I'm still being built by the best developer inthe world ... love rex . ${referralId} :) `
  );
});

module.exports = {
  createTP,
  targetPlanName,
  autoTargetPlanEarn,
  autoTargetPlanExp,
  customTargetPlanSavingTarget,
  customTargetPlanSavingRate,
  customTargetPlanDuration,
  getTargetPlanAccount,
  setSavingPeriod,
  calcIntrest,
  activatePlanAPI,
  targetPlanStatus,
  setType,
  topUp,
  getTargetTransactionHistory,
  getTargetPlans,
  calculateTotalTargetBalance,
  extendTargetPlan,
  setDisplayType,
  setDescription,
  joinTarget,
  getTargetPublicPlans,
};
