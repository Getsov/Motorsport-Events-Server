const { userController } = require('./controllers/userController');
const { eventController } = require('./controllers/eventController');
const { emailController } = require('./controllers/emailController');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational..' });
});

router.use('/user', userController);
router.use('/events', eventController);
router.use('/email', emailController);

// Error Page (404).
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found!' });
});

module.exports = router;
