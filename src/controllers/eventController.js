const eventController = require('express').Router();
const {
    registerEvent,
    findEventByID,
    findAllEvents,
    updateEvent,
    likeUnlikeEvent,
    getByMonth,
} = require('../services/eventService');
const {
    addEventToLikedEvents,
    addEventToCreatedEvents,
} = require('../services/userService');

eventController.post('/register', async (req, res) => {
    try {
        // Checks if there is not user. Or if the user have admin role or if the user is organization.
        if (
            !req.requester ||
            !(
                req.requester.role === 'admin' ||
                req.requester.role === 'organizer'
            )
        ) {
            throw new Error(
                'Only user with role "organizer" or "admin" can register an Event!'
            );
        }

        const event = await registerEvent(req.body, req.requester._id);

        await addEventToCreatedEvents(event._id, req.requester._id);

        res.status(200).json(event);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get ALL events!
eventController.get('/', async (req, res) => {
    try {
        const events = await findAllEvents(req.query);

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
        if (event === null) {
            throw new Error("Event is deleted, or doesn't exist!");
        }
        if (
            event &&
            event.isDeleted === true &&
            req.requester.role != 'admin'
        ) {
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

        if (
            req.requester?._id === undefined ||
            (req.requester._id != event?.creator &&
                req.requester.role !== 'admin')
        ) {
            throw new Error('You are not owner or Admin to modify this Event!');
        }
        if (
            event === null ||
            (req.requester?.role !== 'admin' && event.isDeleted !== false)
        ) {
            throw new Error("Event is deleted, or doesn't exist!");
        }

        const updatedEvent = await updateEvent(
            req.body,
            event,
            req.requester.role === 'admin'
        );

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
            throw new Error("Event is deleted, or doesn't exist!");
        }

        let isAlreadyLiked = false;

        if (event.likes.includes(req.requester._id)) {
            isAlreadyLiked = true;
        }

        const likedEvent = await likeUnlikeEvent(
            event,
            req.requester._id,
            isAlreadyLiked
        );

        await addEventToLikedEvents(
            req.params.id,
            req.requester._id,
            isAlreadyLiked
        );

        res.status(200).json(
            isAlreadyLiked ? 'Event UnLiked!' : 'Event Liked!'
        );
        res.end();
    } catch (error) {
        res.status(400).json(error.message);
        res.end();
    }
});

// Get by Month.
eventController.get('/month/:year/:month', async (req, res) => {
    // TODO: Later add errors for wrong parameters.
    try {
        const { year, month } = req.params;
        const { startDate, endDate } = getMonthRange(parseInt(year), parseInt(month) - 1);


        const events = await getByMonth(startDate, endDate);

        res.status(200).json(events);
        res.end();
    } catch (error) {
        res.status(400).json(error.message);
        res.end();
    }
});

module.exports = {
    eventController,
};

const getMonthRange = (year, month) => {
    if (month < 0 || month > 11) {
        throw new Error('Invalid month value. Month should be in the range 1-12.');
    }
    
    const startDate = new Date(year, month, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month + 1, 0);
    endDate.setHours(23, 59, 59, 999);
    
    // Check who need to know about local time, and then pass this variables?
    const localStartDate = startDate.toLocaleString();
    const localEndDate = endDate.toLocaleString();

    return { startDate, endDate };
}