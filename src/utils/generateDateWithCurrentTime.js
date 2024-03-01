function generateDateWithCurrentTime() {
    let dateOfCreation = new Date(Date.now());
    let localTime = dateOfCreation.toLocaleTimeString().split(' ч.')[0].split(':');
    dateOfCreation.setUTCHours(localTime[0], localTime[1], localTime[2], 999);
    dateOfCreation.toISOString();
    return dateOfCreation;
}

module.exports = {
    generateDateWithCurrentTime,
  };