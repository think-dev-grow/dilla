const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String },
    transactionPlatform: { type: String },
    transactionAmount: { type: Number },
    transactionDate: { type: String },
    transactionTime: { type: String },
    transactionDestination: { type: String },
    transactionType: { type: String },
    transactionReciept: { type: Object },
    transactionOrigin: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
