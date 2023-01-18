const express = require("express");

const {
  createDillaWallet,
  topUp,
  //   transferMoneyToDilla,
  getDillaWallet,
  getDillaTransactionHistory,
  //   transferToMySan,
  //   requestMoney,
} = require("../controllers/dillaWallet");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

router.get("/create-account", protect, createDillaWallet);

router.put("/top-up-account", protect, topUp);

router.get("/dilla-history", protect, getDillaTransactionHistory);

// router.put("/transfer/:id", transferMoneyToDilla);

// router.put("/transfer-to-san/:id", transferToMySan);

router.get("/get-dilla-wallet", protect, getDillaWallet);

// router.put("/request-money/:id", requestMoney);

module.exports = router;
