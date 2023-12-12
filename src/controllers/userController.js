const bcrypt = require('bcryptjs');
const userController = require('express').Router();
const {
    registerUser,
    loginUser,
    updateUserInfo,
    updateUserEmail,
    updateUserPassword,
    returnAllCreatedEvents,
    returnAllFavouriteEvents,
    updateUserRole,
} = require('../services/userService');
const { validPassword } = require('../shared/sharedRegex');
const { checkRequestData } = require('../utils/ckeckData');
const { resetPassword } = require('../services/emailService');

userController.post('/registerUser', async (req, res) => {
    try {
        const passwordTest = validPassword.test(req.body.password);
        checkRequestData(req.body);
        if (!passwordTest) {
            throw new Error('Password cannot contain spaces!');
        }
        if (!req.body.password) {
            throw new Error('Password is required!');
        }
        if (req.body.password.length < 6) {
            throw new Error('Password must be at least 6 characters long!');
        }
        if (req.body.password.length > 24) {
            throw new Error('Password must be maximum 24 characters long!');
        }
        if (req.body.password !== req.body.repass) {
            throw new Error('Password dismatch!');
        }
        if (!req.body.email || req.body.email == '') {
            throw new Error('Email is required!');
        }
        if (req.body.role == 'admin') {
            throw new Error('You do not have admin rights!');
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
            if (!req.body.organizatorName || !req.body.phone) {
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
        checkRequestData(req.body);
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
        checkRequestData(req.body);
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
        checkRequestData(req.body);
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
    try {
        checkRequestData(req.body);
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
userController.put('/editUserRole/:id', async (req, res) => {
    const userId = req.params.id;
    const isAdmin = req.requester.role == 'admin';
    try {
        checkRequestData(req.body);
        if (isAdmin) {
            const result = await updateUserRole(userId, req.body);
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

userController.get('/getMyEvents', async (req, res) => {
    const userId = req.requester._id;

    try {
        const result = await returnAllCreatedEvents(userId);
        res.status(200).json(result);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

userController.get('/getMyFavourites', async (req, res) => {
    const userId = req.requester?._id;

    try {
        const result = await returnAllFavouriteEvents(userId);
        res.status(200).json(result);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

// Reset password.
userController.post('/reset-password', async (req, res) => {
    try {
        if (req.body.to === undefined) {
            throw new Error('Email is not passed!')
        }

        const result = await resetPassword(req.body);
        
        res.status(200).json({ message: 'Email sent successfully' });
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

// Unmatched route
userController.use((req, res) => {
    res.status(404).json({ message: 'Route not found or request is not right!' });
});

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
