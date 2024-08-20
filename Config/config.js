require('dotenv').config();

module.exports = {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    port: process.env.PORT || 3000
};