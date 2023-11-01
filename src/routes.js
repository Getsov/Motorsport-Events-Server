
const User = require('./models/User');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational' });
});

router.get('/auth', async (req, res) => {
    try {
        const user = await User.create({ username: 'Michael', email: 'Shumaher' });
        res.status(201).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;