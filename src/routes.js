const { userController } = require("./controllers/userController");
const { eventController } = require("./controllers/eventsController");
const { organizationController } = require("./controllers/organizationController");

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational..' });
});


router.use('/user', userController);
router.use('/organization', organizationController);
router.use('/events', eventController);


// Error Page
router.get('*', (req, res) => {
    res.status(404).json({ message: 'Page not found!' });
});


module.exports = router;