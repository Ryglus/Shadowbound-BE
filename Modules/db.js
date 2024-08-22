const { MongoClient } = require('mongodb');
const Redis = require('ioredis');
const { mongoUrl, redisUrl } = require('../config/config');
let db = null,redis = null,connected = false;
let instance = null;

class Database {
    constructor() {
        if (!instance) {
            // Create the instance only if it doesn't exist
            instance = this;
        }

        return instance;
    }

    async connect() {
        if (this.connected) return; // Prevent multiple connections

        try {
            const client = await MongoClient.connect(mongoUrl);
            db = client.db('test');
            redis = new Redis(redisUrl);
            connected = true;
            console.log('Connected to Database');
        } catch (error) {
            console.error('Failed to connect to MongoDB or Redis:', error);
            process.exit(1); // Exit process if connection fails
        }
    }

    async getDb() {
        if (!connected) await this.connect();
        if (!db) throw new Error('MongoDB not connected');
        return db;
    }

    async getRedis() {
        if (!connected) await this.connect();
        if (!redis) throw new Error('Redis not connected');
        return redis;
    }
}

module.exports = new Database();