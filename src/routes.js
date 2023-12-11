const { userController } = require('./controllers/userController');
const { eventController } = require('./controllers/eventController');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational..' });
});

router.use('/user', userController);
router.use('/events', eventController);

// Error Page (404).
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found or request is not right!' });
});

module.exports = router;
