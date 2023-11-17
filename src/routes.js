const { userController } = require('./controllers/userController');
const { eventController } = require('./controllers/eventController');
const {
    organizationController,
} = require('./controllers/organizationController');

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational..' });
});

router.use('/user', userController);
router.use('/organization', organizationController);
router.use('/event', eventController);

//TODO: Error Page (404).
router.get('*', (req, res) => {
    res.status(404).json({ message: 'Page not found!' });
});

module.exports = router;
