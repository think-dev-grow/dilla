const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    kodeHex: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
      unique: true,
      required: [true, "Please add a email"],
      match: [
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },
    firstname: { type: String, default: "", trim: true },
    lastname: { type: String, default: "", trim: true },
    contact: { type: String, default: "+234", trim: true },
    password: {
      type: String,
      default: "",
      trim: true,
    },
    platform: { type: String, default: "Ardilla" },
    photo: { type: String, default: "" },
    bvn: { type: String, default: "", trim: true },
    isAdmin: { type: Boolean, default: false },
    logStamp: { type: Number, default: null },
    dhid: { type: String, default: "" },
    uid: { type: String, default: "" },
    securityQusetion: { type: Object },
    idFrontStatus: { type: String, default: "" },
    idBackStatus: { type: String, default: "" },
    utilityBillStatus: { type: String, default: "" },
    nextOfKin: { type: Object },
    referral: { type: Object, default: "" },
    ipAddress: { type: String, default: "" },
    verified: { type: String, default: "activated" },
    kyc: { type: Object, default: {} },
    logDetails: { type: Object },
    kycPoints: { type: Number, default: 0 },
    transactionPin: { type: String, default: "", trim: true },
    mobilePinId: { type: String, default: "" },
    emailOTP: { type: String, default: "" },
    halaal: { type: Boolean, default: false },
    visibility: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
