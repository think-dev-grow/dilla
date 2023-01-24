const express = require("express");

const {
  createSanAccount,
  getSanAccount,
  getSanTransactionHistory,
} = require("../controllers/sanAccount");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

router.get("/create-account/:id", createSanAccount);

router.get("/get-san-account", protect, getSanAccount);

router.get("/san-history", protect, getSanTransactionHistory);

module.exports = router;
