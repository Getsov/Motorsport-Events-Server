const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

//TODO: use env and change secret
const secret = "q213fdfsddfasd231adfas12321kl";
const password = "123";
async function registerUser() {
  /*
    TODO: use next line for real app without hardcore the user

    async function registerUser(email, firstName, lastName,role,city, address, password) {

        const existing = await User.findOne({ email });
        if (existing) {
            throw new Error('Email is already taken!!!');
        }

        const user = await User.create({
            email,
            firstName,
            lastName,
            role,
            city,
            address,
            //TODO: fix likedEvents
            likedEvents,
            hashedPassword: await bcrypt.hash(password, 10)
        });
        return createToken(user)

*/

  // TODO: remove hardcore user
  // Sample ObjectId values that reference actual Event documents
  const eventId1 = new ObjectId();
  const eventId2 = new ObjectId();
  const eventId3 = new ObjectId();
  const user = await User.create({
    email: "Shumaher@gmail.com",
    firstName: "Michael",
    lastName: "Schumaher",
    role: "Racer",
    city: "Sofia",
    address: "Banishora 22",
    likedEvents: [eventId1,eventId2,eventId3],
    hashedPassword: await bcrypt.hash(password, 10),
    isDeleted: false,
  });

  return user;
}

//TODO: With username or with email user will login into the app? Change appropriate
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  //TODO: check for isDeleted property
  if (!user) {
    throw new Error("Invalid email or password!!!");
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error("Invalid email or password!!!");
  }
  return createToken(user);
}

function createToken(user) {
  const payload = {
    _id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };
  return {
    _id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    accessToken: jwt.sign(payload, secret),
  };
}

function parseToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch {
    error;
  }
  {
    throw new Error("Invalid acces token!");
  }
}

//TODO: parseToken can be exported
module.exports = {
  registerUser,
  loginUser,
  parseToken,
};
