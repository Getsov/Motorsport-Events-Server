const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

OrgnaizationSchema = new Schema({
  name: { type: String, require: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: "Invalid email",
    },
  },
  //TODO:  minimum and maximum length firstName
  managerFirstName: {
    type: String,
    required: true,
    minlength: [2, "Manager first name must be minimum 3 characters long!"],
    maxlength: [15, "Manager first name be maximum 15 characters long!"],
  },
  //TODO:  minimum and maximum length lastName
  managerLastName: {
    type: String,
    required: true,
    minlength: [2, "Manager last name must be minimum 3 characters long!"],
    maxlength: [15, "Manager last name be maximum 15 characters long!"],
  },
  //TODO: regex for phone, or minimum and maximum length
  phone: { type: String, required: true },
  //TODO:  minimum and maximum length city
  region: {
    type: Schema.Types.String,
    required: true,
    //TODO: Propper validation for city length

    validate: {
      validator: function (value) {
        // Allow strings and numbers
        return typeof value === "string" || typeof value === "number";
      },
      message: "Address must be a string or a number!",
      minlength: [2, "Region must be minimum 2 characters long!"],
      maxlength: [15, "Region must be maximum 15 characters long!"],
    },
  },
  //TODO:  minimum and maximum length address
  address: {
    type: String,
    default: "",
    // TODO: Propper validation for city length
  },
  createdEvents: [{ type: ObjectId, ref: "Event" }],
  //TODO: Will organization will like events
  likedEvents: [{ type: ObjectId, ref: "Event" }],
  isDeleted: { type: Boolean, default: false },
});

const Organization = model("Organization", OrgnaizationSchema);
module.exports = Organization;
