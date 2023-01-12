const express = require("express");
const router = express.Router();

const {
  getUser,
  profileImage,
  nextOfKin,
  uploadIdFront,
  uploadIdBack,
  uploadUtilityBill,
  changePassword,
  changePin,
  updateUser,
  generateAccount,
} = require("../controllers/user");

const protect = require("../middlewares/authMiddleware");

const { upload } = require("../utils/fileUpload");

router.get("/get-user", protect, getUser);

router.post("/profile-pic", protect, upload.single("image"), profileImage);

router.put("/next-of-kin", protect, nextOfKin);

router.put("/generate-account", protect, generateAccount);

router.put("/change-password", protect, changePassword);

router.put("/change-pin", protect, changePin);

router.put("/update-user", protect, updateUser);

router.post("/id-front", protect, upload.single("image"), uploadIdFront);

router.post("/id-back", protect, upload.single("image"), uploadIdBack);

router.post(
  "/utility-bill",
  protect,
  upload.single("image"),
  uploadUtilityBill
);

module.exports = router;
