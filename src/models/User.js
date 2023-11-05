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
    //TODO: chech the "unique" property if will work in real environment
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: "Invalid email",
    },
  },
  //TODO:  minimum and maximum length firstName
  firstName: {
    type: String,
    required: true,
    minlength: [2, "First name must be minimum 2 characters long!"],
    maxlength: [15, "First name must be maximum 15 characters long!"],
  },
  //TODO:  minimum and maximum length lastName
  lastName: {
    type: String,
    required: true,
    minlength: [2, "Last name must be minimum 2 characters long!"],
    maxlength: [15, "Last name must be maximum 15 characters long!"],
  },
  role: {
    type: String,
    require: true,
    /* TODO: Propper validation for role length
    minlength: [2, "Role must be minimum 2 characters long!"],
    maxlength: [15, "Role must be maximum 15 characters long!"],
    */
  },
  city: { type: String, required: true },
  /* TODO: Propper validation for city length
    minlength: [2, "City must be minimum 2 characters long!"],
    maxlength: [15, "City must be maximum 15 characters long!"],
    */
  address: {
    type: String,
    required: true,
    /* TODO: Propper validation for city length
    minlength: [2, "Adress must be minimum 2 characters long!"],
    maxlength: [15, "Adress must be maximum 15 characters long!"],
    */
  },
  //TODO: to take decision how we will take the likes
  // likedEvents: { type: ObjectId, ref: "Event", required: true, default:[] },
  likedEvents: [{ type: ObjectId, ref: "Event", required: true }],
  hashedPassword: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
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
