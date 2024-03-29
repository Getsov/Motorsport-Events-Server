const eventController = require('express').Router();
const {
  registerEvent,
  findEventByID,
  getAllOrFilteredEventsWithFavorites,
  updateEvent,
  likeUnlikeEvent,
  getEventsByMonth,
  getAllEventsForApproval,
  getPastEvents,
  getUpcomingEvents,
  deleteRestoreEvent,
  approveDisapproveEvent,
  getAllDeletedEvents,
} = require('../services/eventService');
const {
  addRemoveLikedEvent,
  addEventToCreatedEvents,
} = require('../services/userService');
const { checkRequestData } = require('../utils/checkData');
const { checkDatesAndTime } = require('../utils/checkDatesAndTime');
const { getNeededDates } = require('../utils/getNeededDates');

eventController.get('/eventsForApproval', async (req, res) => {
  try {
    const requesterId = req.requester?._id;

    if (!requesterId) {
      throw new Error('Липсва идентификаторът "_id" на потребителя!');
    }

    const result = await getAllEventsForApproval(requesterId);

    res.status(200).json(result);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

eventController.post('/register', async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error('Невалидно тяло (body) на заявката!');
    }

    checkDatesAndTime(req.body.dates);

    checkRequestData(req.body);

    const event = await registerEvent(req.body, req.requester?._id);
    await addEventToCreatedEvents(event._id, req.requester?._id);

    res.status(200).json(event);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upcoming Events
eventController.get('/upcomingEvents', async (req, res) => {
  try {
    const events = await getUpcomingEvents(req.query);

    res.status(200).json(events);
    res.end();
  } catch (error) {
    res.status(400).json(error.message);
    res.end();
  }
});

// Past events
eventController.get('/pastEvents', async (req, res) => {
  try {
    const events = await getPastEvents(req.query);

    res.status(200).json(events);
    res.end();
  } catch (error) {
    res.status(400).json(error.message);
    res.end();
  }
});

eventController.get('/deletedEvents', async (req, res) => {
  try {
    const requesterId = req.requester?._id;
    if (!requesterId) {
      throw new Error('Влезте в профила си!');
    }
    const result = await getAllDeletedEvents(req.query, requesterId);
    res.status(200).json(result);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

// Get ALL events!
eventController.get('/', async (req, res) => {
  try {
    req.query.sort = 'allEvents';
    const events = await getAllOrFilteredEventsWithFavorites(req.query);

    res.status(200).json(events);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get event by ID!
eventController.get('/:id', async (req, res) => {
  try {
    const eventId = req.params?.id;

    if (eventId === ',' || eventId === '{id}') {
      throw new Error('Липсва идентификаторът "id" на събитието!');
    }

    const event = await findEventByID(eventId, req.requester?._id);

    if (event === null) {
      throw new Error('Събитието е изтрито или не съществува!');
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
    const eventId = req.params?.id;

    if (eventId === ',' || eventId === '{id}') {
      throw new Error('Липсва идентификаторът "id" на събитието!');
    }

    if (Object.keys(req.body).length === 0) {
      throw new Error('Невалидно тяло (body) на заявката!');
    }

    if (req.body.dates) {
      checkDatesAndTime(req.body.dates);
    }

    const event = await findEventByID(eventId, req.requester?._id);

    const updatedEvent = await updateEvent(req.body, event, req.requester?._id);

    res.status(200).json(updatedEvent);
    res.end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

eventController.put('/deleteRestoreEvent/:id', async (req, res) => {
  try {
    const eventId = req.params?.id;

    if (eventId === ',' || eventId === '{id}') {
      throw new Error('Липсва идентификаторът "id" на събитието!');
    }

    const event = await deleteRestoreEvent(
      req.params?.id,
      req.requester?._id,
      req?.body
    );

    if (event?.isDeleted) {
      res.status(200).json('Събитието е успешно изтрито!');
      res.end();
    } else {
      res.status(200).json('Събитието е успешно възстановено!');
      res.end();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

eventController.put('/approveDisapproveEvent/:id', async (req, res) => {
  try {
    const eventId = req.params?.id;

    if (eventId === ',' || eventId === '{id}') {
      throw new Error('Липсва идентификаторът "id" на събитието!');
    }

    const event = await approveDisapproveEvent(
      eventId,
      req.requester?._id,
      req?.body
    );

    if (event?.isApproved) {
      res.status(200).json('Събитието е успешно одобрено!');
      res.end();
    } else {
      res.status(200).json('Събитието е успешно неодобрено!');
      res.end();
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

eventController.post('/like/:id', async (req, res) => {
  try {
    const eventId = req.params?.id;

    if (eventId === ',' || eventId === '{id}') {
      throw new Error('Липсва идентификаторът "id" на събитието!');
    }

    if (!req.requester) {
      throw new Error(
        'Трябва да влезете в системата, за да харесате това събитие!'
      );
    }

    const event = await findEventByID(req.params.id, req.requester?._id);

    if (event?.isApproved === false) {
      throw new Error('Това събитие не е одобрено от администратора!');
    }
    if (event === null || event.isDeleted) {
      throw new Error('Събитието е изтрито!');
    }

    let isAlreadyLiked = false;

    if (event.likes.includes(req.requester._id)) {
      isAlreadyLiked = true;
    }

    await likeUnlikeEvent(event, req.requester._id, isAlreadyLiked);

    await addRemoveLikedEvent(req.params.id, req.requester._id, isAlreadyLiked);

    res.status(200).json(isAlreadyLiked ? 'Event UnLiked!' : 'Event Liked!');
    res.end();
  } catch (error) {
    res.status(400).json(error.message);
    res.end();
  }
});

// Get by Month.
eventController.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const { startDate, endDate } = getNeededDates(
      parseInt(year),
      parseInt(month)
    );

    const events = await getEventsByMonth(startDate, endDate);

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
    message: 'Пътят не е намерен или заявката не е коректна!',
  });
});

module.exports = {
  eventController,
};
