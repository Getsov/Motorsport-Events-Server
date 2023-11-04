const Event = require('../models/Event');

async function registerEvent() {
    // TODO: make more tests with different values!
    const event = await Event.create({
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
            coordinates: { lat: 'sda', long: 'sad' },
            city: 'Hisarya',
            address: 'Хайдут Генчо N1',
            phone: '0123456789',
            email: 'peter@abv.bg'
        },
        category: 'Off Road',
        winners: [{ name: 'Az' }],
        creator: '6542c24b6102c6f4e79108fc'
    });

    return event;
};

module.exports = {
    registerEvent
}