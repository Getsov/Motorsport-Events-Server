const { authController } = require("./controllers/authController");
const { eventController } = require("./controllers/eventsController");

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational..' });
});


router.use('/user', userController);
router.use('/organization', organizationController);
router.use('/events', eventController);


module.exports = router;