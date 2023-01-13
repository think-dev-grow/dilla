const express = require("express");

const {
  createSanAccount,
  getSanAccount,
} = require("../controllers/sanAccount");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

router.get("/create-account", protect, createSanAccount);

router.get("/get-san-account", protect, getSanAccount);

module.exports = router;
