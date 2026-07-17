const { EmbedBuilder } = require('discord.js');
const { getTotal, getHistory } = require('../utils/credits');

module.exports = {
  data: {
    name: 'mycredits',
  },
  execute(message) {
    const total = getTotal(message.author.id);
    const history = getHistory(message.author.id);

    if (history.length === 0) {
      return message.reply('You have no credits yet.');
    }

    const lines = history
      .slice()
      .reverse()
      .map((entry) => `<t:${Math.floor(entry.date / 1000)}:f> — **+${entry.amount} credit(s)**`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setTitle(`${message.author.username}'s Credits`)
      .setDescription(`**Total: ${total} credits**\n\n${lines}`);

    message.reply({ embeds: [embed] });
  },
};
