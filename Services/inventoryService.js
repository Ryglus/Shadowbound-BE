const inventoryRepository = require('../repositories/inventoryRepository');

class InventoryService {
    async getInventory(playerId) {
        try {
            const cachedInventory = await inventoryRepository.getCachedInventory(playerId);
            if (cachedInventory) {
                return cachedInventory;
            }

            const inventory = await inventoryRepository.getInventoryByPlayerId(playerId);
            if (inventory) {
                await inventoryRepository.cacheInventory(playerId, inventory);
            }

            return inventory;
        } catch (error) {
            console.error(`Error fetching inventory for player ${playerId}:`, error);
            throw new Error('Failed to fetch inventory');
        }
    }

    async addItem(playerId, item) {
        try {
            await inventoryRepository.addItemToInventory(playerId, item);
            await inventoryRepository.clearCachedInventory(playerId);
            return await this.getInventory(playerId);
        } catch (error) {
            console.error(`Error adding item to inventory for player ${playerId}:`, error);
            throw new Error('Failed to add item to inventory');
        }
    }

    async removeItem(playerId, itemId) {
        try {
            await inventoryRepository.removeItemFromInventory(playerId, itemId);
            await inventoryRepository.clearCachedInventory(playerId);
            return await this.getInventory(playerId);
        } catch (error) {
            console.error(`Error removing item from inventory for player ${playerId}:`, error);
            throw new Error('Failed to remove item from inventory');
        }
    }

    async updateItem(playerId, itemId, updates) {
        try {
            await inventoryRepository.updateItemInInventory(playerId, itemId, updates);
            await inventoryRepository.clearCachedInventory(playerId);
            return await this.getInventory(playerId);
        } catch (error) {
            console.error(`Error updating item in inventory for player ${playerId}:`, error);
            throw new Error('Failed to update item in inventory');
        }
    }
}

module.exports = new InventoryService();
