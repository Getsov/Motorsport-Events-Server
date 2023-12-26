const { events } = require("../models/Event");

function getNeededDates (year, month) {
    if (month < 1 || month > 12) {
        throw new Error(
            'Invalid month value. Month should be in the range 1-12.'
        );
    }

    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const todayStart = new Date(Date.now());
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(Date.now());
    todayEnd.setHours(0, 0, 0, 0);

    // Check who need to know about local time, and then pass this variables?
    const localStartDate = startDate.toLocaleString();
    const localEndDate = endDate.toLocaleString();

    return { startDate, endDate, todayStart, todayEnd };
};

module.exports = {
    getNeededDates
}

// Old function for getting upcoming and past events.

// async function getUpcomingPastEvents(today) {
//     if (today?.todayEnd) {
//         const events = await Event.find({
//             isDeleted: false,
//             isApproved: true,
//             dates: {
//                 $elemMatch: {
//                     date: {
//                         $gt: today.todayEnd
//                     },
//                 },
//             },
//         });
//         console.log('todayEnd', today.todayEnd);
//         return events;
//     }
//     if (today?.todayStart) {
//         const events = await Event.find({
//             isDeleted: false,
//             isApproved: true,
//             $expr: {
//                 $lt: [{ $arrayElemAt: ['$dates.date', -1] }, today.todayStart],
//             },
//         })
//         return events;
//     }
// }