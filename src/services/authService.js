const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl'



async function registerUser() {

    //TODO: use next line for real app without hardcore the user
    // async function registerUser(username, email, firstName, lastName) {

    //TODO: use next lines for real app
    // const existing = await User.findOne({ email });
    // if(existing){
    //     throw new Error ('Email is already taken!!!');
    // } 



    //TODO: remove hardcore user
    const user = await User.create({
        username: 'Scuderia',
        email: 'Shumaher@gmail.com',
        firstName: 'Michael',
        lastName: 'Schumaher'
    });

    return user;


    //TODO: use next line for real development
    // return createToken(user)
};

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
}


module.exports = {
    registerUser
}