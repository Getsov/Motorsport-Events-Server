const Event = require('../models/Event');
const { limitModels } = require('../utils/limitModels');

async function registerEvent(requestBody) {
    // TODO: make more tests with different values!
    const event = await Event.create({
        shortTitle: requestBody.shortTitle,
        longTitle: requestBody.longTitle,
        shortDescription: requestBody.shortDescription,
        longDescription: requestBody.longDescription,
        dates: requestBody.dates,
        imageUrl: requestBody.imageUrl,
        contacts: requestBody.contacts,
        category: requestBody.category,
        likes: requestBody.likes,
        creator: requestBody.creator,
        winners: requestBody.winners,
        participantPrices: requestBody.participantPrices,
        visitorPrices: requestBody.visitorPrices
    });

    return event;
};

async function findEventByID(eventId) {
    // TODO: make more tests with different values!
    const event = await Event.findById(eventId);

    return event;
};

async function findEventsByCategory(category) {
    const events = await Event.find({ category: category, isDeleted: false });
    return events;
};

async function findAllEvents(page, limit) {
    // TODO: make more tests with different values!
    return await limitModels(Event, page, limit);
};

// TODO: Update the event later!
async function updateEvent(requestBody, existingEvent, isAdmin) {
    for (let key in requestBody) {
        if (isAdmin && (key === 'creator' || key === 'likes')) {
            existingEvent[key] = requestBody[key];
        } else if (!isAdmin && (key === 'creator' || key === 'likes')) {
            throw new Error('Only Admin can modify this property!');
        }
        if (isAdmin && key === 'isDeleted') {
            existingEvent[key] = requestBody[key];
        } else if (!isAdmin && key === 'isDeleted' && requestBody[key] === true) {
            existingEvent[key] = requestBody[key];
        }

        if (key !== 'toString' && key !== 'creator' && key !== 'likes' && key !== 'isDeleted') {
            existingEvent[key] = requestBody[key];
        }
    }

    return await existingEvent.save();
}

// Like/Unlike event.
async function likeUnlikeEvent(existingEvent, id, isUnlike) {
    if (isUnlike) {
        let filteredLikes = await existingEvent.likes.filter(x => x != id);
        existingEvent.likes = filteredLikes;
        return await existingEvent.save();
    }

    existingEvent.likes.push(id);
    return await existingEvent.save();
}


module.exports = {
    registerEvent,
    findEventByID,
    findAllEvents,
    updateEvent,
    findEventsByCategory,
    likeUnlikeEvent
}