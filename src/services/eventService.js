const Event = require('../models/Event');
const User = require('../models/User');
const { categories } = require('../shared/categories');
const { regions } = require('../shared/regions');
const { limitModels } = require('../utils/limitModels');
const { sendEventApprovalStatusEmail } = require('./emailService');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

async function registerEvent(requestBody, requesterId) {
  const requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('Потребител с тези данни не е намерен!');
  }

  if (requester?.isDeleted === true) {
    throw new Error('Профилът на текущия потребител е изтрит!');
  }

  if (!requester?.isApproved) {
    throw new Error(
      'Вашия профил все още не е одобрен и не можете да създавате събития!'
    );
  }

  if (!(requester.role === 'admin' || requester.role === 'organizer')) {
    throw new Error(
      'Само потребители с роля "Организатор" или "Администратор" могат да регистрират събитие!'
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
    dateCreated: new Date(Date.now()), // TODO: Ask about specific time about the creation date?
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
    throw new Error('Събитието е изтрито!');
  }

  if (
    !event?.isApproved &&
    requester?._id.toString() !== creatorId &&
    requester?.role !== 'admin'
  ) {
    throw new Error('Събитието все още не е одобрено от Администратор!');
  }

  return event;
}
async function getAllOrFilteredEventsWithFavorites(
  query,
  ownerOptions,
  idOfLikedUser
) {
  const page = query.page || 1;
  const limit = query.limit || 0;
  
  const criteria = {
    isDeleted: false,
    isApproved: true,
  };
  let sortCriteria = {};

  if (idOfLikedUser) {
    criteria.likes = {
      $in: idOfLikedUser,
    };
  }

  if (ownerOptions?.requesterId) {
    const objectId = ObjectId.isValid(ownerOptions.requesterId)
    ? new ObjectId(ownerOptions.requesterId)
    : null;
    criteria.isApproved = ownerOptions.isApproved;
    criteria.creator = objectId;
  }

  if (query?.dates) {
    criteria.dates = query.dates;
  }

  if (query?.isDeleted) {
    criteria.isDeleted = query.isDeleted;
    criteria.isApproved = false;
  }
  
  if (query?.sort) {
    sortCriteria = query.sort;
  }

  if (query?.category) {
    criteria.categories = {
      $in: Array.isArray(query.category)
        ? query.category.map((key) => categories[key])
        : [categories[query.category]],
    };
  }
  if (query?.region) {
    criteria['contacts.region'] = {
      $in: Array.isArray(query.region)
        ? query.region.map((key) => regions[key])
        : [regions[query.region]],
    };
  }
  if (query?.search) {
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

  return await limitModels(Event, page, limit, criteria, sortCriteria);
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
    throw new Error('Събитието е изтрито!');
  }

  if (requesterId !== creatorId && requester?.role !== 'admin') {
    throw new Error(
      'Не сте Организатор на събитието или Администратор, за да го променяте!'
    );
  }
  if (requester?.role === 'regular') {
    throw new Error(
      'Не сте Организатор на събитието или Администратор, за да го променяте!'
    );
  }

  if (!requester) {
    throw new Error('Потребител с тези данни не е намерен!');
  }

  if (requester?.isDeleted === true) {
    throw new Error('Вашият профил е изтрит!');
  }

  if (!requester?.isApproved) {
    throw new Error(
      'Профилът Ви трябва да бъде одобрен, за да можете да променяте събитие!'
    );
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
      // throw new Error(`Only Admin can modify '${key}' property!`);
      throw new Error(`Само Администратор може да променя '${key}' !`);
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
    throw new Error('Потребител с тези данни не е намерен!');
  }

  if (!event || (event?.isDeleted !== false && requester?.role !== 'admin')) {
    throw new Error('Събитието е изтрито!');
  }

  if (!requester?.isApproved || requester?.isDeleted) {
    throw new Error(
      'Вашият профил не е одобрен и не можете да изтривате събитие!'
    );
  }

  if (requesterId !== creatorId && requester?.role !== 'admin') {
    throw new Error(
      'Не сте Организатор на събитието или Администратор, за да променяте събитието!'
    );
  }

  if (requestBody?.hasOwnProperty('isDeleted')) {
    if (typeof requestBody?.isDeleted !== 'boolean') {
      throw new Error('Само boolean стойности са валидни!');
    }
    if (
      (requestBody?.isDeleted && event.isDeleted) ||
      (!requestBody?.isDeleted && !event.isDeleted)
    ) {
      throw new Error(
        'Не може да променяте с данни еднакви спрямо предходните!'
      );
    }

    requestBody.isDeleted
      ? ((event.isDeleted = true), (event.isApproved = false))
      : (event.isDeleted = false);
  } else {
    throw new Error(
      'Моля подайте правилни данни в тялото на заявката: "isDeleted"'
    );
  }

  return await event.save({ validateBeforeSave: false });
}

async function approveDisapproveEvent(eventId, requesterId, requestBody) {
  const event = await Event.findById(eventId);
  const requester = await User.findById(requesterId);
  const owner = await User.findById(event.creator);

  if (!owner) {
    throw new Error('Собственикът на това събитие не е намерен!');
  }
  
  if (!requester) {
    throw new Error('Потребител с тези данни не е намерен!');
  }

  if (!event) {
    throw new Error('Събитието не съществува!');
  }

  if (!requester?.isApproved || requester?.isDeleted) {
    throw new Error('Вашият профил е изтрит или е все още неодобрен!');
  }

  if (requester?.role !== 'admin') {
    throw new Error('Полето е достъпно за промяна само от Администратор!');
  }

  if (requestBody?.hasOwnProperty('isApproved')) {
    if (typeof requestBody?.isApproved !== 'boolean') {
      throw new Error('Данните, които подавате не са валидни!');
    }
    if (
      (requestBody?.isApproved && event.isApproved) ||
      (!requestBody?.isApproved && !event.isApproved)
    ) {
      throw new Error(
        'Не може да променяте с еднакви данни спрямо предходните!'
      );
    }

    requestBody.isApproved
      ? (event.isApproved = true)
      : (event.isApproved = false);
  } else {
    throw new Error(
      'Моля подайте правилни данни в тялото на заявката: "isApproved"'
    );
  }
  sendEventApprovalStatusEmail(
    owner.email,
    requestBody.isApproved,
    event.shortTitle
  );
  return await event.save({ validateBeforeSave: false });
}

// Like/Unlike event.
async function likeUnlikeEvent(existingEvent, requesterId, isAlreadyLiked) {
  let requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('Потребител с тези данни не е намерен!');
  }

  if (requester?.isDeleted === true) {
    throw new Error('Вашият профил е изтрит!');
  }

  if (!requester?.isApproved) {
    throw new Error(
      'Профилът Ви трябва да бъде одобрен, за да харесате събитие!'
    );
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

async function getUpcomingEvents(query, requesterId) {
  if (requesterId) {
    const requester = await User.findById(requesterId);
    if (!requester) {
      throw new Error('Потребител с тези данни не е намерен!');
    }

    if (requester?.isDeleted === true) {
      throw new Error('Вашият профил е изтрит!');
    }

    if (!requester?.isApproved) {
      throw new Error('Профилът Ви не е одобрен!');
    }
  }

  let todayStart = new Date(Date.now());
  todayStart.setHours(0, 0, 0, 0);
  // An event is upcoming if any of its dates are on or after todayEnd
  query.dates = {
    $elemMatch: {
      date: { $gte: todayStart },
    },
  };

  query.sort = 'upcomingEvents';
  
  const events = await getAllOrFilteredEventsWithFavorites(query, {
    isApproved: true,
    requesterId,
  });
  return events;
}

async function getPastEvents(query, requesterId) {
  if (requesterId) {
    const requester = await User.findById(requesterId);
    if (!requester) {
      throw new Error('Потребител с тези данни не е намерен!');
    }

    if (requester?.isDeleted === true) {
      throw new Error('Вашият профил е изтрит!');
    }

    if (!requester?.isApproved) {
      throw new Error('Профилът Ви не е одобрен!');
    }
  }

  let todayStart = new Date(Date.now());
  todayStart.setHours(0, 0, 0, 0);
  // An event is past if all of its dates are before todayStart
  query.dates = {
    $not: {
      $elemMatch: {
        date: { $gte: todayStart },
      },
    },
  };

  query.sort = 'pastEvents';

  const events = await getAllOrFilteredEventsWithFavorites(query, {
    isApproved: true,
    requesterId,
  });
  return events;
}

async function getAllDeletedEvents(query, requesterId) {
  const requester = await User.findById(requesterId);
  if (!requester) {
    throw new Error('Няма потребител с такова ID') 
  }
  
  if (requester.isDeleted) {
    throw new Error('Вашият профил е изтрит!');
  }
  if (!requester.isApproved) {
    throw new Error('Профилът Ви все още не е одобрен!');
  }
  if (requester.role !== 'admin') {
    throw new Error('Нямате нужните права за достъп до тези данни!');
  }
  query.isDeleted = true;
  query.sort = 'allEvents'
  const events = await getAllOrFilteredEventsWithFavorites(query);
  return events;
}

async function getAllEventsForApproval(requesterId) {
  const requester = await User.findById(requesterId);
  if (requester.isDeleted) {
    throw new Error('Вашият профил е изтрит!');
  }
  if (!requester.isApproved) {
    throw new Error('Профилът Ви все още не е одобрен!');
  }
  if (requester.role !== 'admin') {
    throw new Error('Нямате нужните права за достъп до тези данни!');
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
  getAllDeletedEvents
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
