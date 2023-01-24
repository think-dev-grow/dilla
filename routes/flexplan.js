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
  flexToDilla,
  flexToSAN,
} = require("../controllers/flexPlan");

const protect = require("../middlewares/authMiddleware");

router.get("/create-account", protect, createFP);

router.put("/set-earning", protect, autoFlexPlanEarn);

router.put("/set-expenditure", protect, autoFlexPlanExp);

router.put("/custom-saving-target", protect, customFlexPlanSavingTarget);

router.put("/custom-saving-rate", protect, customFlexPlanSavingRate);

router.put("/custom-duration", protect, customFlexPlanDuration);

router.get("/get-flex-account", protect, getFlexPlanAccount);

router.put("/saving-period", protect, setSavingPeriod);

router.get("/calculate-intrest", protect, calcIntrest);

router.get("/activate-plan", protect, activatePlanAPI);

router.put("/flex-top-up", protect, topUp);

router.put("/flex-to-dilla", protect, flexToDilla);

router.put("/flex-to-san", protect, flexToSAN);

router.get("/flex-history", protect, getFlexTransactionHistory);

module.exports = router;
