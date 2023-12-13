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
            throw new Error('Email is already taken!');
        }
    }

    const user = await User.create(requestBody);
    return createToken(user);
}

async function loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password!');
    }
    if (user.isDeleted == true) {
        throw new Error(
            'This account has been deleted, please contact support'
        );
    }

    // Validate user when login
    const validateUser = user.validateSync();
    if (validateUser) {
        throw new Error('User data validation failed!');
    }
    if (user.role == 'organizer') {
        if (user.organizatorName == '' || user.phone == '') {
            throw new Error('User data validation failed!');
        }
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if (!match) {
        throw new Error('Invalid email or password!');
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
    if (existingUser.role == 'organizer') {
        if (existingUser.organizatorName == '') {
            throw new Error('Name of organization is required');
        }
        if (existingUser.phone == '') {
            throw new Error('Phone is required');
        }
    }

    for (let key of Object.keys(requestBody)) {
        if (
            key == 'email' ||
            key == 'role' ||
            key == 'likedEvents' ||
            key == 'createdEvents' ||
            key == 'hashedPassword' ||
            key == 'isDeleted'
        ) {
            continue;
        }
        existingUser[key] = requestBody[key];
    }

    if (isAdmin) {
        'isDeleted' in requestBody
            ? (existingUser.isDeleted = requestBody.isDeleted)
            : (existingUser.isDeleted = existingUser.isDeleted);
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

async function updateUserRole(userId, requestBody) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found');
    }
    if (requestBody.role == 'organizer') {
        if (existingUser.organizatorName == '' && existingUser.phone == '') {
            if (!requestBody.organizatorName || !requestBody.phone) {
                throw new Error('Fill all required fields!');
            }
            existingUser.organizatorName = requestBody.organizatorName;
            existingUser.phone = requestBody.phone;
        }
    }
    existingUser.role = requestBody.role;

    const newRecord = await existingUser.save();
    return createToken(newRecord);
}

async function addEventToLikedEvents(eventId, userId, isAlreadyLiked) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found!');
    }

    if (existingUser.likedEvents.includes(eventId) && isAlreadyLiked) {
        let filteredLikes = await existingUser.likedEvents.filter(
            (x) => x != eventId
        );
        existingUser.likedEvents = filteredLikes;
        return await existingUser.save();
    }

    existingUser.likedEvents.push(eventId);
    return await existingUser.save();
}

async function addEventToCreatedEvents(eventId, userId) {
    eventId = eventId.toString();
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found!');
    }

    //TODO: Fot future development:
    //check if this event is already addded to particular "organizer";
    // if (existingUser.createdEvents.includes(eventId) ) {
    //     throw new Error('This event is already created by the user!');
    // }

    existingUser.createdEvents.push(eventId);
    return await existingUser.save();
}
async function returnAllCreatedEvents(userId) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found!');
    }
    const userWithEvents = await existingUser.populate('createdEvents');
    const allCreatedEvents = userWithEvents.createdEvents;
    //return empty array if there is no createdEvents by current user
    if (allCreatedEvents.length === 0) {
        return allCreatedEvents;
    } else {
        return allCreatedEvents;
    }
}

async function returnAllFavouriteEvents(userId) {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new Error('User not found!');
    }
    const userWithEvents = await existingUser.populate('likedEvents');
    const allFavouriteEvents = userWithEvents.likedEvents;
    //return empty array if there is no createdEvents by current user
    if (allFavouriteEvents.length === 0) {
        return allFavouriteEvents;
    } else {
        return allFavouriteEvents;
    }
}

function createToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        organizatorName: user.organizatorName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        region: user.region,
        // address: user.address,
        phone: user.phone,
        isDeleted: user.isDeleted,
    };

    return {
        _id: user._id,
        email: user.email,
        organizatorName: user.organizatorName,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        region: user.region,
        // address: user.address,
        phone: user.phone,
        isDeleted: user.isDeleted,
        accessToken: jwt.sign(payload, secret, { expiresIn: '24h' }),
    };
}

module.exports = {
    registerUser,
    loginUser,
    updateUserInfo,
    updateUserEmail,
    updateUserPassword,
    updateUserRole,
    addEventToLikedEvents,
    addEventToCreatedEvents,
    returnAllCreatedEvents,
    returnAllFavouriteEvents,
};
