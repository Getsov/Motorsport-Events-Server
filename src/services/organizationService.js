const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organization = require("../models/Organization");

//TODO: use env and change secret
const secret = "q213fdfsddfasd231adfas12321kl";

async function registerOrganization(organizationData) {
  const email = organizationData.email;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email is already taken!!!");
  }

  const organization = await Organization.create({
    name: organizationData.name,
    email: organizationData.email,
    firstName: organizationData.managerFirstName,
    lastName: organizationData.managerLastName,
    password: organizationData.phone,
    region: organizationData.region,
    address: organizationData.address ? organizationData.address : "",
    hashedPassword: await bcrypt.hash(password, 10),
  });
  return createToken(user);
}

// TODO: remove hardcore organization & password
// let password = 123;
// const organization = await Organization.create({
//   name: "Bardhal",
//   email: "bardhal@gmail.com",
//   city: "Sofiq",
//   address: "Malinova Dolina 3",
//   managerFirstName: "Ivan",
//   managerLastName: "Ivan",
//   phone: "0899123123",
//   //This event is copied hardcore event from eventService.js
//   //TODO: in created event array they key must be real event _id -> propertie must be the real event
//   // createdEvents: [{"65463906dc185e1f50242d96": }
//   // createdEvents: [
//   //   {
//   //     title: "Race Fanatic!",
//   //     shortDescription: "ala bala",
//   //     longDescription: "Lorem ipsum dolor sit amet.",
//   //     dates: [
//   //       {
//   //         startDate: "2023-11-04T12:28:54.706Z",
//   //         startTime: "23:59",
//   //         endTime: "06:40",
//   //         _id: "65463906dc185e1f50242d97",
//   //       },
//   //     ],
//   //     imageUrl:
//   //       "https://cdn.akamai.steamstatic.com/steam/apps/1839940/capsule_616x353.jpg?t=1683123302",
//   //     contacts: {
//   //       coordinates: { lat: "", long: "" },
//   //       city: "Hisarya",
//   //       address: "Хайдут Генчо N1",
//   //       phone: "0123456789",
//   //       email: "peter@abv.bg",
//   //     },
//   //     category: "Off Road",
//   //     likedCount: 1,
//   //     creator: "6542c24b6102c6f4e79108fc",
//   //     winners: [{ name: "Az", _id: "65463906dc185e1f50242d98" }],
//   //     isDeleted: false,
//   //     _id: "65463906dc185e1f50242d96",
//   //     __v: "0",
//   //   },
//   // ],
//   isDeleted: false,
//   hashedPassword: await bcrypt.hash(password, 10),
// });
// return organization;

/*
TODO:
- loginOrganization,
- parseToken (can be exported)

*/

module.exports = {
  registerOrganization,
};
