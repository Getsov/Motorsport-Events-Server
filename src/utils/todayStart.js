function getTodayStart() {
    const todayStart = new Date(Date.now());
    todayStart.setHours(0, 0, 0, 0);

    // Check who need to know about local time, and then pass this variables?
    // const localTodayStart = todayStart.toLocaleString();

    return { todayStart };
}

module.exports = {
    getTodayStart
}