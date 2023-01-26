const San = require("../models/SanAccount");
const User = require("../models/User");
const FlexPlan = require("../models/FlexPlan");
const TargetPlan = require("../models/TargetPlan");
const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");

const generatedAccountNumberMail = require("../utils/email/generateAccount");

// Total user
const totalUser = asyncHandler(async (req, res) => {
  const users = await User.find();

  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  const totalUsers = users.length;

  res.status(200).json({ totalUsers, success: true });
});

// Total Completed KYC Users
const totalCompletedKYC = asyncHandler(async (req, res) => {
  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }
  const users = await User.find({
    idBackStatus: "approved",
    idFrontStatus: "approved",
    utilityBillStatus: "approved",
  });

  const totalUsers = users.length;

  res.status(200).json({ totalUsers, success: true });
});

// Total Saving Plans
const totalSavingPlan = asyncHandler(async (req, res) => {
  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  const flexPlans = await FlexPlan.find();

  const targetPlans = await TargetPlan.find();

  const totalPlans = flexPlans.length + targetPlans.length;

  res.status(200).json({
    totalPlans,
    success: true,
    fp: flexPlans.length,
    tp: targetPlans.length,
  });
});

//Create san account
const createSanAccount = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  const sanAcct = await San.findOne({ userID: id });

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const name = `${user.firstname} ${user.lastname}`;

  if (sanAcct) {
    res.status(400);
    throw new Error("User already have a san account.");
  }

  if (
    user.idBackStatus === "approved" &&
    user.idFrontStatus === "approved" &&
    user.utilityBillStatus === "approved"
  ) {
    var digits = Math.floor(Math.random() * 9000000000) + 1000000000;

    const sanDetails = new San({
      accountName: name,
      userID: id,
      accountNumber: digits,
    });

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { uid: digits, kycPoints: user.kycPoints + 50 },
      },
      { new: true }
    );

    const data = await sanDetails.save();

    try {
      await generatedAccountNumberMail(user.email, digits, user.kodeHex);

      res.status(200).json({
        success: true,
        msg: "SAN account has been created succesfully",
        data,
      });
    } catch (error) {
      res.status(400);
      throw new Error("Email not sent.");
      console.log(error);
    }
  } else {
    res.status(400);
    throw new Error("All KYC hasn't been approved");
  }
});

//Decline utility bill
const declineUtilityBill = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        utilityBillStatus: "decline",
      },
    },
    { new: true }
  );

  res.status(200).json({ msg: "utility bill  decline " });
});

//Approved utility bill
const approveUtility = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        utilityBillStatus: "approved",
        kycPoints: user.kycPoints + 25,
      },
    },
    { new: true }
  );

  res.status(200).json({ msg: "utility bill approved " });
});

//Decline utility bill
const declineID = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        idFrontStatus: "decline",
        idBackStatus: "decline",
      },
    },
    { new: true }
  );

  res.status(200).json({ msg: "Invalid ID , Please upload again" });
});

//Approved ID
const approveID = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  const admin = req.isAdmin;

  if (!admin) {
    res.status(401);
    throw new Error("Not authorized, this operation is reserved");
  }

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        idFrontStatus: "approved",
        idBackStatus: "approved",
        kycPoints: user.kycPoints + 25,
      },
    },
    { new: true }
  );

  res.status(200).json({ msg: "ID approved " });
});

module.exports = {
  createSanAccount,
  totalUser,
  declineUtilityBill,
  approveUtility,
  declineID,
  approveID,
  totalCompletedKYC,
  totalSavingPlan,
};
