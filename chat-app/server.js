const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
  console.log('New client connected');

  ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to the chat!' }));
  
  ws.on('message', message => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

