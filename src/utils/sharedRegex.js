const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[\d+()-\s]+$/;

const checkPhoneNumber = (phoneNumber) => {
    const regexObj = new RegExp(phoneRegex);
    return regexObj.test(phoneNumber);
};

module.exports = {
    emailRegex,
    phoneRegex,
    checkPhoneNumber,
};
