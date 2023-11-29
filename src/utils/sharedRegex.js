const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[\d+()-\s]+$/;

const testRegex = (phoneNumber) => {
    const regexObj = new RegExp(phoneRegex);
    return regexObj.test(phoneNumber);
};

module.exports = {
    emailRegex,
    phoneRegex,
    testRegex,
};
