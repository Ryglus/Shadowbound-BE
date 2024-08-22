const { getDb } = require('../modules/db');

async function handleMovement(data, ws) {
    const db = getDb();
    await db.collection('players').updateOne(
        { id: data.id },
        { $set: { xPos: data.xPos, yPos: data.yPos, zPos: data.zPos } },
        { upsert: true }
    );
    broadcast({ type: 'playerMovement', player: data });
}

async function handleAction(data, ws) {
    broadcast({ type: 'playerAction', player: data });
}

module.exports = { handleMovement, handleAction };
