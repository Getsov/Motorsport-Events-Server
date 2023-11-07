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
            message: "Invalid URL, must start with HTTP:///HTTPS://",
        },
    },
    // TODO: To add some storage later!
    // imageFile: {
    //     data: Buffer,
    //     connectType: String
    // },
    contacts: {
        // TODO: Check later for unique COORDS..!
        coordinates: { lat: { type: String, required: true }, long: { type: String, required: true } },
        city: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    category: {
        type: String,
        required: true,
        minlength: [2, "Category must be minimum 2 characters long!"],
        maxlength: [30, "Category must be maximum 30 characters long!"],
        enum: [
            "Drag", "Drift", "Time Attack", "Offroad", "Moto Race",
            "Motocross", "Hill Climb", "Track", "Rally", "Rally Sprint",
            "Rallycross", "Autocross", "Karting", "SIM Racing", "Събори"
        ]
    },
    likes: [{ type: ObjectId, ref: 'User' } || { type: ObjectId, ref: 'Organization' }],
    // TODO: We must add Admin model later!
    creator: { type: ObjectId, ref: 'Admin', required: true } || { type: ObjectId, ref: 'Organization', required: true },
    winners: {
        type: [
            {
                name: { type: String, required: true },
                vehicle: { type: String, required: true },
                place: { type: Number, required: true }
            }
        ],
        validate: {
            validator: function (array) {
                return array.length <= 3;
            },
            message: 'Winners must be a maximum of 3 persons!',
        },
    },
    participantPrice: [{ price: { type: Number }, description: { type: String } }],
    visitorPrice: [{ price: { type: Number }, description: { type: String } }],
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