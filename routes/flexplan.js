const express = require("express");
const router = express.Router();

const {
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
  topUp,
  getFlexTransactionHistory,
} = require("../controllers/flexPlan");

const protect = require("../middlewares/authMiddleware");

router.post("/create-account", protect, createFP);

router.put("/set-earning", protect, autoFlexPlanEarn);

router.put("/set-expenditure", protect, autoFlexPlanExp);

router.put("/custom-saving-target", protect, customFlexPlanSavingTarget);

router.put("/custom-saving-rate", protect, customFlexPlanSavingRate);

router.put("/custom-duration", protect, customFlexPlanDuration);

router.get("/get-flex-account", protect, getFlexPlanAccount);

router.put("/saving-period", protect, setSavingPeriod);

router.get("/calculate-intrest", protect, calcIntrest);

router.put("/activate-plan", protect, activatePlanAPI);

router.put("/flex-top-up", protect, topUp);

router.get("/flex-history", protect, getFlexTransactionHistory);

module.exports = router;
