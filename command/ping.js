module.exports = {
  data: {
    name: 'ping',
  },
  execute(message) {
    message.reply(`🏓 Pong! Latency: ${Date.now() - message.createdTimestamp}ms | API: ${Math.round(message.client.ws.ping)}ms`);
  },
};
