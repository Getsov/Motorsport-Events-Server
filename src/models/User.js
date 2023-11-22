const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');

const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

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
    organizator: {
        type: Schema.Types.String,
        required: true,
        validate: {
            validator: function (value) {
                // Allow strings and numbers
                //TODO: Test without validator
                return typeof value === 'string' || typeof value === 'number';
            },
            message: 'Name must be a string or a number!',
            minlength: [2, 'Name must be minimum 2 characters long!'],
            maxlength: [15, 'Name must be maximum 15 characters long!'],
        },
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
        enum: ['regular', 'admin', 'organizator'],
        default: 'regular',
    },
    region: {
        type: String,
        maxlength: [15, 'Region must be maximum 15 characters long!'],
        default: '',
        // TODO: Propper validation for city length
    },
    address: {
        type: String,
        default: '',
    },
    phone: { type: String },
    //TODO: to take decision how we will take the likes
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
