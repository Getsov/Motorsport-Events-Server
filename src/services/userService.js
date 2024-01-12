const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { secret } = require('../utils/parseToken');
const { checkAuthorizedRequests } = require('../utils/securityCheck');

async function registerUser(requestBody) {
  const email = requestBody.email;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isDeleted == true) {
      throw new Error('This account has been deleted, please contact support');
    } else {
      throw new Error('Email is already taken!');
    }
  }

  const user = await User.create(requestBody);
  return createToken(user);
}

async function loginUser(email, password) {
  const user = await User.findOne({ email }).select('+hashedPassword');

  if (!user) {
    throw new Error('Invalid email or password!');
  }
  if (user.isDeleted) {
    throw new Error('This account has been deleted, please contact support');
  }
  if (!user.isApproved) {
    throw new Error('Your profile is not approved yet!');
  }

  // Validate user when login
  const validateUser = user.validateSync();
  if (validateUser) {
    throw new Error('User data validation failed!');
  }
  if (user.role == 'organizer') {
    if (user.organizatorName == '' || user.phone == '') {
      throw new Error('User data validation failed!');
    }
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error('Invalid email or password!');
  }
  return createToken(user);
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
      throw new Error('Name of organization is required');
    }
    if (requestBody.phone == '') {
      throw new Error('Phone is required');
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
  return createToken(newRecord);
}

async function editUserEmail(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  await checkAuthorizedRequests(userForEdit, requester, isAdmin);

  if (requestBody.email == '') {
    throw new Error("Email field can't be empty!");
  }

  userForEdit.email = requestBody.email;
  const newRecord = await userForEdit.save();
  return createToken(newRecord);
}

async function editUserPassword(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  await checkAuthorizedRequests(userForEdit, requester, isAdmin);

  if (!isAdmin) {
    const match = await bcrypt.compare(
      requestBody.oldPassword,
      userForEdit.hashedPassword
    );
    if (!match) {
      throw new Error('Password dismatch!');
    }
  }

  userForEdit.hashedPassword = await bcrypt.hash(requestBody.newPassword, 10);
  const newRecord = await userForEdit.save();
  return createToken(newRecord);
}

async function editUserRole(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('You do not have rights to modify the record!');
  }

  if (!userForEdit) {
    throw new Error('User not found');
  }

  if (requestBody.role == 'organizer') {
    if (userForEdit.organizatorName == '') {
      if (!requestBody.organizatorName) {
        throw new Error('Name of organization is required!');
      } else {
        userForEdit.organizatorName = requestBody.organizatorName;
      }
    }

    if (userForEdit.phone == '') {
      if (!requestBody.phone) {
        throw new Error('Phone is required!');
      } else {
        userForEdit.phone = requestBody.phone;
      }
    }
  }
  userForEdit.role = requestBody.role;

  const newRecord = await userForEdit.save();
  return createToken(newRecord);
}

async function editDeletedProperty(idOfUserForEdit, requestBody, requesterId) {
  const userForEdit = await User.findById(idOfUserForEdit);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  if (!userForEdit) {
    throw new Error('User not found');
  }

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('You do not have rights to modify the record!');
  }

  if (requestBody?.hasOwnProperty('isDeleted')) {
    if (typeof requestBody?.isDeleted !== 'boolean') {
      throw new Error('Only boolean values are valid!');
    }
    if (requestBody?.isDeleted && userForEdit.isDeleted || !requestBody?.isDeleted && !userForEdit.isDeleted) {
      throw new Error('You cannot modify with the same value!');
    }

    requestBody.isDeleted
      ? (userForEdit.isDeleted = true)
      : (userForEdit.isDeleted = false);

  } else {
    throw new Error('Add correct data in the request: "isDeleted"');
  }

  const newRecord = await userForEdit.save();
  return createToken(newRecord);
}

async function approveSingleUser(userId, requesterId, requestBody) {
  const userForEdit = await User.findById(userId);
  const requester = await User.findById(requesterId);
  const isAdmin = requester.role == 'admin' ? true : false;

  if (!isAdmin || requester.isDeleted || !requester.isApproved) {
    throw new Error('You do not have rights to modify the record!');
  }

  if (!userForEdit) {
    throw new Error('User not found!');
  }

  if (requestBody?.hasOwnProperty('isApproved')) {
    if (typeof requestBody?.isApproved !== 'boolean') {
      throw new Error('Only boolean values are valid!');
    }
    if (requestBody?.isApproved && userForEdit.isApproved || !requestBody?.isApproved && !userForEdit.isApproved) {
      throw new Error('You cannot modify with the same value!');
    }

    requestBody.isApproved
      ? (userForEdit.isApproved = true)
      : (userForEdit.isApproved = false);
  } else {
    throw new Error('Add correct data in the request: "isApproved"');
  }

  const newRecord = await userForEdit.save();
  return createToken(newRecord);
}

async function returnAllCreatedEvents(userId) {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }
  const userWithEvents = await existingUser.populate('createdEvents');
  const allCreatedEvents = userWithEvents.createdEvents;
  //return empty array if there is no createdEvents by current user
  if (allCreatedEvents.length === 0) {
    return allCreatedEvents;
  } else {
    return allCreatedEvents;
  }
}

async function returnAllFavouriteEvents(userId) {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('User not found!');
  }
  const userWithEvents = await existingUser.populate('likedEvents');
  const allFavouriteEvents = userWithEvents.likedEvents;
  //TODO check this FN => return empty array if there is no createdEvents by current user
  if (allFavouriteEvents.length === 0) {
    return allFavouriteEvents;
  } else {
    return allFavouriteEvents;
  }
}

async function getUserById(userId, requesterId) {
  const user = await User.findById(userId);
  const requester = await User.findById(requesterId);

  if (!user) {
    throw new Error('User not found!');
  }

  if (!requester) {
    throw new Error('Your profile is not found!');
  }

  if (requester?.isDeleted || !requester?.isApproved) {
    throw new Error('You do not have access to these records!');
  }

  if (
    requester?.role !== 'admin' &&
    requester?._id.toString() != user?._id.toString()
  ) {
    throw new Error('You are not authorized to see User details!');
  }

  return user;
}

async function getAllAdminsForApprovals(requesterId) {
  const requester = await User.findById(requesterId);
  if (!requester) {
    throw new Error('User not found!');
  }
  if (requester.isDeleted) {
    throw new Error('Your profile is deleted!');
  }
  if (!requester.isApproved) {
    throw new Error('Your profile is not approved!');
  }
  if (requester.role !== 'admin') {
    throw new Error('You do not have access to these records!');
  }
  const waitingAdmins = await User.find({
    isApproved: false,
    isDeleted: false,
    role: 'admin',
  });
  return waitingAdmins;
}

async function getAllOrganizersForApproval(requesterId) {
  const requester = await User.findById(requesterId);
  if (!requester) {
    throw new Error('User not found!');
  }
  if (requester.isDeleted) {
    throw new Error('Your profile is deleted!');
  }
  if (!requester.isApproved) {
    throw new Error('Your profile is not approved!');
  }
  if (requester.role !== 'admin') {
    throw new Error('You do not have access to these records!');
  }
  const waitingOrganizers = await User.find({
    isApproved: false,
    isDeleted: false,
    role: 'organizer',
  });
  return waitingOrganizers;
}

async function getAllOrganizers(requesterId) {
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
  const allOrganizers = await User.find({
    role: 'organizer',
  });
  return allOrganizers;
}

async function getAllRegularUsers(requesterId) {
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
  const allRegularUsers = await User.find({ role: 'regular' });
  return allRegularUsers;
}

async function getAllAdmins(requesterId) {
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
  const allAdmins = await User.find({ role: 'admin' });
  return allAdmins;
}

async function getAllUsers(requesterId) {
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
  const allUsers = await User.find();
  return allUsers;
}

async function addRemoveLikedEvent(eventId, userId, isAlreadyLiked) {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw new Error('User not found!');
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
    throw new Error('User not found!');
  }

  existingUser.createdEvents.push(eventId);
  return await existingUser.save();
}

function createToken(user) {
  // As a rule, seconds are set for the duration of tokens.
  const expiresInTenDays = 10 * 24 * 60 * 60;

  const payload = {
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
  };

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
    accessToken: jwt.sign(payload, secret, { expiresIn: expiresInTenDays }),
  };
}

module.exports = {
  registerUser,
  loginUser,
  editUserInfo,
  editUserEmail,
  editUserPassword,
  editUserRole,
  editDeletedProperty,
  addRemoveLikedEvent,
  addEventToCreatedEvents,
  returnAllCreatedEvents,
  returnAllFavouriteEvents,
  approveSingleUser,
  getAllAdminsForApprovals,
  getAllOrganizersForApproval,
  getAllOrganizers,
  getAllRegularUsers,
  getAllAdmins,
  getAllUsers,
  getUserById,
};
