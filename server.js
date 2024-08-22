const express = require('express');
const http = require('http');
const cors = require('cors'); // Import the cors package
const db = require('./modules/db');
const setupWebSocket = require('./modules/ws');
const authController = require('./Controllers/authController');
const userController = require('./Controllers/userController');
const exchangeController = require('./Controllers/exchangeController'); // Import the Exchange controller

const { port } = require('./Config/config');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

async function start() {
    await db.connect()
    setupWebSocket(server);
}

// Set up WebSocket server

// Connect to database


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use('/api', authController);
app.use('/api', userController);
app.use('/api/exchange', exchangeController); // Add the Exchange routes


start();