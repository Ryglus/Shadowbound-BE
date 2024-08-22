// repositories/exchangeRepository.js
const database = require('../Modules/db');
const { ObjectId } = require('mongodb');
const ExchangeItem = require('../models/exchangeItemModel');

class ExchangeRepository {

    async createItem(sellerId, itemName, price) {
        const db = await database.getDb();
        const newItem = new ExchangeItem(sellerId, itemName, price);
        await db.collection('exchange_items').insertOne(newItem);
        return newItem;
    }

    async getItemById(itemId) {
        const db = await database.getDb();
        return await db.collection('exchange_items').findOne({ _id: new ObjectId(itemId) });
    }

    async listItems(filter = {}) {
        const cacheKey = 'availableExchangeItems';
        const redisClient = await database.getRedis();

        let cachedItems = await redisClient.get(cacheKey);
        if (cachedItems) {
            return JSON.parse(cachedItems);
        }

        const db = await database.getDb();
        const items = await db.collection('exchange_items').find(filter).toArray();

        await redisClient.set(cacheKey, JSON.stringify(items), 'EX', 60); // Cache for 60 seconds
        return items;
    }

    async markItemAsSold(itemId, userId) {
        const db = await database.getDb();
        await db.collection('exchange_items').updateOne(
            { _id: new ObjectId(itemId) },
            { $set: { sold: true, buyerId: userId } }
        );
        return this.getItemById(itemId);
    }

    async clearCache(cacheKey) {
        const redisClient = await database.getRedis();
        await redisClient.del(cacheKey);
    }

    async deleteAllItems() {
        const db = await database.getDb();
        await db.collection('exchange_items').deleteMany({}); // Delete all items
        await this.clearCache('availableExchangeItems'); // Clear the cache for available items
        return { success: true, message: 'All items have been deleted' };
    }
}

module.exports = new ExchangeRepository();
