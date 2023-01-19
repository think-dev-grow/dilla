const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const TargetPlan = require("../models/TargetPlan");
const FlexPlan = require("../models/FlexPlan");

cloudinary.config({
  cloud_name: "dyanzjijz",
  api_key: "252218227834719",
  api_secret: "gp4pR3KMUQhNBbLjlL7iaINpmsA",
});

//Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  // const {
  //   _id,
  //   email,
  //   kodeHex,
  //   verified,
  //   contact,
  //   mobilePinId,
  //   securityQusetion,
  // } = user;

  res.status(200).json({
    success: true,
    msg: "request successfull",
    user,
  });
});

//Update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const { kodeHex, email, firstname, lastname, contact } = user;

  user.email = email;
  user.kodeHex = req.body.kodeHex || kodeHex;
  user.contact = req.body.contact || contact;
  user.firstname = req.body.firstname || firstname;
  user.lastname = req.body.lastname || lastname;

  await user.save();

  res.status(200).json({
    success: true,
    msg: "Profile updated successfull",
  });
});

//Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  const validPassword = await bcrypt.compare(oldPassword, user.password);

  if (!validPassword) {
    res.status(400);
    throw new Error("Your old password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(password, salt);

  const data = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { password: hash } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `password change  successfully`,
    data,
  });
});

//Upload profile pic
const profileImage = asyncHandler(async (req, res) => {
  let fileData = {};

  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("please select an image");
  }

  let uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: "Profile Pic",
    resource_type: "image",
  });

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    fileSize: fileSizeFormatter(req.file.size, 2),
  };

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: { photo: uploadedFile.secure_url },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: "picture uploaded successfull",
    fileData,
  });
});

//Set Next of kin
const nextOfKin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const nextOfKinDetails = req.body.nextOfKin;

  if (!nextOfKinDetails) {
    res.status(400);
    throw new Error("Please fill out form correctly.");
  }

  const data = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { nextOfKin: nextOfKinDetails } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `data uploaded successfully`,
    data,
  });
});

//Upload Valid ID front
const uploadIdFront = asyncHandler(async (req, res) => {
  let fileData = {};

  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  let uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: "kyc",
    resource_type: "image",
  });

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    fileSize: fileSizeFormatter(req.file.size, 2),
  };

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        kyc: { ...user.kyc, idFront: uploadedFile.secure_url },
        idFrontStatus: "pending",
      },
    },
    { new: true }
  );

  res.status(200).json({ fileData, msg: "uploaded successfully " });
});

//Upload Valid ID back
const uploadIdBack = asyncHandler(async (req, res) => {
  let fileData = {};

  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  let uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: "kyc",
    resource_type: "image",
  });

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    fileSize: fileSizeFormatter(req.file.size, 2),
  };

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        kyc: { ...user.kyc, idBack: uploadedFile.secure_url },
        idBackStatus: "pending",
      },
    },
    { new: true }
  );

  res.status(200).json({ fileData, msg: "uploaded successfully " });
});

//Upload Utility
const uploadUtilityBill = asyncHandler(async (req, res) => {
  let fileData = {};

  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  let uploadedFile = await cloudinary.uploader.upload(req.file.path, {
    folder: "kyc",
    resource_type: "image",
  });

  fileData = {
    fileName: req.file.originalname,
    filePath: uploadedFile.secure_url,
    fileType: req.file.mimetype,
    fileSize: fileSizeFormatter(req.file.size, 2),
  };

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        kyc: { ...user.kyc, utilityBill: uploadedFile.secure_url },
        utilityBillStatus: "pending",
      },
    },
    { new: true }
  );

  res.status(200).json({ fileData, msg: "uploaded successfully " });
});

//Change pin
const changePin = asyncHandler(async (req, res) => {
  const { pin } = req.body;

  const user = await User.findById(req.user.id);

  if (!pin || pin.length < 4 || pin.length > 4) {
    res.status(400);
    throw new Error("Please enter a valid pin.");
  }

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(pin, salt);

  const data = await User.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { transactionPin: hash } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `your pin has been changed`,
    data,
  });
});

const approveIdBack = asyncHandler(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) return next(handleError(400, "user does not exist"));

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        idBackStatus: "approve",
      },
    },
    { new: true }
  );

  res.status(200).json({ fileData, msg: "id back approved " });
});

const generateAccount = asyncHandler(async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }

  if (
    user.idBackStatus === "approve" &&
    user.idFrontStatus === "approve" &&
    user.utilityBillStatus === "approve"
  ) {
    const accountNumber = randomize("0", 10);

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          uid: accountNumber,
        },
      },
      { new: true }
    );

    res.status(200).json({
      accountNumber,
      msg: `hey ${user.kodeHex} your account number is ${accountNumber}`,
    });
  } else {
    res.status(200);
    throw new Error("All Kyc documents must be approved first.");
  }
});

const calculateTotalBalance = asyncHandler(async (req, res) => {
  const { id } = req.user;

  let array1 = [];

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User not Found");
  }

  const allTargetBalance = await TargetPlan.find({ userID: id }).select(
    "accountBalance"
  );

  // const initialValue = 0;
  // const sumWithInitial = array1.reduce(
  //   (accumulator, currentValue) => accumulator + currentValue,
  //   initialValue
  // );

  // console.log(sumWithInitial);

  const test = allTargetBalance.map(({ accountBalance }) => {
    return array1.push(accountBalance);
  });

  res.status(200).json(array1);
});

module.exports = {
  getUser,
  updateUser,
  changePassword,
  changePin,
  profileImage,
  nextOfKin,
  uploadIdFront,
  uploadIdBack,
  uploadUtilityBill,
  generateAccount,
  calculateTotalBalance,
};
