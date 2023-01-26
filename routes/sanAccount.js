const express = require("express");

const {
  getSanAccount,
  getSanTransactionHistory,
} = require("../controllers/sanAccount");

const { createSanAccount } = require("../controllers/admin");

const protect = require("../middlewares/authMiddleware");

const isAdmin = require("../middlewares/adminMiddleware");

const router = express.Router();

//user
router.get("/get-san-account", protect, getSanAccount);

router.get("/san-history", protect, getSanTransactionHistory);

// admin
router.get("/create-account", isAdmin);

module.exports = router;
