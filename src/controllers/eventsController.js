const eventController = require('express').Router();
const { registerEvent, findEventByID, findAllEvents, updateEvent, findEventsByCategory } = require('../services/eventsService');

// TODO: Change the request method! and validate iputs when client is ready..
eventController.get('/register', async (req, res) => {
    // TODO: check if the User has admin role.
    try {
        if ((req.user && req.user.role !== 'admin')) {
            throw new Error('Only user with role "Admin" or Organization can register an Event!');
        }

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
        const event = await findAllEvents(req.query.page, req.query.limit);

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get events by category!
eventController.get('/category/:category', async (req, res) => {
    try {
        const events = await findEventsByCategory(req.params.category);

        res.status(200).json(events);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get event by ID!
eventController.get('/:id', async (req, res) => {
    try {
        const event = await findEventByID(req.params.id);

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
        // const foundEvent = await findOneEvent(req.params.id);

        // TODO: To pass the id of the foundEvent and the body of the request!
        const updatedEvent = await updateEvent();

        res.status(200).json(updatedEvent);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = {
    eventController
}