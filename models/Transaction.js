const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    transactionAmount: { type: Number },
    // transactionStatus: { type: String },
    transactionDate: { type: String },
    transactionDestination: { type: String },
    transactionType: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
