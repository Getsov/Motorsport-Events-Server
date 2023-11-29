const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const { emailRegex } = require('../utils/sharedRegex');


//TODO: add validation for fields in the schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => emailRegex.test(value),
            message: 'Invalid email',
        },
    },
    organizatorName: {
        type: String,
        maxlength: [40, 'Organizator name must be maximum 40 characters long!'],
        // default: '',
    },
    firstName: {
        type: String,
        maxlength: [15, 'First name must be maximum 15 characters long!'],
        default: '',
    },
    lastName: {
        type: String,
        maxlength: [15, 'Last name must be maximum 15 characters long!'],
        default: '',
    },
    role: {
        type: String,
        enum: ['regular', 'admin', 'organizer'],
        default: 'regular',
    },
    region: {
        // TODO - enum like in the front end
        type: String,
        maxlength: [15, 'Region must be maximum 15 characters long!'],
        default: '',
    },
    // address: {
    //     type: String,
    //     default: '',
    // },
    phone: { type: String, default: '' },
    createdEvents: [{ type: ObjectId, ref: 'Event' }],
    likedEvents: [{ type: ObjectId, ref: 'Event' }],
    hashedPassword: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
});

userSchema.index(
    { email: 1 },
    {
        collation: {
            locale: 'en',
            strength: 2,
        },
    }
);

const User = model('User', userSchema);
module.exports = User;
