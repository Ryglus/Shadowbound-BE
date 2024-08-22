const { getDb } = require('../modules/db');

async function handleItemAction(data, ws) {
    const db = getDb();
    switch (data.action) {
        case 'pickUp':
            const item = await db.collection('items').findOne({ id: data.itemId });
            if (item) {
                await db.collection('players').updateOne(
                    { id: data.playerId },
                    { $push: { inventory: item } }
                );
                broadcast({ type: 'itemPickedUp', item });
            }
            break;

        case 'drop':
            await db.collection('players').updateOne(
                { id: data.playerId },
                { $pull: { inventory: { id: data.itemId } } }
            );
            const newItem = { id: uuid.v4(), ...data.item };
            await db.collection('items').insertOne(newItem);
            broadcast({ type: 'itemDropped', item: newItem });
            break;

        default:
            console.log(`Unknown item action: ${data.action}`);
    }
}

module.exports = { handleItemAction };
