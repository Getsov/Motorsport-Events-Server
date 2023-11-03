const { Schema, model, Types: { ObjectId }, } = require('mongoose');

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
                minlength: [5, "Hour must be in format: 'hh:mm'!"],
                maxlength: [5, "Hour must be in format: 'hh:mm'!"],
            },
            endTime: {
                type: String,
                required: true,
                minlength: [5, "Hour must be in format: 'hh:mm'!"],
                maxlength: [5, "Hour must be in format: 'hh:mm'!"],
            }
        }, { // Additional date and time (if needed)
            date: { type: Date },
            startTime: { type: String },
            endTime: { type: String }
        }]
    },
    imageUrl: { type: String, required: true },
    contacts: {
        // TODO: Check later for unique COORDS..!
        coordinates: { lat: { type: String }, long: { type: String } },
        city: { type: String },
        address: { type: String },
        phone: { type: String }, 
        email: { type: String }
    },
    category: { typr: String }, // Event category
    likedCount: { type: Number, default: 0 }, // Count of users who liked the event
    creator: { type: ObjectId, ref: 'User' }, // User who created the event (you can specify user properties here)
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