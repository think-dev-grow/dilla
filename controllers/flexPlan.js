const User = require("../models/User");
const FlexPlan = require("../models/FlexPlan");
var abbreviate = require("number-abbreviate");
const asyncHandler = require("express-async-handler");

const createFP = asyncHandler(async (req, res) => {
  const flexAcct = await FlexPlan.findOne({ userID: req.user.id });

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  //create an acct if there's none
  if (!flexAcct) {
    const data = new FlexPlan({
      userID: req.user.id,
    });

    const flexPlan = await data.save();

    res.status(200).json({
      msg: "wise people create a target and save",
      flexPlan,
      success: true,
    });
  }

  //if there's an acct and it has been acctivated (delete it and start over )
  if (flexAcct && !flexAcct.activatePlan) {
    await FlexPlan.findByIdAndDelete(flexAcct._id);

    const data = new FlexPlan({
      userID: req.user.id,
    });

    const flexPlan = await data.save();

    res.status(200).json({
      msg: "congratulation on your new flex plan",
      flexPlan,
      success: true,
    });
  }

  //if there an acct and it has been activated
  if (flexAcct && flexAcct.activatePlan) {
    return next(handleError(400, "you already have a Flex account."));
  }
});

const autoFlexPlanEarn = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const { ern } = req.body;

  const user = await User.findById(req.user.id);

  const flexAcct = await FlexPlan.findOne({ _id: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!flexAcct) {
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

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { earn: ern, psr: psrange, cPsr } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const autoFlexPlanExp = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const { value } = req.body;

  const user = await User.findById(req.user.id);

  const fpData = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!fpData) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!value) {
    res.status(400);
    throw new Error("Please input how much you spend.");
  }

  const index = value - 1;

  const diff = fpData.earn - fpData.cPsr[index];

  const autoSavingRate = diff * 0.4;

  const autoSavingTarget = fpData.cPsr[index] * 6;

  const autoDuration = autoSavingTarget / autoSavingRate;

  // Cast (run check)

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    {
      $set: {
        exp: fpData.cPsr[index],
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

const customFlexPlanSavingTarget = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const { savingTarget } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!savingTarget) {
    res.status(400);
    throw new Error("Please input how much you save.");
  }

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { customSavingTarget: savingTarget, type: "custom" } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const customFlexPlanSavingRate = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const { savingRate } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!savingRate) {
    res.status(400);
    throw new Error("Please input how much you want to save.");
  }

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { customSavingRate: savingRate } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const customFlexPlanDuration = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const { duration } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (!duration) {
    res.status(400);
    throw new Error("Please input how long you want to save.");
  }

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { customDuration: duration } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Get to saving..`,
    plan,
  });
});

const getFlexPlanAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  const flexPlan = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!flexPlan) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  res.status(200).json({ success: true, flexPlan });
});

const setSavingPeriod = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const { period } = req.body;

  const user = await User.findById(req.user.id);

  const userAcct = await FlexPlan.findOne({ userID: id });

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

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { savingPeriod: period } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Great choice cadet `,
    plan,
  });
});

const activatePlanAPI = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(req.user.id);

  const userAcct = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!userAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
    { $set: { activatePlan: true } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Plan has been activated `,
    plan,
  });
});

const calcIntrest = async (req, res) => {
  const id = req.user.id;

  let value;

  const user = await User.findById(req.user.id);

  const flexAcct = await FlexPlan.findOne({ userID: id });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!flexAcct) {
    res.status(400);
    throw new Error("You can't perform this action");
  }

  if (flexAcct.type === "custom") {
    value = ~~flexAcct?.customDuration;
  } else {
    value = ~~flexAcct?.autoDuration;
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
    flexAcct.type === "custom"
      ? flexAcct.customSavingRate
      : flexAcct.autoSavingRate;

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

  const plan = await FlexPlan.findOneAndUpdate(
    { userID: id },
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

module.exports = {
  createFP,
  autoFlexPlanEarn,
  autoFlexPlanExp,
  customFlexPlanSavingTarget,
  customFlexPlanSavingRate,
  customFlexPlanDuration,
  getFlexPlanAccount,
  setSavingPeriod,
  calcIntrest,
  activatePlanAPI,
};