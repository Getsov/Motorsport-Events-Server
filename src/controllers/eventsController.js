const eventController = require('express').Router();
const { registerEvent } = require('../services/eventsService');

async function registerEvent() {
    const event = await Event.create();
    return event;
};

module.exports = {
    registerEvent
}