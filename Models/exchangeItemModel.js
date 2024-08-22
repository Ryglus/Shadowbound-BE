class ExchangeListingModel {
    constructor(sellerId, item, price) {
        this.sellerId = sellerId;
        this.item = item; // Expecting an instance of ItemModel
        this.price = price;
        this.listedAt = new Date();
        this.sold = false;
    }

    // Optionally add methods to validate or manipulate listing data
}

module.exports = ExchangeListingModel;
