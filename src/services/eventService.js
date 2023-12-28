const Event = require('../models/Event');
const User = require('../models/User');
const { categories } = require('../shared/categories');
const { regions } = require('../shared/regions');
const { limitModels } = require('../utils/limitModels');

async function registerEvent(requestBody, requesterId) {
    // TODO: make more tests with different values!
    const event = await Event.create({
        shortTitle: requestBody.shortTitle,
        longTitle: requestBody.longTitle,
        shortDescription: requestBody.shortDescription,
        longDescription: requestBody.longDescription,
        dates: requestBody.dates.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        ),
        imageUrl: requestBody.imageUrl,
        contacts: requestBody.contacts,
        category: requestBody.category,
        likes: requestBody.likes,
        creator: requesterId,
        winners: requestBody.winners,
        participantPrices: requestBody.participantPrices,
        visitorPrices: requestBody.visitorPrices,
    });

    return event;
}

async function findEventByID(eventId) {
    const event = await Event.findById(eventId).populate('creator');
    if (event?.isDeleted === true) throw new Error('This event is deleted!');

    return event;
}

async function findAllEvents(query) {
    // TODO: In later stage we mmay want to search by Organizer Name?
    const page = query.page;
    const limit = query.limit;
    const criteria = {
        isDeleted: false,
        isApproved: true,
    };

    if (query.category) {
        criteria.category = {
            $in: Array.isArray(query.category)
                ? query.category.map((key) => categories[key])
                : [categories[query.category]],
        };
    }
    if (query.region) {
        criteria['contacts.region'] = {
            $in: Array.isArray(query.region)
                ? query.region.map((key) => regions[key])
                : [regions[query.region]],
        };
    }
    if (query.search) {
        criteria.$or = [
            {
                shortTitle: {
                    $regex: query.search.toLowerCase(),
                    $options: 'i',
                },
            },
            {
                longTitle: {
                    $regex: query.search.toLowerCase(),
                    $options: 'i',
                },
            },
            {
                shortDescription: {
                    $regex: query.search.toLowerCase(),
                    $options: 'i',
                },
            },
            {
                longDescription: {
                    $regex: query.search.toLowerCase(),
                    $options: 'i',
                },
            },
            // TODO: Discuss searching about following Event properties, look for a good practices about search and sort at one time together!
            { category: { $regex: query.search.toLowerCase(), $options: 'i' } },
            {
                ['contacts.region']: {
                    $regex: query.search.toLowerCase(),
                    $options: 'i',
                },
            },
        ];
    }

    return await limitModels(Event, page, limit, criteria);
}

// TODO: Update the event later!
async function updateEvent(requestBody, existingEvent, isAdmin) {
    for (let key in requestBody) {
        if (
            isAdmin &&
            (key === 'creator' || key === 'likes' || key === 'isApproved')
        ) {
            existingEvent[key] = requestBody[key];
        } else if (
            !isAdmin &&
            (key === 'creator' || key === 'likes' || key === 'isApproved')
        ) {
            throw new Error(`Only Admin can modify '${key}' property!`);
        }
        if (isAdmin && key === 'isDeleted') {
            existingEvent[key] = requestBody[key];
        } else if (
            !isAdmin &&
            key === 'isDeleted' &&
            requestBody[key] === true
        ) {
            existingEvent[key] = requestBody[key];
        }

        if (
            key !== 'toString' &&
            key !== 'creator' &&
            key !== 'likes' &&
            key !== 'isDeleted'
        ) {
            key === 'dates'
                ? requestBody[key].sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                )
                : null;
            existingEvent[key] = requestBody[key];
        }
    }

    return await existingEvent.save();
}

// Like/Unlike event.
async function likeUnlikeEvent(existingEvent, id, isAlreadyLiked) {
    if (isAlreadyLiked) {
        let filteredLikes = await existingEvent.likes.filter((x) => x != id);
        existingEvent.likes = filteredLikes;
        return await existingEvent.save();
    }

    existingEvent.likes.push(id);
    return await existingEvent.save();
}

// Find by month.
async function getEventsByMonth(startDate, endDate) {
    // Return documents where their 'dates.date[]' have the date from the given month.
    const events = await Event.find({
        isDeleted: false,
        isApproved: true,
        dates: {
            $elemMatch: {
                date: {
                    $gte: startDate,
                    $lte: endDate,
                },
            },
        },
    });
    return events;
}

async function getUpcomingEvents(today) {
    let query = {
        isDeleted: false,
        isApproved: true
    };

    if (today?.todayStart) {
        // Query for upcoming events
        // An event is upcoming if any of its dates are on or after todayEnd
        query.dates = {
            $elemMatch: {
                date: { $gte: today.todayStart }
            }
        };

    } else {
        throw new Error('Server Error!');
    }

    const events = await Event.find(query);
    return events;
}

async function getPastEvents(today) {
    let query = {
        isDeleted: false,
        isApproved: true
    };

    if (today?.todayStart) {
        // Query for past events
        // An event is past if all of its dates are before todayStart
        query.dates = {
            $not: {
                $elemMatch: {
                    date: { $gte: today.todayStart }
                }
            }
        };

    } else {
        throw new Error('Server Error!');
    }

    const events = await Event.find(query);
    return events;
}

async function getAllEventsForApproval(requesterId) {
    const requester = await User.findById(requesterId);
    if (requester.isDeleted) {
        throw new Error('Your profile is deleted!');
    }
    if (!requester.isApproved) {
        throw new Error('Your profile is not approved!');
    }
    if (requester.role !== 'admin') {
        throw new Error('You do not have access to these records!');
    }
    const waitingEvents = await Event.find({
        isApproved: false,
    });
    return waitingEvents;
}

module.exports = {
    registerEvent,
    findEventByID,
    findAllEvents,
    updateEvent,
    likeUnlikeEvent,
    getEventsByMonth,
    getAllEventsForApproval,
    getUpcomingEvents,
    getPastEvents,
};

// Commented code below is for postman tests!

// {
//     "shortTitle": "Special Testing",
//     "shortDescription": "Lorem..",
//     "dates": [
//         {
//             "date": "2023-12-25",
//             "startTime": "10:59",
//             "endTime": "22:40"
//         }
//     ],
//     "contacts": {
//         "coordinates": {
//             "lat": "42.52911093579847",
//             "long": "24.707900125838766"
//         },
//         "region": "Пловдив",
//         "address": "Хайдут Генчо N1",
//         "phone": "0123456789",
//         "email": "peter@abv.bg"
//     },
//     "category": "Драг",
//     "visitorPrices": [
//         {
//             "price": 15,
//             "description": "Цена за зрители"
//         }
//     ]
// }
