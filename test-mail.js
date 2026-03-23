import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_APP_PASSWORD,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer error:", error);
    process.exit(1);
  } else {
    console.log("Nodemailer is ready to take our messages");
    process.exit(0);
  }
});
