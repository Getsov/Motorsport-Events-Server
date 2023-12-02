const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phoneRegex = /^[\d+()-\s]+$/;
const validTime = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
const validUrl = /https?:\/\/./i;
const validPassword = /^\S+$/;
// const phoneNumberRegex = /^(\+\d{1,2}\s?)?(\(\d{1,4}\)\s?)?[\d\s.-]{5,}$/;


// const checkPhoneNumber = (phoneNumber) => {
//     const regexObj = new RegExp(phoneRegex);
//     return regexObj.test(phoneNumber);
// };

module.exports = {
    emailRegex,
    phoneRegex,
    validTime,
    validUrl,
    // checkPhoneNumber,
};
