const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const randomize = require("randomatic");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const sendVerificationMail = require("../utils/email/sendOTP");
const sendCompleteProfile = require("../utils/email/sendCompleteProfile");
const ceoMail = require("../utils/email/ceoMail");
const supportMail = require("../utils/email/supportMail");

//Generate Token
const generateToken = (id, email) => {
  const payload = {
    id,
    email,
  };
  return jwt.sign(payload, process.env.JWT, { expiresIn: "1d" });
};

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  let otp;

  if (!email) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const check = await User.findOne({ email: email });

  //Logic 1
  if (!check) {
    otp = randomize("0", 7);

    const user = await User.create({
      email,
      emailOTP: otp,
    });

    const token = generateToken(user._id, user.email);

    //Send HTTP only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    //Send Mail
    // sendVerificationMail(user.email, otp);

    if (user) {
      res.status(201).json({ success: true, otp });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }

  //Logic 2
  if (check && !check.dhid) {
    otp = randomize("0", 7);

    const user = await User.findOneAndUpdate(
      { _id: check._id },
      {
        $set: { email: email, emailOTP: otp },
      },
      { new: true }
    );

    const token = generateToken(user._id, user.email);

    //Send HTTP only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });

    //Send Mail
    // sendVerificationMail(user.email, otp);

    if (user) {
      res.status(201).json({ success: true, otp });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }

  //Logic 3
  if (check && check.dhid) {
    res.status(400);
    throw new Error("User already exist");
  }
});

//Verify OTP API
const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  //Fetch user from database
  const user = await User.findById(req.user.id);
  const userID = user._id.toString();

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (userID !== req.user.id) {
    res.status(401);
    throw new Error("Not Allowed");
  }

  if (otp === user.emailOTP) {
    console.log(userID);
    await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: { verified: "otp", emailOTP: null },
      },
      { new: true }
    );

    return res.status(200).json({ success: true, msg: "verification okay" });
  } else {
    res.status(400);
    throw new Error("Incorrect code");
  }
});

//Wrong Email
const wrongEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const userID = user._id.toString();

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  if (userID !== req.user.id) {
    res.status(401);
    throw new Error("Not Allowed");
  }

  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({ success: true, msg: "Email deleted" });
});

//Complete-profile API
const completeProfile = asyncHandler(async (req, res) => {
  const { firstname, lastname, kodeHex, contact, password } = req.body;

  //check if user exist by ID
  const check = await User.findById(req.user.id);
  if (!check) {
    res.status(400);
    throw new Error("user does not exit");
  }

  //check  all fields
  if (!kodeHex || !firstname || !lastname || !contact || !password) {
    res.status(400);
    throw new Error("Please fill out all the required fields");
  }

  //check password
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //check if kodeHex name exist
  const checkUsername = await User.findOne({ kodeHex: req.body.kodeHex });
  if (checkUsername) {
    res.status(400);
    throw new Error("KodeHex name is already taken.");
  }

  //check if email exist
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) {
    res.status(400);
    throw new Error("Email already in use.");
  }

  //check if contact exist
  const checkContact = await User.findOne({ contact: req.body.contact });
  if (checkContact) {
    res.status(400);
    throw new Error("contact already exist.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);

  const data = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      $set: {
        verified: "cp",
        firstname: firstname,
        lastname: lastname,
        kodeHex: kodeHex,
        contact: contact,
        password: hash,
        dhid: uuidv4(),
      },
    },
    { new: true }
  );

  //   sendCompleteProfile(data.email, data.kodeHex);
  //   ceoMail(data.email, data.kodeHex);
  //   supportMail(data.email, data.kodeHex);

  res.status(200).json({
    success: true,
    msg: `Hey ${data.kodeHex},Registration completed.`,
  });
});

//Security Question API
const securityQusetion = asyncHandler(async (req, res) => {
  const check = await User.findById(req.user.id);

  if (!check) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.securityQusetion.answer, salt);

  const sq = {
    question: req.body.securityQusetion.question,
    answer: hash,
  };

  const sqUpdate = await User.findOneAndUpdate(
    { _id: req.params.id },
    { securityQusetion: sq },
    { new: true }
  );

  const data = await User.findOneAndUpdate(
    { _id: req.params.id },
    { verified: "sq" },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Dont worry ${sqUpdate.kodeHex} , Your secret is safe with us`,
    data,
  });
});

//Answer security question
const answerSQ = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const { answer } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const checkAnswer = bcrypt.compareSync(answer, user.securityQusetion.answer);

  if (!checkAnswer) {
    res.status(400);
    throw new Error("incorrect answer ");
  }

  res.status(200).json({ success: true, msg: "answer correct" });
});

//Add BVN
const addBVN = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { bvn } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (bvn.length < 11 || bvn.length > 11) {
    res.status(400);
    throw new Error("incorrect BVN");
  }

  const point = user.kycPoints + 25;

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: { bvn: bvn, verified: "bvn", kycPoints: point },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `BVN registration successful`,
  });
});

//Mobile verification
const mobileVerification = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.user;
    const { pin } = req.body;

    const user = await User.findById(id);

    if (!user) {
      res.status(400);
      throw new Error("User does not exist.");
    }

    const point = user.kycPoints + 25;

    await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { mobilePinId: pin, kycPoints: point },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      msg: `Successfull `,
    });
  } catch (error) {
    next(error);
  }
});

//Mobile verification 2 (update the process)
const updateMobileVerification = asyncHandler(async (req, res) => {
  const check = await User.findById(req.user.id);

  if (!check) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  await User.findOneAndUpdate(
    { _id: check._id },
    { verified: "mv" },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Successfull `,
  });
});

const setPin = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { code, confirmCode } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (code !== confirmCode) {
    res.status(400);
    throw new Error(`Hey ${user.kodeHex}, password dont match`);
  }

  await User.findByIdAndUpdate(
    { _id: id },
    { $set: { transactionPin: code, verified: "completed" } }
  );

  res.status(200).json({
    success: true,
    msg: `Successfull , remeber ${user.kodeHex} don't share you pin with anyone`,
    data,
  });
});

//Forgot Password

//Reset Password

//Log In

//Log Out
const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ msg: "LogOut succesfully", success: true });
});

module.exports = {
  sendOTP,
  verifyOTP,
  wrongEmail,
  completeProfile,
  securityQusetion,
  addBVN,
  mobileVerification,
  updateMobileVerification,
  setPin,
};
