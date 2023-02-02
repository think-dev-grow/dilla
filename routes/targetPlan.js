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
  topUp,
  setType,
  getTargetTransactionHistory,
  getTargetPlans,
} = require("../controllers/targetPlan");

const protect = require("../middlewares/authMiddleware");

router.get("/create-account", protect, createTP);

router.put("/Target-plan-name/:id", protect, targetPlanName);

router.put("/set-earning/:id", protect, autoTargetPlanEarn);

router.put("/set-expenditure/:id", protect, autoTargetPlanExp);

router.put("/custom-saving-target/:id", protect, customTargetPlanSavingTarget);

router.put("/custom-saving-rate/:id", protect, customTargetPlanSavingRate);

router.put("/custom-duration/:id", protect, customTargetPlanDuration);

router.get("/get-target-account/:id", protect, getTargetPlanAccount);

router.get("/get-target-plans", protect, getTargetPlans);

router.put("/saving-period/:id", protect, setSavingPeriod);

router.put("/set-type/:id", protect, setType);

router.put("/set-status/:id", protect, targetPlanStatus);

router.get("/calculate-intrest/:id", protect, calcIntrest);

router.get("/activate-plan/:id", protect, activatePlanAPI);

router.put("/target-top-up/:id", protect, topUp);

router.get("/target-history", protect, getTargetTransactionHistory);

module.exports = router;
