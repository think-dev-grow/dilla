const San = require("../models/SanAccount");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const generatedAccountNumberMail = require("../utils/email/generateAccount");

const createSanAccount = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const sanAcct = await San.findOne({ userID: id });

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const name = `${user.firstname} ${user.lastname}`;

  if (sanAcct) {
    res.status(400);
    throw new Error("You already have a san account.");
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

    generatedAccountNumberMail(user.email, digits, user.kodeHex);

    res.status(200).json({
      success: true,
      msg: "SAN account has been created succesfully",
      data,
    });
  } else {
    res.status(400);
    throw new Error("Please complete your KYC first");
  }
});

const getSanAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  const sanAccount = await San.findOne({ userID: id });

  // if (sanAccount) {
  //   res.status(400);
  //   throw new Error("You don't have san account.");
  // }

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
  createSanAccount,
  getSanAccount,
  getSanTransactionHistory,
};
