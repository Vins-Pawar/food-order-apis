const { getUser } = require('../services/auth')

function checkForAuthentication(req, res, next) {
    const token = req.cookies?.userId
    // console.log('token '+token);
    req.user = null

    if (!token) {
        return next();
    }
    const user = getUser(token);

    req.user = user;
    next();
}

function restrictTo(roles = []) {
    return function (req, res, next) {
        // console.log(roles);
        // console.log("role " + req.user?.role);
        if (!req.user) return res.status(400).json({ Message: 'Please Login...!' })

        if (!roles.includes(req.user?.role)) return res.end('unathorized..!')

        next();
    }
}

module.exports = { checkForAuthentication, restrictTo }
