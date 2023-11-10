const Event = require('../models/Event');
const { limitModels } = require('../utils/limitModels');

async function registerEvent() {
    // TODO: make more tests with different values!
    const event = await Event.create({
        shortTitle: 'Race Fanatic',
        longTitle: 'Race Fanatic Race',
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
            region: 'Hisarya',
            address: 'Хайдут Генчо N1',
            phone: '0123456789',
            email: 'peter@abv.bg'
        },
        category: 'Drag',
        likes: ['6542c24b6102c6f4e79108fc', '6542c24b6102c6f4e79108fc', '6542c24b6102c6f4e79108fc'],
        creator: '654cf9e3b9f71701e19215d1',
        winners: [
            { name: 'Pavel', vehicle: "Trabant", place: 1 },
            { name: 'Ivan', vehicle: "Wartburg", place: 2 },
            { name: 'Dragan', vehicle: "Moskvich", place: 3 }
        ],
        visitorPrices:[{price: 15, description: 'Цена за зрители'}]
    });

    return event;
};

async function findEventByID(eventId) {
    // TODO: make more tests with different values!
    const event = await Event.findById(eventId);

    return event;
};

async function findEventsByCategory(category) {
    const events = await Event.find({ category: category });
    return events;
};

async function findAllEvents(page, limit) {
    // TODO: make more tests with different values!
    return await limitModels(Event, page, limit);
};

// TODO: Update the event later!
async function updateEvent(id, listing) {
 console.log("Update");
}


module.exports = {
    registerEvent,
    findEventByID,
    findAllEvents,
    updateEvent,
    findEventsByCategory
}