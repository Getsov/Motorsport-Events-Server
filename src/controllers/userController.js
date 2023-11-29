const bcrypt = require('bcryptjs');
const userController = require('express').Router();
const {
    registerUser,
    loginUser,
    updateUserInfo,
    updateUserEmail,
    updateUserPassword,
} = require('../services/userService');
const { testRegex } = require('../utils/sharedRegex');

userController.post('/registerUser', async (req, res) => {
    try {
        if (!req.body.password) {
            throw new Error('Password is required!');
        }
        if (req.body.password.length < 8) {
            throw new Error('Password must be at least 8 characters long!');
        }
        if (req.body.password !== req.body.repass) {
            throw new Error('Password dismatch!');
        }
        if (!req.body.email || req.body.email == '') {
            throw new Error('Email is required!');
        }
        /*
        TODO: When someone try to register as admin:
        throw an Error 
        or save record as regular?
        */
        if (req.body.role == 'admin') {
            throw new Error('You do not have admin rights!');
        }
        if (!testRegex(req.body.phone)) {
            throw new Error('Add accurate phone number!');
        }

        const userData = {
            email: req.body.email,
            firstName: req.body.firstName ? req.body.firstName : '',
            lastName: req.body.lastName ? req.body.lastName : '',
            role: req.body.role ? req.body.role : 'regular',
            //TODO: region - as enum from FE
            region: req.body.region ? req.body.region : '',
            // address: req.body.address ? req.body.address : '',
            phone: req.body.phone ? req.body.phone : '',
            hashedPassword: await bcrypt.hash(req.body.password, 10),
        };

        if (req.body.role == 'organizer') {
            if (
                !req.body.organizatorName ||
                !req.body.firstName ||
                !req.body.lastName ||
                !req.body.phone ||
                !req.body.region
            ) {
                throw new Error('Fill all required fields!');
            }
            userData.organizatorName = req.body.organizatorName;
        }

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
//TODO: EDIT USER ROLE ONLY FOR ADMIN

module.exports = {
    userController,
};

/*
Ready user for register: 
    -   "regular":

    "email": "pavel@abv.bg",
    "firstName": "Pavel",
    "lastName": "Dimitrov",
    "region": "Бургас",
    "address": "Някъде в Бургас!",
    "phone": "0888888888",
    "password": "123",
    "repass": "123"
    
*/
