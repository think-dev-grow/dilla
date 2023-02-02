const express = require("express");

const {
  createDillaWallet,
  topUp,
  dillaToDIB,
  //   transferMoneyToDilla,
  getDillaWallet,
  getDillaTransactionHistory,
  dillaToTarget,

  //   transferToMySan,
  //   requestMoney,
} = require("../controllers/dillaWallet");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

router.get("/create-account", protect, createDillaWallet);

router.put("/top-up-account", protect, topUp);

router.put("/dilla-to-dib", protect, dillaToDIB);

router.put("/dilla-to-dream/:id", protect, dillaToTarget);

router.get("/dilla-history", protect, getDillaTransactionHistory);

// router.put("/transfer/:id", transferMoneyToDilla);

// router.put("/transfer-to-san/:id", transferToMySan);

router.get("/get-dilla-wallet", protect, getDillaWallet);

// router.put("/request-money/:id", requestMoney);

module.exports = router;
