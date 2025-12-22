const nodemailer = require("nodemailer");

const sendReply = async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    await transporter.sendMail({
      from: `"Admin Support" <support@yourdomain.com>`,
      to,
      subject: `Re: ${subject}`,
      text: body,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Reply Email Error:", err);
    res.status(500).json({ success: false });
  }
};

module.exports = { sendReply };
