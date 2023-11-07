const userController = require('express').Router();
const { registerUser, loginUser } = require('../services/userService');

//TODO:  In Future Pavka! Check CORS for requests "req" authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!


//TODO: Change request from get => post
userController.post('/registerUser', async (req, res) => {
    try {
        const user = await registerUser(
            req.body.email,
            req.body.firstName,
            req.body.lastName,
            req.body.city,
            req.body.address,
            req.body.password,
        );
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

userController.post('/loginUser', async (req, res) => {
    // TODO: Check for passwords and token..
    try {
        const user = await loginUser(req.body.email, req.body.password);
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    userController
}