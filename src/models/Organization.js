const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

OrgnaizationSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
    validate: {
      validator: function (value) {
        // Allow strings and numbers
        //TODO: Test only without validator
        return typeof value === "string" || typeof value === "number";
      },
      message: "Name must be a string or a number!",
      minlength: [2, "Name must be minimum 2 characters long!"],
      maxlength: [15, "Name must be maximum 15 characters long!"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: "Invalid email",
    },
  },
  managerFirstName: {
    type: String,
    required: true,
    minlength: [2, "Manager first name must be minimum 3 characters long!"],
    maxlength: [15, "Manager first name be maximum 15 characters long!"],
  },
  managerLastName: {
    type: String,
    required: true,
    minlength: [2, "Manager last name must be minimum 3 characters long!"],
    maxlength: [15, "Manager last name be maximum 15 characters long!"],
  },
  //TODO: regex for phone, or minimum and maximum length
  //TODO: checking with num
  phone: { type: String, required: true },
  region: {
    type: Schema.Types.String,
    required: true,
    validate: {
      validator: function (value) {
        // Allow strings and numbers
        //TODO: Test only without validator
        return typeof value === "string" || typeof value === "number";
      },
      message: "Region must be a string or a number!",
      minlength: [2, "Region must be minimum 2 characters long!"],
      maxlength: [15, "Region must be maximum 15 characters long!"],
    },
  },
  address: {
    type: String,
    default: "",
  },
  createdEvents: [{ type: ObjectId, ref: "Event" }],
  likedEvents: [{ type: ObjectId, ref: "Event" }],
  hashedPassword: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const Organization = model("Organization", OrgnaizationSchema);
module.exports = Organization;
