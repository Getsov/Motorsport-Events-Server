const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../utils/parseToken');

async function registerUser(requestBody) {
    const email = requestBody.email;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.isDeleted == true) {
            throw new Error(
                'This account has been deleted, please contact support'
            );
        } else {
            throw new Error('Email is already taken!!!');
        }
    }

    const user = await User.create({
        email: requestBody.email,
        organizator: req.body.organizator,
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        region: requestBody.region,
        address: requestBody.address,
        phone: requestBody.phone,
        hashedPassword: await bcrypt.hash(requestBody.password, 10),
    });
    return createToken(user);
}

async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password!!!');
    }
    if (user.isDeleted == true) {
        throw new Error(
            'This account has been deleted, please contact support'
        );
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if (!match) {
        throw new Error('Invalid email or password!!!');
    }
    return createToken(user);
}


//updateUser can be invoked by adminController and userController
//accept id of user which will be updated, new data and isAdmin property
async function updateUserInfo(userId, requestBody, isAdmin) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found');
    }

    //TODO - check functionality with liked events
    for (let key of Object.keys(requestBody)) {
        if (
            key == 'email' ||
            key == 'role' ||
            key == 'likedEvents' ||
            key == 'hashedPassword' ||
            key == 'isDeleted'
        ) {
            continue;
        }
        existingUser[key] = requestBody[key];
    }

    if (isAdmin) {
        existingUser.role = requestBody.role
            ? requestBody.role
            : existingUser.role;
        //isDeleted must be sent as string
        existingUser.isDeleted = requestBody.isDeleted
            ? requestBody.isDeleted
            : existingUser.isDeleted;
    }
    const newRecord = await existingUser.save();
    return createToken(newRecord);
}

async function updateUserEmail(userId, requestBody) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found!');
    }

    if (requestBody.email == '') {
        throw new Error("Email field can't be empty!");
    }

    existingUser.email = requestBody.email;
    const newRecord = await existingUser.save();
    return createToken(newRecord);
}

async function updateUserPassword(userId, requestBody, isAdmin) {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
        throw new Error('User not found!');
    }

    if (!isAdmin) {
        const match = await bcrypt.compare(
            requestBody.oldPassword,
            existingUser.hashedPassword
        );
        if (!match) {
            throw new Error('Password dismatch!');
        }
    }

    existingUser.hashedPassword = await bcrypt.hash(
        requestBody.newPassword,
        10
    );
    const newRecord = await existingUser.save();
    return createToken(newRecord);
}

async function addEventToLikedEvents(eventId, userId, isUnlike) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found!');
    }

    if (existingUser.likedEvents.includes(eventId) && isUnlike) {
        let filteredLikes = await existingUser.likedEvents.filter(
            (x) => x != eventId
        );
        existingUser.likedEvents = filteredLikes;
        return await existingUser.save();
    } else if (!existingUser.likedEvents.includes(eventId) && !isUnlike) {
        existingUser.likedEvents.push(eventId);
        return await existingUser.save();
    } else {
        //TODO: not sure for this check
        throw new Error('User already liked this event!');
    }
}

function createToken(user) {
    const payload = {
        _id: user.id,
        email: user.email,
        organizator:user.organizator,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        region: user.region,
        address: user.address,
        phone:user.phone,
    };
    return {
        _id: user.id,
        email: user.email,
        organizator:user.organizator,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        region: user.region,
        address: user.address,
        phone:user.phone,
        isDeleted: user.isDeleted,
        accessToken: jwt.sign(payload, secret),
    };
}

module.exports = {
    registerUser,
    loginUser,
    updateUserInfo,
    updateUserEmail,
    updateUserPassword,
    addEventToLikedEvents,
};
