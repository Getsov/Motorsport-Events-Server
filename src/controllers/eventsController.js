const eventController = require('express').Router();
const { registerEvent } = require('../services/eventsService');

// TODO: Change the request method! and validate iputs when client is ready..
eventController.get('/register', async (req, res) => {
    try {
        const event = await registerEvent();
        
        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = {
    eventController
}