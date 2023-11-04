const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl';

async function registerOrganization(){
    let password = 123;
    const organization = await Organization.create({
        name: 'Bardhal',
        email: 'bardhal@gmail.com',
        location: 'Sofiq',
        manager: 'Ivan Ivanov',
        phone: '0899123123',
        hashedPassword: await bcrypt.hash(password, 10)
    })
}