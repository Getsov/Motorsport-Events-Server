const { authController } = require("./controllers/authController");

const router = require('express').Router();

router.get('/', (req, res) => {
    res.json({ message: 'Service operational' });
});


router.use('/auth', authController);


module.exports = router;