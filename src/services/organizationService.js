const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

//TODO: use env and change secret
const secret = "q213fdfsddfasd231adfas12321kl";

async function registerOrganization(organizationData) {
  const email = organizationData.email;

  const existing = await Organization.findOne({ email });
  if (existing) {
    throw new Error("Email is already taken!!!");
  }

  const organization = await Organization.create({
    name: organizationData.name,
    email: organizationData.email,
    managerFirstName: organizationData.managerFirstName,
    managerLastName: organizationData.managerLastName,
    phone: organizationData.phone,
    region: organizationData.region,
    password: organizationData.phone,
    address: organizationData.address,
    hashedPassword: await bcrypt.hash(organizationData.password, 10),
  });
  return createToken(organization);
}

async function loginOrganization(email, password) {
  const organization = await Organization.findOne({ email });
  if (!organization) {
    throw new Error("Invalid email or password!!!");
  }

  const match = await bcrypt.compare(password, organization.hashedPassword);

  if (!match) {
    throw new Error("Invalid email or password!!!");
  }
  return createToken(organization);
}

/*
TODO:
- loginOrganization,
- parseToken (can be exported)

*/

function createToken(organization) {
  const payload = {
    _id: organization.id,
    email: organization.email,
    managerFirstName: organization.managerFirstName,
    managerLastName: organization.lastName,
    phone: organization.phone,
  };
  return {
    _id: organization.id,
    name: organization.name,
    managerFirstName: organization.managerFirstName,
    managerLastName: organization.lastName,
    phone: organization.phone,
    region: organization.region,
    address: organization.address,
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

module.exports = {
  registerOrganization,
  loginOrganization,
  parseToken
};
