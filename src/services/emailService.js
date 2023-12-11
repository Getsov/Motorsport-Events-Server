const nodemailer = require('nodemailer');

async function resetPassword(requestBody) {
    // TODO: Try to update the function later, with expired password or magic link..

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