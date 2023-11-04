const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl';

async function registerUser() {
    /*
    TODO: use next line for real app without hardcore the user

    async function registerUser(username, email, firstName, lastName, password) {

        const existing = await User.findOne({ email });
        if (existing) {
            throw new Error('Email is already taken!!!');
        }

        const user = await User.create({
            username,
            email,
            firstName,
            lastName,
            hashedPassword: await bcrypt.hash(password, 10)
        });
        return createToken(user)

*/

    // TODO: remove hardcore user & password
    let password = 123456789;
    const user = await User.create({
        username: 'Scuderia',
        email: 'Shumaher@gmail.com',
        firstName: 'Michael',
        lastName: 'Schumaher',
        hashedPassword: await bcrypt.hash(password, 10)
    });

    return user;
};

//TODO: With username or with email user will login into the app? Change appropriate 
async function loginUser(email, password) {
    const user = await User.findOne({ email });
    //TODO: check for isDeleted property
    if (!user) {
        throw new Error('Invalid  email or password!!!')
    }

    const match = await bcrypt.compare(password, user.hashedPassword);

    if (!match) {
        throw new Error('Invalid email or password!!!')
    }
    return createToken(user)
}


function createToken(user) {
    const payload = {
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    };
    return {
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        accessToken: jwt.sign(payload, secret)
    }
};

function parseToken(token) {
    try {
        return jwt.verify(token, secret)
    } catch { error } {
        throw new Error('Invalid acces token!')
    }
};

//TODO: parseToken can be exported
module.exports = {
    registerUser,
    loginUser,
    parseToken
}