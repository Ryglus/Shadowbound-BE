const express = require('express');
const router = express.Router();
const { updateUser, deleteUser } = require('../handlers/user');

router.put('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const user = await updateUser(userId, updates);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await deleteUser(userId);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
