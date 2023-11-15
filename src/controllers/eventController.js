const eventController = require('express').Router();
const { registerEvent, findEventByID, findAllEvents, updateEvent, findEventsByCategory, likeUnlikeEvent } = require('../services/eventService');

eventController.post('/register', async (req, res) => {
    try {
        // Checks if there is not user. Or if the user have admin role or if the user is organization.
        if (!req.requester || !(req.requester.role === 'admin' || req.requester.managerFirstName !== undefined)) {
            throw new Error('Only user with role "Admin", or Organization can register an Event!');
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
        
        if (event && event.isDeleted === true && req.requester.role != 'admin') {
            throw new Error("Event is deleted, or doesn't exist!");
        }

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

        if (event === null || (req.requester.role !== 'admin' && event.isDeleted !== false)) {
            throw new Error('Event is deleted, or doesn\'t exist!');
        }        

        if (req.requester._id === undefined || (req.requester._id != event.creator && req.requester.role !== 'admin')) {
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

        const event = await findEventByID(req.params.id);
        // TODO: Add like ref to user and organization Models.
        if (event === null || event.isDeleted) {
            throw new Error('Event is deleted, or doesn\'t exist!');
        }

        let isUnlike = false;

        if (event.likes.includes(req.requester._id)) {
            isUnlike = true;
        }

        const likedEvent = await likeUnlikeEvent(event, req.requester._id, isUnlike);

        res.status(200).json(isUnlike ? 'Event UnLiked!' : 'Event Liked!');
        res.end();
    } catch (error) {
        res.status(400).json(error.message);
        res.end();
    }
});



module.exports = {
    eventController
}