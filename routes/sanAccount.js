const express = require("express");

const {
  getSanAccount,
  getSanTransactionHistory,
  sanToDIB,
  sanToDream,
  topUp,
} = require("../controllers/sanAccount");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/get-san-account", protect, getSanAccount);

router.get("/san-history", protect, getSanTransactionHistory);

router.put("/san-to-dib", protect, sanToDIB);

router.put("/san-top-up", protect, topUp);

router.put("/san-to-dream/:id", protect, sanToDream);

module.exports = router;
