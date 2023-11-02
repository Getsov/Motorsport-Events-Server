const Event = require('../models/Event');

async function registerEvent() {
    const event = await Event.create({ eventName: 'Race Fanatics' });
    return event;
};

module.exports = {
    registerEvent
}