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
            coordinates: { lat: '42.52911093579847', long: '24.707900125838766' },
            city: 'Hisarya',
            address: 'Хайдут Генчо N1',
            phone: '0123456789',
            email: 'peter@abv.bg'
        },
        category: 'Off Road',
        likes: ['6542c24b6102c6f4e79108fc', '6542c24b6102c6f4e79108fc', '6542c24b6102c6f4e79108fc'],
        creator: '6542c24b6102c6f4e79108fc',
        winners: [
            { name: 'Pavel', vehicle: "Trabant", place: 1 },
            { name: 'Ivan', vehicle: "Wartburg", place: 2 },
            { name: 'Dragan', vehicle: "Moskvich", place: 3 }
        ],
    });

    return event;
};

async function findOneEvent(eventId) {
    // TODO: make more tests with different values!
    const event = await Event.findById(eventId);

    return event;
};

async function findAllEvents(eventId) {
    // TODO: make more tests with different values!
    const event = await Event.find();

    return event;
};

async function updateEvent(id, listing) {
    const existing = await Listing.findById(id);
    existing.title = listing.title;
    existing.category = listing.category;
    existing.imageUrl = listing.imageUrl;
    existing.price = listing.price;
    existing.description = listing.description;
    return existing.save()
}

module.exports = {
    registerEvent,
    findOneEvent,
    findAllEvents,
    updateEvent
}