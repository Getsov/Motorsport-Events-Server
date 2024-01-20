function getNeededDates(year, month) {
  if (isNaN(year) || isNaN(month)) {
    throw new Error('Invalid query. Year and month should be numbers.');
  }
  
  if (year.toString().length != 4) {
    throw new Error('Invalid year.');
  }
  
  if (month < 1 || month > 12) {
    throw new Error('Invalid month value. Month should be in the range 1-12.');
  }
  
  const startDate = new Date(year, month - 1, 1);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  // Check who need to know about local time, and then pass this variables?
  // const localStartDate = startDate.toLocaleString();
  // const localEndDate = endDate.toLocaleString();

  return { startDate, endDate };
}

module.exports = {
  getNeededDates,
};
