function checkDatesAndTime(dates) {
    for (let i = 0; i < dates.length; i++) {
        const currentDate = dates[i].date;
        const startTime = dates[i].startTime;
        const endTime = dates[i].endTime;
        console.log(currentDate + 'currentDate');
        console.log(startTime);
        console.log(endTime);
        if (startTime >= endTime) {
            throw new Error("Start-time can't be after or equal to end-time!");
        }
        for (let j = 1; j < dates.length; j++) {
            const nextDate = dates[j].date;
            console.log(nextDate + 'nextDate');
            if (currentDate === nextDate) {
                throw new Error('Event cant be created with same dates!');
            }
        }
    }
}

module.exports = { checkDatesAndTime };
