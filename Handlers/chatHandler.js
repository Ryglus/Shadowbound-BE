function handleChatMessage(data, ws, user) {
    const { message, targetUser } = data;

    if (targetUser) {
        // Private message
        const targetWs = activeConnections.get(targetUser.id);
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({ type: 'chatMessage', from: user.username, message }));
        }
    } else {
        // Global or Local message broadcast
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'chatMessage', from: user.username, message }));
            }
        });
    }
}
