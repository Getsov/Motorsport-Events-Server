const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl';
//TODO: Functionality for changing the password

async function registerUser(requestBody) {
  const email = requestBody.email;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isDeleted == true) {
      throw new Error('This account has been deleted, please contact support');
    } else {
      throw new Error('Email is already taken!!!');
    }
  }

  const user = await User.create({
    email: requestBody.email,
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    region: requestBody.region,
    hashedPassword: await bcrypt.hash(requestBody.password, 10),
  });
  return createToken(user);
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password!!!');
  }
  if (user.isDeleted == true) {
    throw new Error('This account has been deleted, please contact support');
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error('Invalid email or password!!!');
  }
  return createToken(user);
}

async function getById(id) {
  return User.find(id);
}


//updateUser can be invoked by adminController and userController
//accept id of user which will be updated, new data and isAdmin property
//isAdmin property can change yser role and delte value of user record
async function updateUser(id, requestBody, isAdmin) {
  const existingUser = await User.findById(id);
  /*TODO
  if there is empty string in req.body- mongo
  will kept the old record. 
  Need one more check if field must be cleared
  */
  //TODO - check functionality with liked events
  existingUser.email = requestBody.email
    ? requestBody.email
    : existingUser.email;
  existingUser.firstName = requestBody.firstName
    ? requestBody.firstName
    : existingUser.firstName;
  existingUser.lastName = requestBody.lastName
    ? requestBody.lastName
    : existingUser.lastName;
  existingUser.region = requestBody.region
    ? requestBody.region
    : existingUser.region;
  if (isAdmin) {
    existingUser.role = requestBody.role ? requestBody.role : existingUser.role;
    existingUser.isDeleted = requestBody.isDeleted
      ? requestBody.isDeleted
      : existingUser.isDeleted;
  }
  const newRecord = await existingUser.save();
  // console.log(newRecord);
  return createToken(newRecord);
}

function createToken(user) {
  //TODO: What payload will contain!
  const payload = {
    _id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    region: user.region,
  };
  return {
    _id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    region: user.region,
    likedEvents: user.likedEvents,
    isDeleted: user.isDeleted,
    accessToken: jwt.sign(payload, secret),
  };
}

function parseToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid acces token!');
  }
}

//TODO: parseToken can be exported
module.exports = {
  registerUser,
  loginUser,
  parseToken,
  getById,
  updateUser,
};
