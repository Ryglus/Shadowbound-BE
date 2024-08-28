const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const {verifyToken} = require("../Services/authService");

router.get('/inventory', async (req, res) => {
    try {
        verifyToken(req.headers.authorization = req.headers.authorization.replace('Bearer ', ''))
            .then(async user => {
                const items = await inventoryService.getInventory(user._id);
                res.status(200).json(items);
            })
            .catch(() => {
                res.status(500).json({ success: false, message: "error" });
            });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});