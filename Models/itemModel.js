// models/itemModel.js

class itemModel {
    constructor(itemId, itemName, iconId, stats, tradable) {
        this.itemId = itemId;         // Unique identifier for the item
        this.itemName = itemName;     // Name of the item
        this.iconId = iconId;         // ID for the icon representing the item
        this.stats = stats;           // Object containing item stats (e.g., damage, defense, etc.)
        this.tradable = tradable;     // Boolean indicating if the item can be traded
        this.timestamp = Date.now();  // Optional: Add a timestamp when the item is added to the inventory
    }

    // Method to get item details
    getItemDetails() {
        return {
            itemId: this.itemId,
            itemName: this.itemName,
            iconId: this.iconId,
            stats: this.stats,
            tradable: this.tradable
        };
    }

    // Method to check if item is tradable
    isTradable() {
        return this.tradable;
    }

    // Method to update item stats (if needed)
    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };
    }

    // Additional methods can be added as needed
}

module.exports = itemModel;
