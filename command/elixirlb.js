const { EmbedBuilder } = require('discord.js');
const { loadElixir } = require('../utils/elixir');

module.exports = {
  data: {
    name: 'elixirlb',
  },
  async execute(message) {
    const data = loadElixir();
    const entries = Object.entries(data).filter(([, amount]) => amount > 0);

    if (entries.length === 0) {
      return message.reply('No elixir has been logged yet.');
    }

    await message.guild.members.fetch();

    const sorted = entries
      .map(([userId, amount]) => {
        const member = message.guild.members.cache.get(userId);
        const name = member ? (member.nickname || member.user.username) : `Unknown (${userId})`;
        return { name, amount };
      })
      .sort((a, b) => b.amount - a.amount);

    const medals = ['🥇', '🥈', '🥉'];
    const lines = sorted.map((entry, i) => {
      const position = i < 3 ? medals[i] : `\`#${i + 1}\``;
      return `${position} \`${entry.name}\` - **${entry.amount} 🍥**`;
    });

    const embed = new EmbedBuilder()
      .setColor('#FF6FB1')
      .setDescription(`**🍥 Elixir Leaderboard**\n\n${lines.join('\n')}`);

    message.reply({ embeds: [embed] });
  },
};
