const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.FROM,
    pass: process.env.PASS,
  },
});

module.exports = transporter;
