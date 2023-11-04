const { Schema, model, Types: { ObjectId }, } = require('mongoose');
const validTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const validString = /https?:\/\/./i;
const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
        // index: { unique: true },
        minlength: [5, "Title must be minimum 5 characters long!"],
        maxlength: [30, "Title must be maximum 30 characters long!"],
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: [5, "Description must be minimum 5 characters long!"],
        maxlength: [40, "Description must be maximum 40 characters long!"],
    },
    longDescription: {
        type: String,
        required: true,
        minlength: [5, "Description must be minimum 5 characters long!"],
        maxlength: [200, "Description must be maximum 200 characters long!"],
    },
    dates: {
        type: [{
            startDate: { type: Date, required: true },
            startTime: {
                type: String,
                required: true,
                validate: {
                    validator: (value) => validTime.test(value),
                    message: 'Invalid time format! Example: hh:mm (24h)'
                },
            },
            endTime: {
                type: String,
                required: true,
                validate: {
                    validator: (value) => validTime.test(value),
                    message: 'Invalid time format! Example: hh:mm (24h)'
                }
            }
        }]
    },
    imageUrl: {
        type: String,
        validate: {
            validator: (value) => validString.test(value),
            message: "Invalid URL, must start with HTTP/HTTPS",
        },
    },
    contacts: {
        // TODO: Check later for unique COORDS..!
        coordinates: { lat: { type: String }, long: { type: String } },
        city: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true }, 
        email: { type: String, required: true }
    },
    category: { type: String, required: true }, // Event category
    likedCount: { type: Number, default: 0 }, // Count of users who liked the event
    creator: { type: ObjectId, ref: 'User', required: true }, // User who created the event (you can specify user properties here)
    winners: [{ name: { type: String } }, { name: { type: String } }, { name: { type: String } }], // Array of event winners (you can specify winner properties here)
    isDeleted: { type: Boolean, default: false }
});

eventSchema.index(
    { title: 1 },
    {
        collation: {
            locale: "en",
            strength: 2,
        },
    }
);

const Event = model("Event", eventSchema);
module.exports = Event;