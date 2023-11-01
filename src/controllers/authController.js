const authController = require('express').Router();
const { register } = require('../services/userService');

authController.post('/register', async (req, res) => {
    try {
        const user = await registerUser({ username: 'Michael', email: 'Shumaher' });
        
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})