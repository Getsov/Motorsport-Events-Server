const { Schema, model } = require('mongoose');
const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

//TODO: add validation for fields in the schema
//TODO: add city and likedEvents
const userSchema = new Schema({
    username: { type: String, require: true, },
    email: {
        type: String, required: true, unique: true, validate: {
            validator: (value) => emailRegex.test(value),
            message: "Invalid email",

        }
    },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    isDeleted: {type: Boolean, default: false}
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