const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const randomize = require("randomatic");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const Token = require("../models/Token");
const crypto = require("crypto");

const sendVerificationMail = require("../utils/email/sendOTP");
const sendCompleteProfile = require("../utils/email/sendCompleteProfile");
const ceoMail = require("../utils/email/ceoMail");
const supportMail = require("../utils/email/supportMail");

//Generate Token
const generateToken = (id) => {
  const payload = {
    id,
  };
  return jwt.sign(payload, process.env.JWT, { expiresIn: "1d" });
};

//Send OTP
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
    sendVerificationMail(user.email, otp);

    if (user) {
      const verified = user.verified;
      res.status(201).json({ success: true, otp, verified, msg: "13" });
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
    sendVerificationMail(user.email, otp);

    if (user) {
      const verified = user.verified;
      res
        .status(201)
        .json({ success: true, otp, verified, msg: "Token resent" });
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
  const { code } = req.body;

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

  if (code === user.emailOTP) {
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
  if (checkEmail && checkEmail.dhid) {
    res.status(400);
    throw new Error("Email already in use.");
  }

  //check if contact exist
  const checkContact = await User.findOne({ contact: req.body.contact });
  if (checkContact) {
    res.status(400);
    throw new Error("Phone Number already exist.");
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

  sendCompleteProfile(data.email, data.kodeHex);
  ceoMail(data.email, data.kodeHex);
  supportMail(data.email, data.kodeHex);

  res.status(200).json({
    success: true,
    msg: `Hey ${data.kodeHex},Registration completed.`,
  });
});

//Security Question API
const securityQusetion = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { question, answer } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(answer, salt);

  const sq = {
    question: question,
    answer: hash,
  };

  const sqUpdate = await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { securityQusetion: sq, verified: "sq" } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Dont worry ${sqUpdate.kodeHex} , Your secret is safe with us`,
    sqUpdate,
  });
});

//Answer security question
const answerSQ = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { ans } = req.body;

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const checkAnswer = bcrypt.compareSync(ans, user.securityQusetion.answer);

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

  const point = user.kycPoints + 25;

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (bvn.length < 11 || bvn.length > 11) {
    res.status(400);
    throw new Error("invalid BVN");
  }

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
const mobileVerification = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pin } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: { mobilePinId: pin },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Successfull `,
  });
});

//Mobile verification 2 (update the process)
const updateMobileVerification = asyncHandler(async (req, res) => {
  const check = await User.findById(req.user.id);

  if (!check) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const point = check.kycPoints + 25;

  await User.findOneAndUpdate(
    { _id: check._id },
    { $set: { verified: "mv", kycPoints: point } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    msg: `Successfull `,
  });
});

//Mobile verification 3
const getMobilePin = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  const pin = user.mobilePinId;

  res.status(200).json({
    success: true,
    msg: `Successfull `,
    pin,
  });
});

//Wrong Contact
const wrongContact = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const { newPhoneNumber } = req.body;

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const checkNumber = await User.findOne({ contact: newPhoneNumber });

  if (checkNumber) {
    res.status(401);
    throw new Error("phone number already exist");
  }

  await User.findOneAndUpdate(
    { _id: req.user.id },
    { $set: { contact: newPhoneNumber } },
    { new: true }
  );

  res
    .status(200)
    .json({ success: true, msg: "Phone number has been changed successfully" });
});

//Set pin
const setPin = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { code, confirmCode } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(400);
    throw new Error("User does not exist.");
  }

  if (!code || code.length < 4 || code.length > 4) {
    res.status(400);
    throw new Error("Please enter a valid pin.");
  }

  if (!confirmCode || confirmCode.length < 4 || confirmCode.length > 4) {
    res.status(400);
    throw new Error("Please enter a valid pin.");
  }

  if (code !== confirmCode) {
    res.status(400);
    throw new Error(`Hey ${user.kodeHex}, password dont match`);
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(code, salt);

  await User.findByIdAndUpdate(
    { _id: id },
    { $set: { transactionPin: hash, verified: "completed" } }
  );

  res.status(200).json({
    success: true,
    msg: `Successfull , remeber ${user.kodeHex} don't share you pin with anyone`,
  });
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  //Hash Token
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Save token to DB
  await new Token({
    userId: user._id,
    token: hashToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * (60 * 1000), // 5 min,
  }).save();

  //Create url link
  const link = process.env.Fro;

  res.send("Forgot password");
});

//Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  res.send("reset password");
});

//Log In
const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  //check if user exist
  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400);
    throw new Error("User does not exist , Please sign up");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    res.status(400);
    throw new Error("Invalid login credentials ");
  }

  //generate token
  const token = generateToken(user._id);

  //Send HTTP only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user && validPassword) {
    const { _id, email, kodeHex } = user;

    res.status(200).json({
      success: true,
      msg: "Login successfull",
      user: {
        _id,
        email,
        kodeHex,
      },
    });
  }
});

//login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }

  //verify token
  const verified = jwt.verify(token, process.env.JWT);

  if (verified) {
    return res.json(true);
  }

  return res.json(false);
});

//Log Out
const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({ msg: "Logout succesfully", success: true });
});

//test

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
  answerSQ,
  wrongContact,
  forgotPassword,
  resetPassword,
  logOut,
  Login,
  loginStatus,
  getMobilePin,
};
