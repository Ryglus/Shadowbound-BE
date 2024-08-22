// services/exchangeService.js
const exchangeRepository = require('../repositories/exchangeRepository');

class ExchangeService {

    async listItem(sellerId, itemName, price) {
        const newItem = await exchangeRepository.createItem(sellerId, itemName, price);
        // Invalidate cache after creating a new item
        await exchangeRepository.clearCache('availableExchangeItems');
        return newItem;
    }

    async getAvailableItems() {
        return await exchangeRepository.listItems({ sold: false });
    }
    async removeAllItems() {
        return await exchangeRepository.deleteAllItems();
    }
    async buyItem(userId, itemId) {
        const item = await exchangeRepository.getItemById(itemId);
        if (!item || item.sold) throw new Error('Item not found or already sold');

        const updatedItem = await exchangeRepository.markItemAsSold(itemId, userId);

        // Invalidate the cache
        await exchangeRepository.clearCache('availableExchangeItems');
        return { success: true, message: 'Item purchased successfully', item: updatedItem };
    }
}

module.exports = new ExchangeService();
