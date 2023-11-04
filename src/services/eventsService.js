const Event = require('../models/Event');

async function registerEvent() {
    // TODO: make more tests with different values!
    const event = await Event.create({
        title: 'Race Fanatic',
        shortDescription: 'ala bala',
        longDescription: 'Lorem ipsum dolor sit amet.',
        dates: [{
            startDate: Date.now(),
            startTime: '23:59',
            endTime: '06:40'
        }],
        imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1839940/capsule_616x353.jpg?t=1683123302',
        contacts: {
            coordinates: { coordinates: [42.52911093579847, 24.707900125838766] },
            city: 'Hisarya',
            address: 'Хайдут Генчо N1',
            phone: '0123456789',
            email: 'peter@abv.bg'
        },
        category: 'Off Road',
        likedCount: ['6542c24b6102c6f4e79108fc', '6542c24b6102c6f4e79108fc'],
        creator: '6542c24b6102c6f4e79108fc',
        winners: [
            { name: 'Pavel', vehicle: "Trabant" },
            { name: 'Pavel', vehicle: "Trabant" },
            { name: 'Pavel', vehicle: "Trabant" }
        ],
    });

    return event;
};

async function findOne(eventId) {
    // TODO: make more tests with different values!
    const event = await Event.findById(eventId);

    return event;
};

async function findAll(eventId) {
    // TODO: make more tests with different values!
    const event = await Event.find();

    return event;
};

module.exports = {
    registerEvent,
    findOne,
    findAll,
}