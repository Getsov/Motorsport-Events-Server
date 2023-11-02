const { Schema, model } = require('mongoose');
const emailValidator = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new Schema({
    username: { type: String, require: true, },
    email: { type: String, require: true }
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