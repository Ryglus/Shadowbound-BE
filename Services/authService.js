const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

function generateToken(user) {
    return jwt.sign(user, jwtSecret, { expiresIn: '1h' });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                reject('Invalid Token');
            } else {
                resolve(user);
            }
        });
    });
}

module.exports = { generateToken, verifyToken };
