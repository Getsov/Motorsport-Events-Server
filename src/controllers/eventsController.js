const eventController = require('express').Router();
const { registerEvent, findOneEvent, findAllEvents, updateEvent } = require('../services/eventsService');

// TODO: Change the request method! and validate iputs when client is ready..
eventController.get('/register', async (req, res) => {
    // TODO: check if the User has admin role.
    try {
        const event = await registerEvent();
        
        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get ALL events!
eventController.get('/', async (req, res) => {
    try {
        const event = await findAllEvents();

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get event by ID!
eventController.get('/:id', async (req, res) => {
    try {
        const event = await findOneEvent(req.params.id);

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update event by ID!
eventController.put('/:id', async (req, res) => {
    try {
        // TODO: Update according to some conditions later!
        // const event = await findOneEvent(req.params.id);

        const updatedEvent = await updateEvent();

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




module.exports = {
    eventController
}