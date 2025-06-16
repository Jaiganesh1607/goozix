
const nodemailer = require("nodemailer");


var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a0eacdd343b73a",
    pass: "8612a203052b42"
  }
});

const sendEmail = async ({ sendTo, subject, html }) => {
  const mailOptions = {
    from: '"Goozix Support" <noreply@goozix.dev>',
    to: sendTo,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;

//using sendGrid

/*require('dotenv').config(); 
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ sendTo, subject, html }) => {
  const msg = {
    to: sendTo,
    from: process.env.FROM_EMAIL,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent to', sendTo);
  } catch (error) {
    console.error('SendGrid error:', error.response?.body || error.message);
    throw new Error('Email could not be sent');
  }
};
module.exports = sendEmail;
*/

