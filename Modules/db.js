const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const { mongoUrl, redisUrl } = require('../config/config');

var db, redis;

async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(mongoUrl);
        db = client.db('test');
        redis = new Redis(redisUrl);
        console.log('Connected to Database');

    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
}

function getDb() {
    if (!db) throw new Error('Database not connected');
    return db;
}

function getRedis() {
    if (!redis) throw new Error('Redis not connected');
    return redis;
}



module.exports = { connectToDatabase, getDb, getRedis };
