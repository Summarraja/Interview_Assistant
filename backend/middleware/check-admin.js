const User = require('.././models/user');
const HttpError = require('../models/http-error');
const Setting = require('../models/setting');

module.exports = async (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
  
    let user;
    try {
        user = await User.findById(req.userData.userId).populate({path:'setting',model:Setting});

        if (!user.setting.role=='Admin') {
            throw new Error('Admin Authentication failed!');
        }
        next();
    } catch (err) {
        const error = new HttpError('Admin Authentication failed!', 403);
        return next(error);
    }
};
