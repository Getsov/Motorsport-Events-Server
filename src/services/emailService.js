const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const { generatePassword } = require('../utils/generatePassword');

async function resetPassword(requestBody) {
  // TODO: Try to update the function later, with expired password or magic link..
  const existingUser = await User.findOne({ email: requestBody?.to });
  if (!existingUser) {
    throw new Error('User-Email not found!');
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
    subject: 'Password Reset',
    text: `Here is your new password for Race Fanatic app: ${newPassword}`,
  };

  const info = await transporter.sendMail(mailOptions);

  // console.log('Email sent: ' + info.response);
  return info;
}
async function sendUserApprovalEmail(usersList, isApproved) {
  let text = 'Your profile has been approved in Race Fanatic app.';
  let subject = 'Profile approved by Race Fanatic';
  let to = [];

  if (!isApproved) {
    text = 'Your profile has been disapproved in Race Fanatic app.';
    subject = 'Profile dissapproved by Race Fanatic';
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
  let text = `Great news! Your event "${eventName}" has been approved and is now listed in the Race Fanatic app.`;
  let subject = 'Your Event is Live on Race Fanatic!';

  if (!isApproved) {
    text = `We're sorry to inform you that your event "${eventName}"
     did not meet the approval criteria for listing in the Race Fanatic app at this time.
      Please review our guidelines for more details.`;
    subject = 'Important Update on Your Race Fanatic Event Submission';
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
