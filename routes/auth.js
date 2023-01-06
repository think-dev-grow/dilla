const express = require("express");
const {
  sendOTP,
  verifyOTP,
  wrongEmail,
  completeProfile,
  securityQusetion,
  addBVN,
  answerSQ,
} = require("../controllers/auth");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

router.post("/send-otp", sendOTP);

router.post("/verify-otp", protect, verifyOTP);

router.delete("/wrong-email", protect, wrongEmail);

router.put("/complete-profile", protect, completeProfile);

router.put("/security-question", protect, securityQusetion);

router.post("/answer-question", protect, answerSQ);

router.put("/add-bvn", protect, addBVN);

module.exports = router;
