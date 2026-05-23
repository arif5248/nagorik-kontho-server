const nodemailer = require('nodemailer')

const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    text: message,
  })
}

module.exports = sendEmail
