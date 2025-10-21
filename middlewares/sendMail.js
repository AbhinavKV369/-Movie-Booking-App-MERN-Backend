import nodeMailer from "nodemailer";

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_PASSWORD,
  },
});

export default transporter;
