const database = require('../Modules/db');
const { ObjectId } = require('mongodb');

class InventoryRepository {
    async getInventoryByPlayerId(playerId) {
        const db = await database.getDb();
        return await db.collection('inventories').findOne({ playerId: new ObjectId(playerId) });
    }

    async addItemToInventory(playerId, item) {
        const db = await database.getDb();
        return await db.collection('inventories').updateOne(
            { playerId: new ObjectId(playerId) },
            { $push: { items: item } }
        );
    }

    async removeItemFromInventory(playerId, itemId) {
        const db = await database.getDb();
        return await db.collection('inventories').updateOne(
            { playerId: new ObjectId(playerId) },
            { $pull: { items: { _id: new ObjectId(itemId) } } }
        );
    }

    async updateItemInInventory(playerId, itemId, updates) {
        const db = await database.getDb();
        return await db.collection('inventories').updateOne(
            { playerId: new ObjectId(playerId), 'items._id': new ObjectId(itemId) },
            { $set: { 'items.$': updates } }
        );
    }

    async cacheInventory(playerId, inventory) {
        const redisClient = await database.getRedis();
        await redisClient.set(`inventory:${playerId}`, JSON.stringify(inventory), 'EX', 60); // Cache for 60 seconds
    }

    async getCachedInventory(playerId) {
        const redisClient = await database.getRedis();
        const cachedInventory = await redisClient.get(`inventory:${playerId}`);
        return cachedInventory ? JSON.parse(cachedInventory) : null;
    }

    async clearCachedInventory(playerId) {
        const redisClient = await database.getRedis();
        await redisClient.del(`inventory:${playerId}`);
    }
}

module.exports = new InventoryRepository();
