const { authController } = require("./controllers/authController");
const { eventController } = require("./controllers/eventsController");

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational..' });
});


router.use('/auth', authController);
router.use('/events', eventController);


module.exports = router;