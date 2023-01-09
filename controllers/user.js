const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_KEY,
//   api_secret: process.env.CLOUD_SECRET,
// });

cloudinary.config({
  cloud_name: "domthgc9v",
  api_key: "382674119878141",
  api_secret: "FAupYcLySkHxYuVyF5J36UTy2y0",
});

//Get User
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const { _id, email, kodeHex } = user;

  res.status(200).json({
    success: true,
    msg: "request successfull",
    user: {
      _id,
      email,
      kodeHex,
    },
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

  // res.send("live");

  // const id = req.user.id;

  // const user = await User.findById(id);

  // if (!user) {
  //   res.status(400);
  //   throw new Error("User does not exist.");
  // }

  if (!req.file) {
    res.status(400);
    throw new Error("image can not be uploaded");
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

  // await User.findOneAndUpdate(
  //   { _id: id },
  //   {
  //     $set: { photo: uploadedFile.secure_url },
  //   },
  //   { new: true }
  // );

  res
    .status(200)
    .json({ success: true, msg: "picture uploaded successfully...", fileData });
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
    { _id: req.params.id },
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
};
