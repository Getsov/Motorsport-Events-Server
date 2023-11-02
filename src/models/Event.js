const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    title: {
        type: String,
        require: true,
        minlength: [5, "Title must be minimum 5 characters long!"],
        maxlength: [30, "Title must be maximum 30 characters long!"],
    },
    description: {
        type: String,
        require: true,
        minlength: [5, "Description must be minimum 5 characters long!"],
        maxlength: [200, "Description must be maximum 30 characters long!"],
    },
    date: { type: Date, require: true, },
    time: { 
        type: String,
        require: true,
        minlength: [5, "Hour must be in format: 'hh:mm'!"],
        maxlength: [5, "Hour must be in format: 'hh:mm'!"],
    },
    eventLocation: { type: String, require: true, },
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