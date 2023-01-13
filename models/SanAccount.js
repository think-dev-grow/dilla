const mongoose = require("mongoose");

const SanAccountSchema = new mongoose.Schema(
  {
    accountName: { type: String },
    accountNumber: { type: Number },
    accountBalance: { type: Number, default: 0 },
    userID: { type: String },
  },
  { timestamps: true }
);

const San = mongoose.model("San", SanAccountSchema);
module.exports = San;
