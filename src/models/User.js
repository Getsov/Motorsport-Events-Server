const { Schema, model } = require('mongoose');


//TODO: add validation for fields in the schema
const userSchema = new Schema({
    username: { type: String, require: true, },
    email: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
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