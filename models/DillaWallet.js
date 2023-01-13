const mongoose = require("mongoose");

const DillaWalletSchema = new mongoose.Schema(
  {
    accountName: { type: String },
    accountNumber: { type: Number },
    accountBalance: { type: Number, default: 0 },
    userID: { type: String },
  },
  { timestamps: true }
);

const DillaWallet = mongoose.model("DillaWallet", DillaWalletSchema);
module.exports = DillaWallet;
