const Event = require('../models/Event');

async function registerEvent() {
    const event = await Event.create({ 
        title: 'Race Fanatics',
        description: 'ala bala',
        date: '2023-12-31',
        time: '23:59',
        eventLocation: 'Nqkude si..'
    });

    return event;
};

module.exports = {
    registerEvent
}