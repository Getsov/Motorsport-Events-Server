
function duplicateDates(dates, date) {
    function checkDates(dates, date) {
        const filteredArray = dates.filter(obj => obj.date === date);
        return filteredArray.length > 1;
    }
    
    if (checkDates(dates, date)) {
        throw new Error('Event cant be created with same dates!');
    }
    
    dates.forEach(date => {
        if (date.startTime >= date.endTime) {
            throw new Error('Start-time can\'t be after or equal to end-time!')
        }
    });
}


module.exports = { duplicateDates };
