const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function registerUser() {
    const user = await User.create({
        username: 'Scuderia',
        email: 'Shumaher@gmail.com',
        firstName: 'Michael',
        lastName: 'Schumaher'
    });
    return user;
};

function createToken(user) {
    const payload = {
        _id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName
    }
}


module.exports = {
    registerUser
}