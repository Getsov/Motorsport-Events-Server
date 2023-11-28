const Event = require('../models/Event');
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
        dates: requestBody.dates,
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
    // TODO: make more tests with different values!
    const event = await Event.findById(eventId);

    return event;
}

async function findAllEvents(query) {
    // TODO: In later stage we mmay want to search by Organizer Name?
    const page = query.page
    const limit = query.limit
    const criteria = {
        isDeleted: false
    }

    if (query.category) {
        criteria.category = {
            $in: Array.isArray(query.category)
                ? query.category.map(key => categories[key])
                : [categories[query.category]]
        }
    }
    if (query.region) {
        criteria['contacts.region'] = {
            $in: Array.isArray(query.region)
                ? query.region.map(key => regions[key])
                : [regions[query.region]]
        }
    }
    if (query.search) {
        criteria.$or = [
            { shortTitle: { $regex: query.search.toLowerCase(), $options: 'i' } },
            { longTitle: { $regex: query.search.toLowerCase(), $options: 'i' } },
            { shortDescription: { $regex: query.search.toLowerCase(), $options: 'i' } },
            { longDescription: { $regex: query.search.toLowerCase(), $options: 'i' } },
            // TODO: Discuss searching about following Event properties, look for a good practices about search and sort at one time together!
            { category: { $regex: query.search.toLowerCase(), $options: 'i' } },
            { ['contacts.region']: { $regex: query.search.toLowerCase(), $options: 'i' } },
        ];
    }

    return await limitModels(Event, page, limit, criteria);
}

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

module.exports = {
    registerEvent,
    findEventByID,
    findAllEvents,
    updateEvent,
    likeUnlikeEvent,
};

// Commented code below is for postman tests!

// {
//     "shortTitle": "Hissar Coup",
//     "longTitle": "",
//     "shortDescription": "Lorem..",
//     "longDescription": "Lorem ipsum dolor sit amet miimet.",
//     "dates": [
//         {
//             "startDate": "2023-11-17",
//             "startTime": "23:59",
//             "endTime": "06:40"
//         }
//     ],
//     "imageUrl": "",
//     "contacts": {
//         "coordinates": {
//             "lat": "42.52911093579847",
//             "long": "24.707900125838766"
//         },
//         "region": "Hisarya",
//         "address": "Хайдут Генчо N1",
//         "phone": "0123456789",
//         "email": "peter@abv.bg"
//     },
//     "category": "Drag",
//     "likes": [
//         "6542c24b6102c6f4e79108fc",
//         "6542c24b6102c6f4e79108fc",
//         "6542c24b6102c6f4e79108fc"
//     ],
//     "winners": [
//         {
//             "name": "Pavel",
//             "vehicle": "Trabant",
//             "place": 1,
//             "_id": "65573f3a1bba3e1d78877f48"
//         },
//         {
//             "name": "Ivan",
//             "vehicle": "Wartburg",
//             "place": 2,
//             "_id": "65573f3a1bba3e1d78877f49"
//         },
//         {
//             "name": "Dragan",
//             "vehicle": "Moskvich",
//             "place": 3,
//             "_id": "65573f3a1bba3e1d78877f4a"
//         }
//     ],
//     "visitorPrices": [
//         {
//             "price": 15,
//             "description": "Цена за зрители"
//         }
//     ],
//     "participantPrices": [
//         {
//             "price": 15,
//             "description": "Цена за участници"
//         }
//     ]
// }
