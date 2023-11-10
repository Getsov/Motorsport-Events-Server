const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

//TODO: add validation for fields in the schema
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    //TODO: check the "unique" property if will work in real environment
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: "Invalid email",
    },
  },
  firstName: { type: String },
  lastName: { type: String },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  region: {
    type: String,
    default: "",
    // TODO: Propper validation for city length
  },
  //TODO: to take decision how we will take the likes
  likedEvents: [{ type: ObjectId, ref: "Event" }],
  hashedPassword: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});


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
