const eventController = require('express').Router();
const { registerEvent, findEventByID, findAllEvents, updateEvent, findEventsByCategory, likeUnlikeEvent } = require('../services/eventsService');

// TODO: Change the request method! and validate iputs when client is ready..
eventController.post('/register', async (req, res) => {
    try {
        // Checks if there is not user. Or if the user have admin role or if the user is organization.
        if (!req.requester || !(req.requester.role === 'admin' || req.requester.managerFirstName !== undefined)) {
            throw new Error('Only user with role "Admin", or Organization can register an Event!');
        }
        console.log(req.requester);
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
        const event = await findEventByID(req.params.id);
        if (event === null) {
            throw new Error("Event doesn't exist!");
        }
        // Check if there is requester and this requester is Admin, or Organization which owns the event.
        if (req.requester._id === undefined || req.requester._id != event.creator) {
            throw new Error('You are not owner or Admin to modify this Event!');
        }

        const updatedEvent = await updateEvent(req.body, event);

        res.status(200).json(updatedEvent);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Like/Unlike Event!
eventController.post('/like/:id', async (req, res) => {
    try {
        if (!req.requester) {
            throw new Error('You must log-in to like this Event!');
        }

        const existing = await findEventByID(req.params.id);

        if (existing === null) {
            throw new Error('The Event doesn\'t exist!');
        }
        
        let isUnlike = false;

        if (existing.likes.includes(req.requester._id)) {
            isUnlike = true;
        }
        
        const likedEvent = await likeUnlikeEvent(existing, req.requester._id, isUnlike);
        
        res.status(200).json(isUnlike ? 'Event Unliked!': 'Event Liked!');
        res.end();
    } catch (error) {
        res.status(400).json(error.message);
        res.end();
    }
});



module.exports = {
    eventController
}