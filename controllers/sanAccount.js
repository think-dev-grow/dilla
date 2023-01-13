const San = require("../models/SanAccount");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const randomize = require("randomatic");

const createSanAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const sanAcct = await San.findOne({ userID: id });

  const user = await User.findById(id);

  const name = `${user.firstname} ${user.lastname}`;

  if (!user) {
    res.status(400);
    throw new Error("User does not exist");
  }

  if (sanAcct) {
    res.status(400);
    throw new Error("You already have a san account.");
  }

  if (
    !user.uid &&
    user.idBackStatus === "approved" &&
    user.idFrontStatus === "approved" &&
    user.utilityBillStatus === "approved"
  ) {
    const generatedAccountNumber = randomize(0, 10);
    const sanDetails = new San({
      accountName: name,
      userID: id,
      accountNumber: generatedAccountNumber,
    });

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { uid: generatedAccountNumber },
      },
      { new: true }
    );

    const data = await sanDetails.save();

    res.status(200).json({
      success: true,
      msg: "SAN account has been created succesfully",
      data,
    });
  } else {
    res.status(400).json({
      success: true,
      msg: "All Kyc must be approved first",
    });
  }
});

const getSanAccount = asyncHandler(async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findById(id);

    if (!user) {
      res.status(400);
      throw new Error("User does not exist");
    }

    const sanAccount = await San.findOne({ userID: id });

    if (sanAccount) {
      res.status(400);
      throw new Error("You don't have dilla wallet account.");
    }

    res.status(200).json({ success: true, sanAccount });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createSanAccount,
  getSanAccount,
};
