const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    userId: { type: String },
    transactionAmount: { type: Number },
    transactionDate: { type: String },
    transactionTime: { type: String },
    transactionDestination: { type: String },
    transactionType: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
