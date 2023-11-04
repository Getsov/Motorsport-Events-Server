const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl';

async function registerOrganization(){

        /*
    TODO: use next line for real app without hardcore the organization

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
    let password = 123;
    const organization = await Organization.create({
        name: 'Bardhal',
        email: 'bardhal@gmail.com',
        address: 'Sofiq',
        manager: 'Ivan Ivanov',
        phone: '0899123123',
        createdEvents: [{}],
        isDeleted: false,
        hashedPassword: await bcrypt.hash(password, 10)
    });
    return organization;
}