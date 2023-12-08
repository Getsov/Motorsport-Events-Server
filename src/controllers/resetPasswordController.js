const resetPasswordController = require('express').Router();
const nodemailer = require('nodemailer');


resetPasswordController.post('/', async (req, res) => {
    try {
        const { to, subject, text } = req.body;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'racefanatictest@gmail.com',
                pass: 'racefanatic123',
            },
        });

        const mailOptions = {
            from: 'racefanatictest@gmail.com',
            to,
            subject,
            text,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        res.status(200).send('Email sent successfully');
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    resetPasswordController,
};