const express = require("express");

const {
  createSanAccount,
  totalUser,
  declineUtilityBill,
  declineID,
  approveID,
  approveUtility,
  totalCompletedKYC,
  totalSavingPlan,
} = require("../controllers/admin");

const admin = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/create-account/:id", admin, createSanAccount);

router.get("/total-user", admin, totalUser);

router.get("/total-completed-kyc", admin, totalCompletedKYC);

router.get("/total-saving-plans", admin, totalSavingPlan);

router.put("/approve-utility/:id", admin, approveUtility);

router.put("/decline-utility/:id", admin, declineUtilityBill);

router.put("/approve-id/:id", admin, approveID);

router.put("/decline-id/:id", admin, declineID);

module.exports = router;
