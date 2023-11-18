function parseToken(token) {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid acces token!');
    }
}

module.exports = {
    parseToken,
};
