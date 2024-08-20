const express = require('express');
const http = require('http');
const cors = require('cors'); // Import the cors package
const { connectToDatabase, getDb, getRedis } = require('./modules/db');
const setupWebSocket = require('./modules/ws');
const authController = require('./Controllers/authController');
const userController = require('./Controllers/userController');
const { port } = require('./Config/config');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Set up WebSocket server
setupWebSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// Route handlers
app.use('/api', authController);
app.use('/api', userController);

// Connect to database
connectToDatabase().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch(error => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});
