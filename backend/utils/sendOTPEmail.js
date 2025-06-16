const sendEmail = require("../config/sendEmail.js");
const UserOTPverification = require("../models/UserOTPverification.js");
const bcrypt = require('bcryptjs');

const sendOTPEmail = async ({ __id, name, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);

    const newOTPVerification = new UserOTPverification({
      userId: __id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOTPVerification.save();

    await sendEmail({
      sendTo: email,
      subject: "Email Verification from Goozix",
      html: verifyEmailTemplate(name, otp),
    });

    return {
      success: true,
      data: {
        userId: __id,
        email,
      },
    };
  } catch (error) {
    console.log("sendOTPEmail error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

const verifyEmailTemplate = (name, otp) => {
  return `
<p>Dear ${name},</p>    
<h3>Thank you for registering with Goozix.</h3>
<p>Enter this OTP to verify your email and complete registration:</p>
<h2>${otp}</h2>
<p>This OTP expires in 1 hour.</p>
`;
};

module.exports = sendOTPEmail;
