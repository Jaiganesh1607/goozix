const mongoose = require("mongoose");

const UserOTPVerificationSchema =new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt: Date,
    expiresAt: Date
});

module.exports=new mongoose.model("UserOTPVerification",UserOTPVerificationSchema);