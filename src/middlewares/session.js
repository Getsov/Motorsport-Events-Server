const { parseToken } = require('../services/userService');
//TODO - add session as middleware because 
//organization and user use the same session function
module.exports = () => (req, res, next) => {
    const token = req.headers['x-authorization'];

    if (token) {
        try {
            const payload = parseToken(token);
            req.requester = payload;
            req.token = token;
        } catch (error) {
            return res
                .status(401)
                .json({ message: 'Invalid authorization token' });
        }
    }
    next();
};
