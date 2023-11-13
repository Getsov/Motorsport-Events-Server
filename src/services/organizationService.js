const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');

//TODO: use env and change secret
const secret = 'q213fdfsddfasd231adfas12321kl';

async function registerOrganization(organizationData) {
  const email = organizationData.email;

  const existing = await Organization.findOne({ email });
  if (existing) {
    if (existing.isDeleted == true) {
      throw new Error('This account has been deleted, please contact support');
    } else {
      throw new Error('Email is already taken!!!');
    }
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
    throw new Error('Invalid email or password!');
  }
  if (organization.isDeleted == true) {
    throw new Error('This account has been deleted, please contact support');
  }

  const match = await bcrypt.compare(password, organization.hashedPassword);

  if (!match) {
    throw new Error('Invalid email or password!');
  }
  return createToken(organization);
}

async function updateOrganization(id, requestBody, isAdmin) {
  const existingOrganization = await Organization.findById(id);
  if (!existingOrganization) {
    throw new Error('Organization not found');
  }

  let arrayOfKeys = [
    'name',
    'email',
    'managerFirstName',
    'managerLastName',
    'phone',
    'region',
    'address',
  ];
  
  for (let key of arrayOfKeys) {
    if (requestBody[key]) {
      existingOrganization[key] = requestBody[key];
    } else {
      existingOrganization[key] = '';
    }
  }

  if (isAdmin) {
    //TODO - HOW WE MANAGE WITH REPASS?
    existingOrganization.isDeleted = requestBody.isDeleted
      ? requestBody.isDeleted
      : existingOrganization.isDeleted;
  }
  const newRecord = await existingOrganization.save();
  // console.log(newRecord);
  return createToken(newRecord);
}

/*
TODO:
- parseToken (can be exported)
*/

function createToken(organization) {
  //TODO: What payload will contain!
  const payload = {
    _id: organization.id,
    name: organization.name,
    email: organization.email,
    managerFirstName: organization.managerFirstName,
    managerLastName: organization.managerLastName,
    phone: organization.phone,
    region: organization.region,
    address: organization.address,
  };
  return {
    _id: organization.id,
    name: organization.name,
    email: organization.email,
    managerFirstName: organization.managerFirstName,
    managerLastName: organization.managerLastName,
    phone: organization.phone,
    region: organization.region,
    address: organization.address,
    createdEvents: organization.createdEvents,
    likedEvents: organization.likedEvents,
    isDeleted: organization.isDeleted,
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

module.exports = {
  registerOrganization,
  loginOrganization,
  parseToken,
  updateOrganization,
};
