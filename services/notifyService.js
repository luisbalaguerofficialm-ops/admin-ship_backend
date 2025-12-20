import nodemailer from "nodemailer";
import twilio from "twilio";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export const sendEmail = async (to, subject, message) => {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html: message,
  });
};

export const sendSMS = async (to, message) => {
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_FROM,
    to,
  });
};
