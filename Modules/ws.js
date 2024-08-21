const WebSocket = require('ws');
const { verifyToken } = require('../Services/authService');
const { getRedis } = require('./db');
const playerHandler = require('../Handlers/player');
const itemHandler = require('../Handlers/item');

const wss = new WebSocket.Server({ noServer: true });
console.log('WebSocket is running on port 3000');

function setupWebSocket(server) {
    server.on('upgrade', (request, socket, head) => {
        console.log('Handling upgrade for client');
        console.log(request.rawHeaders[request.rawHeaders.length-1]);
        const token = request.rawHeaders['Authorization'];
        console.log('Authorization token:', token);

        wss.handleUpgrade(request, socket, head, (ws) => {
            console.log('Client connected via WebSocket');
            wss.emit('connection', ws, request);
        });
    });

    /*
    server.on('upgrade', (request, socket, head) => {
        const token = request.headers['sec-websocket-protocol'];
        console.log('Authorization header:', token);

        verifyToken(token)
            .then(user => {
                wss.handleUpgrade(request, socket, head, ws => {
                    wss.emit('connection', ws, user);
                });
            })
            .catch(() => {
                socket.destroy(); // Reject connection if JWT is invalid
            });
    });

    wss.on('connection', (ws, user) => {
        console.log(user);

        // Save the WebSocket connection in Redis for easy retrieval
        getRedis().set(`player:${user.id}`, ws);

        ws.on('message', message => {
            try {
                const data = JSON.parse(message);
                switch (data.type) {
                    case 'AUTH':
                        console.log(data)
                        break;
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
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        });

        ws.on('close', () => {
            console.log(`User ${user.username} disconnected`);
            getRedis().del(`player:${user.id}`);
        });
    });

    // Heartbeat mechanism
    setInterval(() => {
        console.log(`Active connections: ${wss.clients.size}`);
        wss.clients.forEach(ws => {
            if (ws.isAlive === false) {
                ws.terminate(); // Terminate dead connections
                return;
            }
            ws.isAlive = false; // Mark connection as not alive
            ws.ping(); // Send a ping to keep the connection alive
        });
    }, 30000); // Heartbeat every 30 seconds

    wss.on('pong', () => {
        this.isAlive = true; // Reset the connection status on pong response
    });
     */
}

module.exports = setupWebSocket;
