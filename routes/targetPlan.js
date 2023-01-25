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
  activatePlanAPI,
  targetPlanStatus,
  s,
  setType,
} = require("../controllers/targetPlan");

const protect = require("../middlewares/authMiddleware");

router.get("/create-account", protect, createTP);

router.put("/Target-plan-name", protect, targetPlanName);

router.put("/set-earning", protect, autoTargetPlanEarn);

router.put("/set-expenditure", protect, autoTargetPlanExp);

router.put("/custom-saving-target", protect, customTargetPlanSavingTarget);

router.put("/custom-saving-rate", protect, customTargetPlanSavingRate);

router.put("/custom-duration", protect, customTargetPlanDuration);

router.get("/get-target-account", protect, getTargetPlanAccount);

router.put("/saving-period", protect, setSavingPeriod);

router.put("/set-type", protect, setType);

router.put("/set-status", protect, targetPlanStatus);

router.get("/calculate-intrest", protect, calcIntrest);

router.get("/activate-plan", protect, activatePlanAPI);

module.exports = router;
