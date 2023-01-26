const express = require("express");

const {
  getSanAccount,
  getSanTransactionHistory,
  sanToDIB,
} = require("../controllers/sanAccount");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/get-san-account", protect, getSanAccount);

router.get("/san-history", protect, getSanTransactionHistory);

router.put("/san-to-dib", protect, sanToDIB);

module.exports = router;
