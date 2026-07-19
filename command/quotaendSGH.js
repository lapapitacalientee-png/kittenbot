const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { loadData } = require('../utils/gamenights');
const { getBreak } = require('../utils/breaks');
const { loadQuotaSGH, saveQuotaSGH } = require('../utils/quotaSGH');

module.exports = {
  data: {
    name: 'quotaendsgh',
  },
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const quota = loadQuotaSGH();
    if (!quota.active) {
      return message.reply('❌ There is no active SGH quota to end.');
    }

    const gnData = loadData();
    const endedAt = Date.now();

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
    const notCompleted = enriched.filter((e) => e.gained < quota.goal).sort((a, b) => b.gained - a.gained);

    const maxGained = Math.max(...enriched.map((e) => e.gained), 0);
    const topHosters = enriched.filter((e) => e.gained === maxGained && maxGained > 0);
    const topHostersText = topHosters.length > 0
      ? topHosters.map((e) => `<@${e.id}> with **${e.gained} GN**`).join(', ')
      : 'None';

    const notCompletedText = notCompleted.length > 0
      ? notCompleted.map((e) => `• \`${e.name}\` - **${e.gained}/${quota.goal} GN**${e.onBreak ? ' 💤 on break' : ''}`).join('\n')
      : 'None';

    const completedText = completed.length > 0
      ? completed.map((e) => `• \`${e.name}\` - **${e.gained} GN**`).join('\n')
      : 'None';

    const startTimestamp = Math.floor(quota.startedAt / 1000);
    const endTimestamp = Math.floor(endedAt / 1000);

    const description =
      `**📊 SGH Quota Ended**\n\n` +
      `**Started:** <t:${startTimestamp}:F>\n` +
      `**Ended:** <t:${endTimestamp}:F>\n` +
      `**Ended By:** <@${message.author.id}>\n` +
      `**Quota:** ${quota.goal} GN\n` +
      `**Total GNs Hosted:** ${totalGNs}\n` +
      `**Top Hoster:** ${topHostersText}\n` +
      `**Completed Quota:** ${completed.length}/${enriched.length}\n` +
      `**Did Not Complete:** ${notCompleted.length}/${enriched.length}\n\n` +
      `**❌ Did Not Complete Quota**\n${notCompletedText}\n\n` +
      `**✅ Completed Quota**\n${completedText}`;

    saveQuotaSGH({ active: false });

    const embed = new EmbedBuilder()
      .setColor('#E67E22')
      .setDescription(description);

    await message.reply({ embeds: [embed] });
  },
};
