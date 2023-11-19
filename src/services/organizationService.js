const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const { secret } = require('../utils/parseToken');

async function registerOrganization(organizationData) {
    const email = organizationData.email;

    const existing = await Organization.findOne({ email });
    if (existing) {
        if (existing.isDeleted == true) {
            throw new Error(
                'This account has been deleted, please contact support'
            );
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
        throw new Error(
            'This account has been deleted, please contact support'
        );
    }

    const match = await bcrypt.compare(password, organization.hashedPassword);
    if (!match) {
        throw new Error('Invalid email or password!');
    }
    return createToken(organization);
}

async function updateOrganizationInfo(organizationId, requestBody, isAdmin) {
    const existingOrganization = await Organization.findById(organizationId);
    if (!existingOrganization) {
        throw new Error('Organization not found');
    }

    for (let key of Object.keys(requestBody)) {
        if (
            key == 'email' ||
            key == 'createdEvents' ||
            key == 'likedEvents' ||
            key == 'hashedPassword' ||
            key == 'isDeleted'
        ) {
            continue;
        }
        existingOrganization[key] = requestBody[key];
    }

    if (isAdmin) {
        //TODO - HOW we manage likedEvents and created events
        //isDeleted must be sent as string
        existingOrganization.isDeleted = requestBody.isDeleted
            ? requestBody.isDeleted
            : existingOrganization.isDeleted;
    }
    const newRecord = await existingOrganization.save();
    return createToken(newRecord);
}

async function updateOrganizationEmail(organizationId, requestBody) {
    const existingOrganization = await Organization.findById(organizationId);
    if (!existingOrganization) {
        throw new Error('Organization not found');
    }

    if (requestBody.email == '') {
        throw new Error("Email field can't be empty!");
    }

    existingOrganization.email = requestBody.email;
    const newRecord = await existingOrganization.save();
    return createToken(newRecord);
}
async function updateOrganizationPassword(
    organizationId,
    requestBody,
    isAdmin
) {
    const existingOrganization = await Organization.findById(organizationId);
    if (!existingOrganization) {
        throw new Error('Organization not found');
    }

    if (!isAdmin) {
        const match = await bcrypt.compare(
            requestBody.oldPassword,
            existingOrganization.hashedPassword
        );
        if (!match) {
            throw new Error('Password dismatch!');
        }
    }

    existingOrganization.hashedPassword = await bcrypt.hash(
        requestBody.newPassword,
        10
    );
    const newRecord = await existingOrganization.save();
    return createToken(newRecord);
}

function createToken(organization) {
    const payload = {
        _id: organization.id,
        name: organization.name,
        email: organization.email,
        managerFirstName: organization.managerFirstName,
        managerLastName: organization.managerLastName,
        phone: organization.phone,
        region: organization.region,
        address: organization.address,
        type: organization.type,
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
        type: organization.type,
        accessToken: jwt.sign(payload, secret),
    };
}

module.exports = {
    registerOrganization,
    loginOrganization,
    updateOrganizationInfo,
    updateOrganizationEmail,
    updateOrganizationPassword,
};
