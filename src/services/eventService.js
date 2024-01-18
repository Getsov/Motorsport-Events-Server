const Event = require('../models/Event');
const User = require('../models/User');
const { categories } = require('../shared/categories');
const { regions } = require('../shared/regions');
const { limitModels } = require('../utils/limitModels');

async function registerEvent(requestBody, requesterId) {
  const requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('User not found!');
  }

  if (requester?.isDeleted === true) {
    throw new Error('This User is deleted!');
  }

  if (!requester?.isApproved) {
    throw new Error('This User must be approved to register events!');
  }

  if (!(requester.role === 'admin' || requester.role === 'organizer')) {
    throw new Error(
      'Only user with role "organizer" or "admin" can register an Event!'
    );
  }

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
    categories: requestBody.categories,
    likes: requestBody.likes,
    creator: requesterId,
    winners: requestBody.winners,
    participantPrices: requestBody.participantPrices,
    visitorPrices: requestBody.visitorPrices,
  });

  return event;
}

async function findEventByID(eventId, requesterId) {
  const event = await Event.findById(eventId).populate('creator');
  const requester = await User.findById(requesterId);
  const creatorId = event?.creator._id.toString();

  if (event?.isDeleted && requester?.role !== 'admin') {
    throw new Error('Event is deleted!');
  }

  if (
    !event?.isApproved &&
    requester?._id !== creatorId &&
    requester?.role !== 'admin'
  ) {
    throw new Error('This Event is not Approved by Admin!');
  }

  return event;
}
async function getAllOrFilteredEventsWithFavorites(query, idOfLikedUser) {
  const page = query.page;
  const limit = query.limit;

  const criteria = {
    isDeleted: false,
    isApproved: true,
  };

  if (idOfLikedUser) {
    criteria.likes = {
      $in: idOfLikedUser,
    };
  }

  if (query.category) {
    criteria.categories = {
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
      { categories: { $regex: query.search.toLowerCase(), $options: 'i' } },
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

async function updateEvent(requestBody, existingEvent, reqRequester) {
  const creatorId = existingEvent?.creator._id.toLocaleString();
  const requester = await User.findById(reqRequester);
  const requesterId = requester?._id.toString();
  const isAdmin = requester?.role === 'admin';

  if (
    existingEvent === null ||
    (requester?.role !== 'admin' && existingEvent?.isDeleted !== false)
  ) {
    throw new Error('Event is deleted!');
  }

  if (requesterId !== creatorId && requester?.role !== 'admin') {
    throw new Error('You are not owner or Admin to modify this Event!');
  }

  if (!requester) {
    throw new Error('User not found!');
  }

  if (requester?.isDeleted === true) {
    throw new Error('This User is deleted!');
  }

  if (!requester?.isApproved) {
    throw new Error('This User must be approved to update events!');
  }

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

    if (
      key !== 'toString' &&
      key !== 'creator' &&
      key !== 'likes' &&
      key !== 'isDeleted'
    ) {
      key === 'dates'
        ? requestBody[key].sort((a, b) => new Date(a.date) - new Date(b.date))
        : null;
      existingEvent[key] = requestBody[key];
    }
  }
  existingEvent.isApproved = false;
  return await existingEvent.save();
}

async function deleteRestoreEvent(eventId, requesterId, requestBody) {
  const event = await Event.findById(eventId);
  const creatorId = event.creator.toString();
  const requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('User not found!');
  }

  if (!event || (event?.isDeleted !== false && requester?.role !== 'admin')) {
    throw new Error('Event is deleted!');
  }

  if (!requester?.isApproved || requester?.isDeleted) {
    throw new Error('This User must be approved to delete events!');
  }

  if (requesterId !== creatorId && requester?.role !== 'admin') {
    throw new Error('You are not owner or Admin to modify this Event!');
  }

  if (requestBody?.hasOwnProperty('isDeleted')) {
    if (typeof requestBody?.isDeleted !== 'boolean') {
      throw new Error('Only boolean values are valid!');
    }
    if (
      (requestBody?.isDeleted && event.isDeleted) ||
      (!requestBody?.isDeleted && !event.isDeleted)
    ) {
      throw new Error('You cannot modify with the same value!');
    }

    requestBody.isDeleted
      ? ((event.isDeleted = true), (event.isApproved = false))
      : (event.isDeleted = false);
  } else {
    throw new Error('Add correct data in the request body: "isDeleted"');
  }

  return await event.save();
}

async function approveDisapproveEvent(eventId, requesterId, requestBody) {
  const event = await Event.findById(eventId);
  const requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('User not found!');
  }

  if (!event) {
    throw new Error('Event does not exist!');
  }

  if (!requester?.isApproved || requester?.isDeleted) {
    throw new Error(
      'This User must be active admin to approve/disapprove event!'
    );
  }

  if (requester?.role !== 'admin') {
    throw new Error('You are not an admin to modify this Event!');
  }

  if (requestBody?.hasOwnProperty('isApproved')) {
    if (typeof requestBody?.isApproved !== 'boolean') {
      throw new Error('Only boolean values are valid!');
    }
    if (
      (requestBody?.isApproved && event.isApproved) ||
      (!requestBody?.isApproved && !event.isApproved)
    ) {
      throw new Error('You cannot modify with the same value!');
    }

    requestBody.isApproved
      ? (event.isApproved = true)
      : (event.isApproved = false);
  } else {
    throw new Error('Add correct data in the request body: "isApproved"');
  }

  return await event.save();
}

// Like/Unlike event.
async function likeUnlikeEvent(existingEvent, requesterId, isAlreadyLiked) {
  let requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('User not found!');
  }

  if (requester?.isDeleted === true) {
    throw new Error('This User is deleted!');
  }

  if (!requester?.isApproved) {
    throw new Error('This User must be approved to like events!');
  }

  if (isAlreadyLiked) {
    let filteredLikes = await existingEvent.likes.filter(
      (x) => x != requesterId
    );
    existingEvent.likes = filteredLikes;
    return await existingEvent.save({ validateBeforeSave: false });
  }

  existingEvent.likes.push(requesterId);
  return await existingEvent.save({ validateBeforeSave: false });
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

async function getUpcomingEvents() {
  let query = {
    isDeleted: false,
    isApproved: true,
  };

  let todayStart = new Date(Date.now());
  todayStart.setHours(0, 0, 0, 0);
  // Query for upcoming events
  // An event is upcoming if any of its dates are on or after todayEnd
  query.dates = {
    $elemMatch: {
      date: { $gte: todayStart },
    },
  };

  const events = await Event.find(query);
  return events;
}

async function getPastEvents() {
  let query = {
    isDeleted: false,
    isApproved: true,
  };

  let todayStart = new Date(Date.now());
  todayStart.setHours(0, 0, 0, 0);
  // Query for past events
  // An event is past if all of its dates are before todayStart
  query.dates = {
    $not: {
      $elemMatch: {
        date: { $gte: todayStart },
      },
    },
  };

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
    isDeleted: false,
  });
  return waitingEvents;
}

module.exports = {
  registerEvent,
  findEventByID,
  getAllOrFilteredEventsWithFavorites,
  updateEvent,
  likeUnlikeEvent,
  getEventsByMonth,
  getAllEventsForApproval,
  getUpcomingEvents,
  getPastEvents,
  deleteRestoreEvent,
  approveDisapproveEvent,
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
//             "lng": "24.707900125838766"
//         },
//         "region": "Пловдив",
//         "address": "Хайдут Генчо N1",
//         "phone": "0123456789",
//         "email": "peter@abv.bg"
//     },
//     "categories": "Драг",
//     "visitorPrices": [
//         {
//             "price": 15,
//             "description": "Цена за зрители"
//         }
//     ]
// }
