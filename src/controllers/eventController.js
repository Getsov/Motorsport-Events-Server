const eventController = require('express').Router();
const {
    registerEvent,
    findEventByID,
    findAllEvents,
    updateEvent,
    likeUnlikeEvent,
    getByMonth,
    getAllEventsForApproval,
    getUpcoming,
} = require('../services/eventService');
const {
    addEventToLikedEvents,
    addEventToCreatedEvents,
} = require('../services/userService');
const { checkRequestData } = require('../utils/checkData');
const { checkDatesAndTime } = require('../utils/checkDatesAndTime');

eventController.get('/eventsForApproval', async (req, res) => {
    try {
        const requesterId = req.requester._id;
        const result = await getAllEventsForApproval(requesterId);
        res.status(200).json(result);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

eventController.post('/register', async (req, res) => {
    try {
        if (req.requester.isApproved === false) {
            throw new Error(
                'This "User" is not approved to register an Event!'
            );
        }
        if (Object.keys(req.body).length === 0) {
            throw new Error('Invalid request Body!');
        }

        // TODO: MORE TEST
        checkDatesAndTime(req.body.dates);

        checkRequestData(req.body);
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

// Upcoming Events
eventController.get('/upcoming', async (req, res) => {
    try {
        const { todayEnd } = getNeededDates();
        console.log(todayEnd);
        const events = await getUpcoming(todayEnd);

        res.status(200).json(events);
        res.end();
    } catch (error) {
        res.status(400).json(error.message);
        res.end();
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
        const idOfCreator = event.creator._id.toLocaleString();
        if (event?.isApproved === false && req.requester?._id !== idOfCreator) {
            throw new Error('This Event is not Approved by Admin!');
        }
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
        if (Object.keys(req.body).length === 0) {
            throw new Error('Invalid request Body!');
        }
        checkDatesAndTime(req.body.dates);
        const event = await findEventByID(req.params.id);
        const creatorId = event?.creator._id.toLocaleString();
        if (
            req.requester?._id !== creatorId &&
            req.requester?.role !== 'admin'
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

eventController.post('/like/:id', async (req, res) => {
    try {
        if (!req.requester) {
            throw new Error('You must log-in to like this Event!');
        }

        const event = await findEventByID(req.params.id);

        if (event?.isApproved === false) {
            throw new Error('This Event is not Approved by Admin!');
        }
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
        const { startDate, endDate } = getNeededDates(
            parseInt(year),
            parseInt(month)
        );

        const events = await getByMonth(startDate, endDate);

        res.status(200).json(events);
        res.end();
    } catch (error) {
        res.status(400).json(error.message);
        res.end();
    }
});


// Unmatched route
eventController.use((req, res) => {
    res.status(404).json({
        message: 'Route not found or request is not right!',
    });
});

module.exports = {
    eventController,
};

// TODO: Add it in utils later!
const getNeededDates = (year, month) => {
    if (month < 1 || month > 12) {
        throw new Error(
            'Invalid month value. Month should be in the range 1-12.'
        );
    }

    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const todayStart = new Date(Date.now());
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(Date.now());
    todayEnd.setHours(23, 59, 59, 999);

    // Check who need to know about local time, and then pass this variables?
    const localStartDate = startDate.toLocaleString();
    const localEndDate = endDate.toLocaleString();

    return { startDate, endDate, todayStart, todayEnd };
};
