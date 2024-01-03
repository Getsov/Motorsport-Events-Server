function checkDatesAndTime(dates) {
  if (!dates || dates?.length < 1) {
    throw new Error('Event need dates!');
  }
  for (let i = 0; i < dates.length; i++) {
    const currentDate = dates[i].date;
    const startTime = dates[i].startTime;
    const endTime = dates[i].endTime;
    if (startTime >= endTime) {
      throw new Error("Start-time can't be after or equal to end-time!");
    }
    for (let j = i + 1; j < dates.length; j++) {
      const nextDate = dates[j].date;
      if (currentDate === nextDate) {
        throw new Error('Event cant be created with same dates!');
      }
    }
  }
}

module.exports = { checkDatesAndTime };
