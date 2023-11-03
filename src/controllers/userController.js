const userController = require('express').Router();
const { registerUser, loginUser } = require('../services/authService');

//TODO:  In Future Pavka! Check CORS for requests "req" authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!


//TODO: Change request from get => post
userController.get('/register', async (req, res) => {
    // TODO: Check for passwords and token..
    try {
        const user = await registerUser();
        
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//TODO: Change request from get => post
userController.get('/login', async (req, res) => {
    // TODO: Check for passwords and token..
    try {
        const user = await loginUser();
        
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    userController
}