const { getElixir } = require('../utils/elixir');

module.exports = {
  data: {
    name: 'myelixir',
  },
  execute(message) {
    const balance = getElixir(message.author.id);
    message.reply(`🍥 You have **${balance} elixir**.`);
  },
};
