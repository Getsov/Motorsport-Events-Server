const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../utils/parseToken');

async function resetPassword(requestBody) {
    // TODO: Try to update the function later, with expired password or magic link..
    const existingUser = await User.findOne({ email: requestBody.to });
    //TODO: Create user and find it!
    console.log(existingUser); 

    const { to, subject, text } = requestBody;
    console.log(to, subject, text);

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
        subject,
        text
    };

    const info = await transporter.sendMail(mailOptions);

    // console.log('Email sent: ' + info.response);
    return info;
}

module.exports = {
    resetPassword,
};