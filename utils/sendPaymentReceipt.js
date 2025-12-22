const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER, // usually "apikey"
    pass: process.env.BREVO_SMTP_KEY,
  },
});

const sendPaymentReceipt = async ({
  email,
  payer,
  amount,
  currency,
  method,
  date,
  id,
}) => {
  const html = `
    <div style="font-family: Arial, sans-serif">
      <h2>Payment Receipt</h2>
      <p>Thank you for your payment.</p>

      <table cellpadding="8" cellspacing="0" border="1">
        <tr><td><b>Payment ID</b></td><td>${id}</td></tr>
        <tr><td><b>Payer</b></td><td>${payer}</td></tr>
        <tr><td><b>Amount</b></td><td>${currency} ${amount}</td></tr>
        <tr><td><b>Method</b></td><td>${method}</td></tr>
        <tr><td><b>Date</b></td><td>${date}</td></tr>
      </table>

      <p>If you have any questions, reply to this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Admin Ship" <no-reply@adminship.com>`,
    to: email,
    subject: "Payment Receipt",
    html,
  });
};

module.exports = sendPaymentReceipt;
