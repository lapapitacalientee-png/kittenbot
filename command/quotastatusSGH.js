const { EmbedBuilder } = require('discord.js');
const { loadData } = require('../utils/gamenights');
const { getBreak } = require('../utils/breaks');
const { loadQuotaSGH } = require('../utils/quotaSGH');

module.exports = {
  data: {
    name: 'quotastatussgh',
  },
  async execute(message) {
    const quota = loadQuotaSGH();
    if (!quota.active) {
      return message.reply('ℹ️ There is no active SGH quota right now.');
    }

    const gnData = loadData();

    const results = Object.keys(quota.baseline).map((id) => {
      const before = quota.baseline[id] || 0;
      const after = gnData[id] || 0;
      const gained = Math.max(0, after - before);
      return { id, gained };
    });

    await message.guild.members.fetch();

    const enriched = results.map((r) => {
      const member = message.guild.members.cache.get(r.id);
      const name = member ? (member.nickname || member.user.username) : `Unknown (${r.id})`;
      const onBreak = getBreak(r.id) !== null;
      return { ...r, name, onBreak };
    });

    const totalGNs = enriched.reduce((sum, e) => sum + e.gained, 0);
    const completed = enriched.filter((e) => e.gained >= quota.goal).sort((a, b) => b.gained - a.gained);
    const inProgress = enriched.filter((e) => e.gained < quota.goal).sort((a, b) => b.gained - a.gained);

    const inProgressText = inProgress.length > 0
      ? inProgress.map((e) => `• \`${e.name}\` - **${e.gained}/${quota.goal} GN**${e.onBreak ? ' 💤 on break' : ''}`).join('\n')
      : 'None';

    const completedText = completed.length > 0
      ? completed.map((e) => `• \`${e.name}\` - **${e.gained} GN**`).join('\n')
      : 'None';

    const startTimestamp = Math.floor(quota.startedAt / 1000);
    const endTimestamp = Math.floor(quota.endsAt / 1000);

    const description =
      `**📊 SGH Quota — In Progress**\n\n` +
      `**Started:** <t:${startTimestamp}:F>\n` +
      `**Ends:** <t:${endTimestamp}:F> (<t:${endTimestamp}:R>)\n` +
      `**Quota:** ${quota.goal} GN in ${quota.days} days\n` +
      `**Total GNs So Far:** ${totalGNs}\n` +
      `**Completed So Far:** ${completed.length}/${enriched.length}\n` +
      `**Still In Progress:** ${inProgress.length}/${enriched.length}\n\n` +
      `**⏳ Still In Progress**\n${inProgressText}\n\n` +
      `**✅ Completed Quota**\n${completedText}`;

    const embed = new EmbedBuilder()
      .setColor('#1ABC9C')
      .setDescription(description);

    await message.reply({ embeds: [embed] });
  },
};
