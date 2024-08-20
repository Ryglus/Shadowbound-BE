const express = require('express');
const router = express.Router();
const { register, login } = require('../services/userService');
const { generateToken } = require('../services/authService');

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await register(username, password);
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await login(username, password);
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;
