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

async function sendWhenApproveDisapproveUsers(usersList, isApproved) {
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
async function sendWhenApproveDisapproveEvent(
  userEmail,
  isApproved,
  eventName
) {
  let text =
    'Your event "' + eventName + '" has been approved in Race Fanatic app';
  let subject = 'Event approved by Race Fanatic';

  if (!isApproved) {
    text =
      'Your event "' + eventName + '" has been disapproved in Race Fanatic app';
    subject = 'Event dissapproved by Race Fanatic';
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
  sendWhenApproveDisapproveUsers,
  sendWhenApproveDisapproveEvent,
};
