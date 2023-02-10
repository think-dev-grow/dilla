const mongoose = require("mongoose");

const FlexSchema = new mongoose.Schema(
  {
    userID: { type: String },
    type: { type: String, default: "auto" },
    name: { type: String },
    earn: { type: Number, default: 0 },
    exp: { type: Number, default: 0 },
    expRange: { type: String },
    accountBalance: { type: Number, default: 0 },
    accountNumber: { type: Number, default: 0 },
    autoSavingTarget: { type: Number, default: 0 },
    autoSavingRate: { type: Number, default: 0 },
    autoDuration: { type: String },
    customSavingTarget: { type: Number, default: 0 },
    customSavingRate: { type: Number, default: 0 },
    customDuration: { type: String },
    psr: { type: Array },
    cPsr: { type: Array },
    badge: { type: String, default: "cadet" },
    savingPeriod: { type: String, default: "" },
    totalIntrest: { type: Number, default: 0 },
    totalSaving: { type: Number, default: 0 },
    intrestPerMonth: { type: Array },
    breakdown: { type: Array },
    paymentDate: { type: String },
    activatePlan: { type: Boolean, default: false },
    transcactionHistory: { type: Array, default: [] },
    source: { type: String, default: "dilla" },
  },
  { timestamps: true }
);

const FlexPlan = mongoose.model("FlexPlan", FlexSchema);
module.exports = FlexPlan;
