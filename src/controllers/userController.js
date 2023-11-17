const userController = require('express').Router();
const {
    registerUser,
    loginUser,
    updateUserInfo,
    updateUserEmail,
} = require('../services/userService');

//TODO:  In Future Pavka! Check CORS for requests 'req' authorization, in index.js wich is commented!!!
//TODO: In other words, if you turn on cors in index.js, no file will be returned on the client!

userController.post('/registerUser', async (req, res) => {
    try {
        if (req.body.password !== req.body.repass) {
            throw new Error('Password dismatch!');
        }
        const userData = {
            email: req.body.email,
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            password: req.body.password,
            region: req.body.region ? req.body.region : '',
        };

        const user = await registerUser(userData);
        res.status(200).json(user);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

userController.post('/loginUser', async (req, res) => {
    try {
        const user = await loginUser(req.body.email, req.body.password);
        res.status(200).json(user);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

userController.put('/editUserInfo/:id', async (req, res) => {
    const userId = req.params.id;
    const isAdmin = req.requester.role == 'admin';
    try {
        if (req.requester._id == userId || isAdmin) {
            const result = await updateUserInfo(userId, req.body, isAdmin);
            res.status(200).json(result);
            res.end();
        } else {
            throw new Error('You do not have rights to modify the record!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});
userController.put('/editUserEmail/:id', async (req, res) => {
    const id = req.params.id;
    const isAdmin = req.requester.role == 'admin';

    try {
        if (req.requester._id == id || isAdmin) {
            const result = await updateUserEmail(id, req.body);
            res.status(200).json(result);
            res.end();
        } else {
            throw new Error('You do not have rights to modify the record!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});
userController.put('/editUserPassword/:id', async (req, res) => {
    const id = req.params.id;
    const isAdmin = req.requester.role == 'admin';
    try {
        //TODO - HOW WE MANAGE WITH REPASS?
        // if (req.body.password !== req.body.repass) {
        //   throw new Error('Password dismatch!');
        // }
        if (req.requester._id == id || isAdmin) {
            const result = await updateUser(id, req.body, isAdmin);
            res.status(200).json(result);
            res.end();
        } else {
            throw new Error('You do not have rights to modify the record!');
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    userController,
};
