const { Schema, model } = require('mongoose');

const eventSchema = new Schema({
    eventName: { type: String, require: true, },
});

// eventSchema.index(
//     { eventName: 1 },
//     {
//         collation: {
//             locale: "en",
//             strength: 2,
//         },
//     }
// );

const Event = model("Event", eventSchema);
module.exports = Event;