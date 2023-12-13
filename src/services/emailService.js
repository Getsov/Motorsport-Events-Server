const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generatePassword } = require('../utils/generatePassword');

async function resetPassword(requestBody) {
    // TODO: Try to update the function later, with expired password or magic link..
    const existingUser = await User.findOne({ email: requestBody.to });

    if (!existingUser) {
        throw new Error('User-Email not found!');
    }

    const newPassword = generatePassword();

    existingUser.hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    const newRecord = await existingUser.save();

    const { to } = requestBody;

    //TODO: Check if provided emails is actual email!
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hristopturs@gmail.com',
            pass: process.env.SENDER_EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: 'hristopturs@gmail.com',
        to,
        subject: 'Password Reset',
        text: `Here is your new password for Race Fanatic app: ${newPassword}`
    };

    const info = await transporter.sendMail(mailOptions);

    // console.log('Email sent: ' + info.response);
    return info;
}

module.exports = {
    resetPassword,
};