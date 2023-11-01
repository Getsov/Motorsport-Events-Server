const User = require('./models/User');

async function register() {
    const user = await User.create({ username: 'Michael', email: 'Shumaher' });
    return user;
};

module.exports = {
    register
}