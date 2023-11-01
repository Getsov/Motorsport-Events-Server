const authController = require('express').Router();
const { registerUser } = require('../services/authService');

authController.post('/register', async (req, res) => {
    try {
        const user = await registerUser();
        
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});