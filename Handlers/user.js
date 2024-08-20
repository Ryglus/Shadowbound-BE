const { connectToDatabase, getDb, getRedis } = require('../modules/db');
const { ObjectId } = require('mongodb');

async function createUser(username, password) {
    const db = getDb();
    const user = { username, password }; // Note: Store hashed passwords in a real app!
    return await db.collection('users').insertOne(user);
}

async function getUserById(id) {
    const db = getDb();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
}

async function getUserByUsername(username) {
    const db = await getDb();
    return await db.collection('users').findOne({ username });
}

async function updateUser(id, updates) {
    const db = getDb();
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return getUserById(id);
}

async function deleteUser(id) {
    const db = getDb();
    console.log(await db.collection('users').deleteOne({ _id: new ObjectId(id) }));
}

module.exports = { createUser, getUserById, getUserByUsername, updateUser, deleteUser };
