const userController = require('express').Router();
const {
    registerUser,
    loginUser,
    updateUserInfo,
    updateUserEmail,
    updateUserPassword,
} = require('../services/userService');

userController.post('/registerUser', async (req, res) => {
    try {
        if (req.body.password !== req.body.repass) {
            throw new Error('Password dismatch!');
        }
        if (!req.body.email || req.body.email == '') {
            throw new Error('Email is necessary!');
        }
        /*
        TODO: When someone try to register as admin:
        throw an Error 
        or save record as regular?
        */
        if (req.body.role == 'admin') {
            throw new Error('You do not have admin rights!');
        }

        const userData = {
            //TODO: TEST if this check is needed
            email: req.body.email,
            organizatorName: req.body.organizatorName
                ? req.body.organizatorName
                : '',
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            role: req.body.role ? req.body.role : 'regular',
            //TODO: region - as enum from FE
            region: req.body.region ? req.body.region : '',
            address: req.body.address ? req.body.address : '',
            phone: req.body.phone ? req.body.phone : '',
            password: req.body.password,
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
    const userId = req.params.id;
    const isAdmin = req.requester.role == 'admin';

    try {
        if (req.requester._id == userId || isAdmin) {
            const result = await updateUserEmail(userId, req.body);
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
    const userId = req.params.id;
    const isAdmin = req.requester.role == 'admin';
    //TODO: Is admin can change user password?
    try {
        if (req.body.newPassword !== req.body.newRepass) {
            throw new Error('Password dismatch!');
        }

        if (req.requester._id == userId || isAdmin) {
            const result = await updateUserPassword(userId, req.body, isAdmin);
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



/*
Ready user for register
    "email": "pavel@abv.bg",
    "organizatorName": "Suzuki Burgas",
    "firstName": "Pavel",
    "lastName": "Dimitrov",
    "region": "Бургас",
    "address": "Някъде в Бургас!",
    "phone": "0888888888",
    "password": "123",
    "repass": "123",
*/