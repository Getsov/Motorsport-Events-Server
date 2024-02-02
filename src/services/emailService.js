const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const { generatePassword } = require('../utils/generatePassword');

async function resetPassword(requestBody) {
  // TODO: Try to update the function later, with expired password or magic link..
  const existingUser = await User.findOne({ email: requestBody?.to });
  if (!existingUser) {
    throw new Error('Потребителският имейл не е намерен!');
  }

  const newPassword = generatePassword();

  existingUser.hashedPassword = await bcrypt.hash(newPassword, 10);

  await existingUser.save();

  const { to } = requestBody;

  const transporter = nodemailer.createTransport({
    host: 'mail.racefanatic.app',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'test@racefanatic.app', // your domain email address
      pass: process.env.EMAIL_PASS, // your password
    },
  });

  const mailOptions = {
    from: 'admin@racefanatic.app',
    to,
    subject: 'Нулиране на парола',
    text: `Ето вашата нова парола за приложението Race Fanatic: ${newPassword}`,
  };

  const info = await transporter.sendMail(mailOptions);

  // console.log('Email sent: ' + info.response);
  return info;
}
async function sendUserApprovalEmail(usersList, isApproved) {
  let text =
    'Поздравления! Вашият профил беше успешно одобрен за приложението Race Fanatic.';
  let subject = 'Добре дошли на борда! Вашият профил в Race Fanatic е одобрен.';
  let to = []; // Assuming this array will be populated with recipient email addresses

  if (!isApproved) {
    text =
      'Съжаляваме, че вашият профил не отговаря на критериите за одобрение за приложението Race Fanatic в момента. Моля, проверете нашите насоки и не се колебайте да кандидатствате отново.';
    subject = 'Review на профила в Race Fanatic: Важно обновление.';
  }

  usersList.forEach((user) => {
    to.push(user.email);
  });

  const transporter = nodemailer.createTransport({
    host: 'mail.racefanatic.app',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'test@racefanatic.app', // your domain email address
      pass: process.env.EMAIL_PASS, // your password
    },
  });

  const mailOptions = {
    from: 'admin@racefanatic.app',
    to,
    subject: subject,
    text: text,
  };

  const info = await transporter.sendMail(mailOptions);

  // console.log('Email sent: ' + info.response);
  return info;
}
//TODO: update reamde
async function sendEventApprovalStatusEmail(userEmail, isApproved, eventName) {
  let text = `Страхотни новини! Вашето събитие "${eventName}" беше одобрено и вече е изброено в приложението Race Fanatic.`;
  let subject = 'Вашето събитие е качено в Race Fanatic!';

  if (!isApproved) {
    text = `Съжаляваме да ви информираме, че вашето събитие "${eventName}"
    не отговаря на критериите за одобрение за включване в приложението Race Fanatic в момента. Моля, прегледайте нашите насоки за повече подробности.`;
    subject = 'Важно обновление относно Вашето събитие в Race Fanatic';
  }

  const transporter = nodemailer.createTransport({
    host: 'mail.racefanatic.app',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'test@racefanatic.app', // your domain email address
      pass: process.env.EMAIL_PASS, // your password
    },
  });

  const mailOptions = {
    from: 'admin@racefanatic.app',
    to: userEmail,
    subject: subject,
    text: text,
  };

  const info = await transporter.sendMail(mailOptions);

  // console.log('Email sent: ' + info.response);
  return info;
}

module.exports = {
  resetPassword,
  sendUserApprovalEmail,
  sendEventApprovalStatusEmail,
};
