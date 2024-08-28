const WebSocket = require('ws');
const { verifyToken } = require('../Services/authService');
const playerHandler = require('../Handlers/movementHandler');
const itemHandler = require('../Handlers/itemHandler');

const wss = new WebSocket.Server({ noServer: true });
const activeConnections = new Map(); // In-memory storage for active WebSocket connections

console.log('WebSocket server is running on port 3000');

function setupWebSocket(server) {
    server.on('upgrade', (request, socket, head) => {
        console.log('Handling upgrade for client');
        const token = request.rawHeaders[request.rawHeaders.length-1].toString().replace("Authorization, ", "");

        if (!token) {
            socket.destroy(); // Reject connection if the Authorization header is missing
            return;
        }

        verifyToken(token)
            .then(user => {
                wss.handleUpgrade(request, socket, head, ws => {
                    console.log("Connected:", user.username);
                    if(activeConnections.has(user.id)) {
                        socket.destroy();
                    } else {
                        activeConnections.set(user.id, ws); // Store the WebSocket connection in memory

                        wss.emit('connection', ws, user);
                    }

                });
            })
            .catch(() => {
                socket.destroy(); // Reject connection if JWT is invalid
            });
    });

    wss.on('connection', (ws, user) => {
        ws.on('message', message => handleIncomingMessage(message, ws, user));
        ws.on('close', () => handleDisconnection(user));

        // Optionally, send a welcome message or initial data to the client
        ws.send(JSON.stringify({ type: 'welcome', message: `Welcome, ${user.username}!` }));
    });

    setInterval(() => {
        console.log(`Active connections: ${wss.clients.size}`);
    }, 5000); // Log the number of active connections every 5 seconds
}

function handleIncomingMessage(message, ws, user) {
    try {
        const data = JSON.parse(message);
        switch (data.type) {
            case 'playerMovement':
                playerHandler.handleMovement(data, ws);
                break;
            case 'playerAction':
                playerHandler.handleAction(data, ws);
                break;
            case 'itemAction':
                itemHandler.handleItemAction(data, ws);
                break;
            default:
                console.log(`Unknown message type: ${data.type}`);
        }
    } catch (error) {
        console.error('Error parsing message:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
}

function handleDisconnection(user) {
    console.log(`User ${user.username} disconnected`);
    activeConnections.delete(user.id); // Remove the WebSocket connection from memory
}

module.exports = setupWebSocket;
