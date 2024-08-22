class ExchangeItem {
    constructor(sellerId, itemName, price) {
        this.sellerId = sellerId;
        this.itemName = itemName;
        this.price = price;
        this.listedAt = new Date();
        this.sold = false;
    }

    // Optionally add methods to validate or manipulate item data
}

module.exports = ExchangeItem;
