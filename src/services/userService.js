const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secretAccesToken, secretRefreshToken } = require('../utils/parseToken');
const { checkAuthorizedRequests } = require('../utils/securityCheck');
const { checkAdmin } = require('../utils/adminsCheck');
const { getAllOrFilteredEventsWithFavorites } = require('./eventService');
const { sendUserApprovalEmail } = require('./emailService');

async function registerUser(requestBody) {
  const email = requestBody.email;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isDeleted == true) {
      throw new Error('Този акаунт е изтрит, моля свържете се с администратор');
    } else {
      throw new Error('Имейлът вече е зает!');
    }
  }

  const user = await User.create(requestBody);
  const userData = createUserData(user);
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return { userData, accessToken, refreshToken };
}

async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+hashedPassword');
  if (!user) {
    throw new Error('Невалиден имейл или парола!');
  }
  if (user.isDeleted) {
    throw new Error('Този акаунт е изтрит, моля свържете се с администратор');
  }
  if (!user.isApproved) {
    throw new Error('Вашият профил все още не е одобрен!');
  }

  // Validate user when login
  const validateUser = user.validateSync();
  if (validateUser) {
    throw new Error('Невалидни данни на потребител');
  }
  if (user.role == 'organizer') {
    if (user.organizatorName == '' || user.phone == '') {
      throw new Error('Невалидни данни на потребител');
    }
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error('Невалиден имейл или парола!');
  }
  const userData = createUserData(user);
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  return { userData, accessToken, refreshToken };
}

//updateUser can be invoked by adminController and userController
//accept id of user which will be updated, new data and isAdmin property
async function editUserInfo(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  await checkAuthorizedRequests(userForEdit, requester, isAdmin);

  if (userForEdit.role == 'organizer') {
    if (requestBody.organizatorName == '') {
      throw new Error('Името на организацията е задължително');
    }
    if (requestBody.phone == '') {
      throw new Error('Телефонът е задължителен');
    }
  }

  for (let key of Object.keys(requestBody)) {
    if (
      key == 'email' ||
      key == 'role' ||
      key == 'likedEvents' ||
      key == 'createdEvents' ||
      key == 'hashedPassword' ||
      key == 'isDeleted' ||
      key == 'isApproved'
    ) {
      continue;
    }
    userForEdit[key] = requestBody[key];
  }

  const newRecord = await userForEdit.save();
  return createUserData(newRecord);
}

async function editUserEmail(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  await checkAuthorizedRequests(userForEdit, requester, isAdmin);

  if (requestBody.email == '') {
    throw new Error('Полето за имейл не може да бъде празно');
  }

  userForEdit.email = requestBody.email;
  const newRecord = await userForEdit.save();
  return createToken(newRecord);
}

async function editUserPassword(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit).select(
    '+hashedPassword'
  );
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  await checkAuthorizedRequests(userForEdit, requester, isAdmin);

  if (!isAdmin) {
    const match = await bcrypt.compare(
      requestBody.oldPassword,
      userForEdit.hashedPassword
    );
    if (!match) {
      throw new Error('Невалидна стара парола');
    }
  }

  userForEdit.hashedPassword = await bcrypt.hash(requestBody.newPassword, 10);
  const newRecord = await userForEdit.save();
  return createUserData(newRecord);
}

async function editUserRole(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('Нямате права да модифицирате записа!');
  }

  if (!userForEdit) {
    throw new Error('Потребителят не е намерен');
  }

  if (requestBody.role == 'organizer') {
    if (userForEdit.organizatorName == '') {
      if (!requestBody.organizatorName) {
        throw new Error('Името на организацията е задължително');
      } else {
        userForEdit.organizatorName = requestBody.organizatorName;
      }
    }

    if (userForEdit.phone == '') {
      if (!requestBody.phone) {
        throw new Error('Телефонът е задължителен');
      } else {
        userForEdit.phone = requestBody.phone;
      }
    }
  }
  userForEdit.role = requestBody.role;

  const newRecord = await userForEdit.save();
  return createUserData(newRecord);
}

async function deleteRestoreSingleUser(
  idOfUserForEdit,
  requestBody,
  requesterId
) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester?.role == 'admin' ? true : false;

  if (!userForEdit) {
    throw new Error('Потребителят не е намерен');
  }

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('Нямате права да модифицирате записа!');
  }

  if (requestBody?.hasOwnProperty('isDeleted')) {
    if (typeof requestBody?.isDeleted !== 'boolean') {
      throw new Error('Валидни са само булеви стойности!');
    }
  } else {
    throw new Error('Добавете коректни данни в заявката: "isDeleted"');
  }

  if (requestBody?.isDeleted == userForEdit.isDeleted) {
    throw new Error('Не можете да модифицирате със същата стойност!');
  }

  requestBody.isDeleted
    ? ((userForEdit.isDeleted = true), (userForEdit.isApproved = false))
    : (userForEdit.isDeleted = false);

  const newRecord = await userForEdit.save();
  return createUserData(newRecord);
}

async function deleteRestoreMultipleUsers(requestBody, requesterId) {
  const requester = await User.findById(requesterId);
  const isAdmin = requester?.role == 'admin' ? true : false;
  const usersForEdit = requestBody.listOfUsers;
  const updatedUsersList = [];

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('Нямате права да модифицирате записа!');
  }

  if (
    requestBody?.hasOwnProperty('isDeleted') &&
    requestBody?.hasOwnProperty('listOfUsers')
  ) {
    if (typeof requestBody?.isDeleted !== 'boolean') {
      throw new Error('Валидни са само булеви стойности!');
    }
  } else {
    throw new Error('Добавете коректни данни в заявката: "isDeleted"');
  }

  if (!Array.isArray(usersForEdit) || usersForEdit.length <= 0) {
    throw new Error('Няма потребители за редакция');
  }

  await Promise.all(
    usersForEdit.map(async (userId) => {
      const userForEdit = await User.findById(userId);
      if (!userForEdit) {
        throw new Error('Потребителят не е намерен');
      }
      if (requestBody?.isDeleted == userForEdit.isDeleted) {
        throw new Error('Не можете да модифицирате със същата стойност!');
      }

      requestBody.isDeleted
        ? ((userForEdit.isDeleted = true), (userForEdit.isApproved = false))
        : (userForEdit.isDeleted = false);
      const newRecord = await userForEdit.save();
      updatedUsersList.push(newRecord);
    })
  );

  return updatedUsersList;
}

async function approveDisapproveSingleUser(userId, requesterId, requestBody) {
  const userForEdit = await User.findById(userId);
  const requester = await User.findById(requesterId);
  const isAdmin = requester?.role == 'admin' ? true : false;
  // let isApproved = true;

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('Нямате права да модифицирате записа!');
  }

  if (!userForEdit) {
    throw new Error('Потребителят не е намерен!');
  }

  if (requestBody?.hasOwnProperty('isApproved')) {
    if (typeof requestBody?.isApproved !== 'boolean') {
      throw new Error('Валидни са само булеви стойности!');
    }
  } else {
    throw new Error('Добавете коректни данни в заявката: "isApproved"');
  }

  if (requestBody?.isApproved == userForEdit.isApproved) {
    throw new Error('Не можете да модифицирате със същата стойност!');
  }

  requestBody.isApproved
    ? (userForEdit.isApproved = true)
    : (userForEdit.isApproved = false);

  const newRecord = await userForEdit.save();
  let updatedUsersList = [newRecord];
  sendUserApprovalEmail(updatedUsersList, requestBody?.isApproved);

  return createUserData(newRecord);
}

async function approveDisapproveMultipleUsers(requestBody, requesterId) {
  const requester = await User.findById(requesterId);
  const isAdmin = requester?.role == 'admin' ? true : false;
  const usersForEdit = requestBody.listOfUsers;
  const updatedUsersList = [];

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('Нямате права да модифицирате записа!');
  }

  if (
    requestBody?.hasOwnProperty('isApproved') &&
    requestBody?.hasOwnProperty('listOfUsers')
  ) {
    if (typeof requestBody?.isApproved !== 'boolean') {
      throw new Error('Валидни са само булеви стойности!');
    }
  } else {
    throw new Error(
      'Добавете коректни данни в заявката: "isApproved", "listOfUsers'
    );
  }

  if (!Array.isArray(usersForEdit) || usersForEdit.length <= 0) {
    throw new Error('Няма потребители за редакция');
  }

  await Promise.all(
    usersForEdit.map(async (userId) => {
      const userForEdit = await User.findById(userId);
      if (!userForEdit) {
        throw new Error('Потребителят не е намерен');
      }
      if (requestBody?.isApproved == userForEdit.isApproved) {
        throw new Error('Не можете да модифицирате със същата стойност!');
      }

      requestBody.isApproved
        ? (userForEdit.isApproved = true)
        : (userForEdit.isApproved = false);
      const newRecord = await userForEdit.save();
      updatedUsersList.push(newRecord);
    })
  );

  sendUserApprovalEmail(updatedUsersList, requestBody.isApproved);
  return updatedUsersList;
}

async function returnAllCreatedEvents(userId) {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('Потребителят не е намерен!');
  }
  const userWithEvents = await existingUser.populate('createdEvents');
  const allCreatedEvents = userWithEvents.createdEvents;
  return allCreatedEvents;
}

async function returnAllFavouriteEvents(userId, query) {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('Потребителят не е намерен!');
  }
  query.sort = 'allEvents';
  const allFavouriteEvents = await getAllOrFilteredEventsWithFavorites(
    query,
    null,
    existingUser._id
  );

  return allFavouriteEvents;
}

async function getUserById(userId, requesterId) {
  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);

  if (!user) {
    throw new Error('Потребителят не е намерен');
  }

  if (!requester) {
    throw new Error('Профилът не е намерен');
  }

  if (requester?.isDeleted || !requester?.isApproved) {
    throw new Error('Нямате нужните права за достъп до тези данни!');
  }

  if (
    requester?.role !== 'admin' &&
    requester?._id.toString() != user?._id.toString()
  ) {
    throw new Error(
      'Не сте оторизиран, за да видите детайлите на потребителя.'
    );
  }

  return createUserData(user);
}

async function getApprovedAdmins(requesterId) {
  const requester = await User.findById(requesterId);
  await checkAdmin(requester);

  const approvedAdmins = await User.find({
    isApproved: true,
    role: 'admin',
  });
  return approvedAdmins;
}

async function getAllAdminsForApprovals(requesterId) {
  const requester = await User.findById(requesterId);
  await checkAdmin(requester);

  const waitingAdmins = await User.find({
    isApproved: false,
    isDeleted: false,
    role: 'admin',
  });
  return waitingAdmins;
}

async function getApprovedOrganizators(requesterId) {
  const requester = await User.findById(requesterId);
  await checkAdmin(requester);

  const approvedOrganizers = await User.find({
    isApproved: true,
    role: 'organizer',
  });
  return approvedOrganizers;
}

async function getAllOrganizersForApproval(requesterId) {
  const requester = await User.findById(requesterId);
  await checkAdmin(requester);

  const waitingOrganizers = await User.find({
    isApproved: false,
    isDeleted: false,
    role: 'organizer',
  });
  return waitingOrganizers;
}

function generateCriteriaForUserSearch(query) {
  return [
    {
      email: {
        $regex: query.search.toLowerCase(),
        $options: 'i',
      },
    },
    {
      organizatorName: {
        $regex: query.search.toLowerCase(),
        $options: 'i',
      },
    },
    {
      firstName: {
        $regex: query.search.toLowerCase(),
        $options: 'i',
      },
    },
    {
      lastName: {
        $regex: query.search.toLowerCase(),
        $options: 'i',
      },
    },
    {
      region: {
        $regex: query.search.toLowerCase(),
        $options: 'i',
      },
    },
    {
      phone: {
        $regex: query.search.toLowerCase(),
        $options: 'i',
      },
    },
  ];
}

async function getAllOrganizers(requesterId, query) {
  const requester = await User.findById(requesterId);
  const criteria = {
    role: 'organizer',
  };
  if (query?.search) {
    const searchCriteria = generateCriteriaForUserSearch(query);
    Object.assign(criteria, { $or: searchCriteria });
  }
  await checkAdmin(requester);

  const allOrganizers = await User.find(criteria);
  return allOrganizers;
}

async function getAllRegularUsers(requesterId, query) {
  const requester = await User.findById(requesterId);
  const criteria = {
    role: 'regular',
  };
  if (query?.search) {
    const searchCriteria = generateCriteriaForUserSearch(query);
    Object.assign(criteria, { $or: searchCriteria });
  }
  await checkAdmin(requester);

  const allRegularUsers = await User.find(criteria);
  return allRegularUsers;
}

async function getAllAdmins(requesterId, query) {
  const requester = await User.findById(requesterId);
  const criteria = {
    role: 'admin',
  };
  if (query?.search) {
    const searchCriteria = generateCriteriaForUserSearch(query);
    Object.assign(criteria, { $or: searchCriteria });
  }
  await checkAdmin(requester);

  const allAdmins = await User.find(criteria);
  return allAdmins;
}

async function getAllUsers(requesterId, query) {
  const requester = await User.findById(requesterId);
  const criteria = {};
  if (query?.search) {
    const searchCriteria = generateCriteriaForUserSearch(query);
    Object.assign(criteria, { $or: searchCriteria });
  }
  await checkAdmin(requester);

  const allUsers = await User.find(criteria);
  return allUsers;
}

async function getMyEventsForApproval(requesterId, query) {
  const requester = await User.findById(requesterId);

  if (!requester) {
    throw new Error('Влезте в профила си!');
  }
  if (requester.isDeleted) {
    throw new Error('Вашият профил е изтрит!');
  }
  if (!requester.isApproved) {
    throw new Error('Профилът Ви все още не е одобрен!');
  }
  if (requester.role !== 'organizer' && requester.role !== 'admin') {
    throw new Error('Нямате нужните права за достъп до тези данни!');
  }
  query.sort = 'allEvents';
  const waitingEvents = await getAllOrFilteredEventsWithFavorites(query, {
    isApproved: false,
    requesterId,
  });

  return waitingEvents;
}

async function addRemoveLikedEvent(eventId, userId, isAlreadyLiked) {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('Потребителят не е намерен!');
  }

  if (existingUser.likedEvents.includes(eventId) && isAlreadyLiked) {
    let filteredLikes = existingUser.likedEvents.filter((x) => x != eventId);
    existingUser.likedEvents = filteredLikes;
    return await existingUser.save();
  }

  existingUser.likedEvents.push(eventId);
  return await existingUser.save();
}

async function addEventToCreatedEvents(eventId, userId) {
  eventId = eventId.toString();
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('Потребителят не е намерен!');
  }

  existingUser.createdEvents.push(eventId);
  return await existingUser.save();
}

async function getUserForTokenGeneration(userId) {
  const user = await User.findById(userId);

  if (user && !user.isDeleted && user.isApproved) {
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    return { accessToken, refreshToken };
  }

  throw new Error();
  return;
}

function createUserData(user) {
  return {
    _id: user._id,
    email: user.email,
    organizatorName: user.organizatorName,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    region: user.region,
    phone: user.phone,
    isDeleted: user.isDeleted,
    isApproved: user.isApproved,
    likedEvents: user.likedEvents,
    createdEvents: user.createdEvents,
  };
}

function createAccessToken(user) {
  // As a rule, seconds are set for the duration of tokens.
  const expiresInTenDays = 10 * 24 * 60 * 60;

  //DIFFERENT EXPIRE TIME FOR TESTING
  // const expiresInOneMinutes = 60;
  // const expiresInTenMinutes = 10 * 60;
  const payload = {
    _id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, secretAccesToken, {
    expiresIn: expiresInTenDays,
  });
}

function createRefreshToken(user) {
  const expiresInThirtyDays = 30 * 24 * 60 * 60;

  const payload = {
    _id: user._id,
    email: user.email,
  };

  return jwt.sign(payload, secretRefreshToken, {
    expiresIn: expiresInThirtyDays,
  });
}

module.exports = {
  registerUser,
  loginUser,
  editUserInfo,
  editUserEmail,
  editUserPassword,
  editUserRole,
  deleteRestoreSingleUser,
  deleteRestoreMultipleUsers,
  addRemoveLikedEvent,
  addEventToCreatedEvents,
  returnAllCreatedEvents,
  returnAllFavouriteEvents,
  approveDisapproveSingleUser,
  approveDisapproveMultipleUsers,
  getApprovedAdmins,
  getAllAdminsForApprovals,
  getApprovedOrganizators,
  getAllOrganizersForApproval,
  getAllOrganizers,
  getAllRegularUsers,
  getAllAdmins,
  getAllUsers,
  getMyEventsForApproval,
  getUserById,
  getUserForTokenGeneration,
};
