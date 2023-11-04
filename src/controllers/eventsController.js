const eventController = require('express').Router();
const { registerEvent, findOne, findAll } = require('../services/eventsService');

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

// Get ALL events!
eventController.get('/', async (req, res) => {
    try {
        const event = await findAll();

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get event by ID!
eventController.get('/:id', async (req, res) => {
    try {
        const event = await findOne(req.params.id);

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = {
    eventController
}