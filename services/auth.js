const jwt = require('jsonwebtoken');

function setUser(user) {

    const payload = {
        _id: user.id,
        email: user.email,
        role: user.role
    }
    // { httpOnly: true, secure: true, sameSite: 'Strict' }
    const token = jwt.sign(payload, process.env.JWT_SECREAT)
    return token;
}

function getUser(token) {
    if (!token)
        return null;
    // console.log(`secreat ${process.env.JWT_SECREAT}`);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECREAT)
        return decoded;
    } catch (error) {
        console.log(`Error in varifying password ${error}`);
        return null
    }
}

module.exports = { setUser, getUser }