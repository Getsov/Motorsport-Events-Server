const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//TODO: use env and change secret
const secret = "q213fdfsddfasd231adfas12321kl";

async function registerUser(userData) {
  const email = userData.email;
  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.isDeleted == true) {
      throw new Error("This account has been deleted, please contact support");
    } else {
      throw new Error("Email is already taken!!!");
    }
  }

  const user = await User.create({
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    region: userData.region,
    hashedPassword: await bcrypt.hash(userData.password, 10),
  });
  return createToken(user);
}

async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email or password!!!");
  }
  if (user.isDeleted == true) {
    throw new Error("This account has been deleted, please contact support");
  }

  const match = await bcrypt.compare(password, user.hashedPassword);

  if (!match) {
    throw new Error("Invalid email or password!!!");
  }
  return createToken(user);
}

function createToken(user) {
  //TODO: What payload will contain!
  const payload = {
    _id: user.id,
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
    throw new Error("Invalid acces token!");
  }
}

//TODO: parseToken can be exported
module.exports = {
  registerUser,
  loginUser,
  parseToken,
};
