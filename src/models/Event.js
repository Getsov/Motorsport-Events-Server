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
    eventLocation: { type: String, required: true },
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



// const organisation = {
//     name: 'string', // Organisation's name
//     createdEvents: [{}], // Array of created events (you can specify event properties here)
//     phone: 'string', // Organisation's phone number
//     email: 'string' // Organisation's email
// };

// const event = {
//     title: 'string', // Event title
//     shortDescription: 'string', // Short description of the event (up to XXX characters)
//     longDescr: 'string', // Long description of the event (up to XXX characters)
//     dates: [
//         { date: 'date', startTime: 'time', endTime: 'time' }, // Event date and time
//         { date: 'date2', startTime: 'time2', endTime: 'time2' } // Additional date and time (if needed)
//     ],
//     imageUrl: 'string', // URL of the event's image
//     contacts: {
//         coordinates: { lat: 'latitude', long: 'longitude' }, // Coordinates of the event
//         city: 'string', // Event city
//         address: 'string', // Event address
//         phone: 'string', // Event phone number
//         email: 'string' // Event email
//     },
//     category: 'string', // Event category
//     likedCount: 0, // Count of users who liked the event
//     creator: {}, // User who created the event (you can specify user properties here)
//     winners: [{}, {}, {}], // Array of event winners (you can specify winner properties here)
//     isDeleted: false // Indicates whether the event is deleted or not
// };