const { getUserByUsername, createUser } = require('../handlers/user');

async function register(username, password) {


    const existingUser = await getUserByUsername(username);
    if (existingUser) throw new Error('Username already exists');
    return createUser(username, password);
}

async function login(username, password) {
    const user = await getUserByUsername(username);
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    return user;
}

module.exports = { register, login };
