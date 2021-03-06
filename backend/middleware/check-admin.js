const User = require('.././models/user');
const HttpError = require('../models/http-error');

module.exports = async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.userData.userId);

        if (!user.isAdmin) {
            throw new Error('Admin Authentication failed!');
        }
        next();
    } catch (err) {
        const error = new HttpError('Admin Authentication failed!', 403);
        return next(error);
    }
};
