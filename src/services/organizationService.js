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
        //This event is copied hardcore event from eventService.js
        //TODO: in created event array they key must be real event _id -> propertie must be the real event
        createdEvents: [{
            title: 'Race Fanatic!',
            shortDescription: 'ala bala',
            longDescription: 'Lorem ipsum dolor sit amet.',
            dates: [{
                startDate: Date.now(),
                startTime: '23:59',
                endTime: '06:40'
            }], // Eventually add another date!
            imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1839940/capsule_616x353.jpg?t=1683123302',
            contacts: {
                coordinates: { lat: '', long: '' },
                city: 'Hisarya',
                address: 'Хайдут Генчо N1',
                phone: '0123456789',
                email: 'peter@abv.bg'
            },
            category: 'Off Road',
            likedCount: 1,
            winners: [{ name: 'Az' }],
            creator: '6542c24b6102c6f4e79108fc'
        }],
        isDeleted: false,
        hashedPassword: await bcrypt.hash(password, 10)
    });
    return organization;
}