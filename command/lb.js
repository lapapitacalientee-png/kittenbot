const { EmbedBuilder } = require('discord.js');
const { loadData } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'lb',
  },
  async execute(message) {
    const data = loadData();
    const entries = Object.entries(data).filter(([, amount]) => amount > 0 || amount === 0);

    if (entries.length === 0) {
      return message.reply('No gamenights have been logged yet.');
    }

    await message.guild.members.fetch();

    const sorted = entries
      .map(([userId, amount]) => {
        const member = message.guild.members.cache.get(userId);
        const name = member ? (member.nickname || member.user.username) : `Unknown (${userId})`;
        const rank = member && member.roles.highest.name !== '@everyone'
          ? member.roles.highest.name
          : 'No role';
        return { name, amount, rank };
      })
      .sort((a, b) => b.amount - a.amount);

    const totalGNs = sorted.reduce((sum, e) => sum + e.amount, 0);
    const hostersListed = sorted.length;

    const medals = ['🥇', '🥈', '🥉'];

    const lines = sorted.map((entry, i) => {
      const position = i < 3 ? medals[i] : `\`#${i + 1}\``;
      return `${position} \`${entry.name}\` - **${entry.amount} GN** | ${entry.rank}`;
    });

    const embed = new EmbedBuilder()
      .setColor('#F1C40F')
      .setDescription(
        `**🏆 Overall GN Leaderboard**\n` +
        `_Most gamenights hosted of all time_\n` +
        `_Last updated <t:${Math.floor(Date.now() / 1000)}:R>_\n\n` +
        `**Total GNs Logged:** ${totalGNs}\n` +
        `**Hosters Listed:** ${hostersListed}\n\n` +
        lines.join('\n')
      );

    message.reply({ embeds: [embed] });
  },
};
