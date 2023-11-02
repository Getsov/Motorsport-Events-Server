
const User = require('../models/User');

async function registerUser() {
    const user = await User.create({ username: 'Michael', email: 'Shumaher' });
    return user;
};

module.exports = {
    registerUser
}