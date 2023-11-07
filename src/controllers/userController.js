const userController = require('express').Router();
const { registerUser, loginUser } = require('../services/userService');

//TODO:  In Future Pavka! Check CORS for requests "req" authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!

userController.post('/registerUser', async (req, res) => {
    // console.log(req.body.email);
    try {
        const userData = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
        };

        if (req.body.city) {
            userData.city = req.body.city;
        }
        const user = await registerUser(userData);
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

userController.post('/loginUser', async (req, res) => {
    try {
        const user = await loginUser(req.body.email, req.body.password);
        res.status(200).json(user);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    userController
}