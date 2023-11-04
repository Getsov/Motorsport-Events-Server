const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

//TODO: add validation for fields in the schema
//TODO: add city and likedEvents
const userSchema = new Schema({
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
  firstName: { type: String, require: true },
  //TODO:  minimum and maximum length lastName
  lastName: { type: String, require: true },
  role: { type: String, require: true },
  city: { type: String, required: true },
  //TODO:  minimum and maximum length address
  address: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  //TODO: check the syntax
  likedEvents: { type: ObjectId, ref: "Event", required: true },
});

/*
const user = {
  likedEvents: [{ id: 'string' }] // Array of liked event IDs
};
*/

userSchema.index(
  { email: 1 },
  {
    collation: {
      locale: "en",
      strength: 2,
    },
  }
);

const User = model("User", userSchema);
module.exports = User;
