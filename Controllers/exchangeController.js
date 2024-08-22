// controllers/exchangeController.js
const express = require('express');
const router = express.Router();
const exchangeService = require('../services/exchangeService');
const {verifyToken} = require("../Services/authService"); // Adjust the path as needed



router.post('/listItem', async (req, res) => {
    try {
        verifyToken(req.headers.authorization = req.headers.authorization.replace('Bearer ', ''))
            .then(async user => {
                const sellerId = user._id; // Access the userId (or sellerId) from the decoded token
                const { itemName, price } = req.body;
                await exchangeService.removeAllItems()
                const result = await exchangeService.listItem(sellerId, itemName, price);
                res.status(200).json({ success: true, message: 'Item listed successfully', data: result });
            })
            .catch(() => {

            });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/getItems', async (req, res) => {
    try {
        const items = await exchangeService.getAvailableItems();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/buyItem', async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const result = await exchangeService.buyItem(userId, itemId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
