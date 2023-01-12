const express = require("express");
const router = express.Router();

const {
  createTP,
  targetPlanName,
  autoTargetPlanEarn,
  autoTargetPlanExp,
  customTargetPlanSavingTarget,
  customTargetPlanSavingRate,
  customTargetPlanDuration,
  getTargetPlanAccount,
  setSavingPeriod,
  calcIntrest,
} = require("../controllers/targetPlan");

const protect = require("../middlewares/authMiddleware");

router.post("/create-account", protect, createTP);

router.put("/Target-plan-name", protect, targetPlanName);

router.put("/set-earning", protect, autoTargetPlanEarn);

router.put("/set-expenditure", protect, autoTargetPlanExp);

router.put("/custom-saving-target", protect, customTargetPlanSavingTarget);

router.put("/custom-saving-rate", protect, customTargetPlanSavingRate);

router.put("/custom-duration", protect, customTargetPlanDuration);

router.get("/get-target-account", protect, getTargetPlanAccount);

router.put("/saving-period", protect, setSavingPeriod);

router.get("/calculate-intrest", protect, calcIntrest);

module.exports = router;