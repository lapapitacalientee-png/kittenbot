const { PermissionsBitField } = require('discord.js');
const { loadData } = require('../utils/gamenights');
const { loadQuota, saveQuota } = require('../utils/quota');

const GOAL = 3;
const DAYS = 7;

module.exports = {
  data: {
    name: 'quotagn',
  },
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const existing = loadQuota();
    if (existing.active) {
      return message.reply('❌ A quota is already active. Use `j?quotaend` to end it first.');
    }

    const gnData = loadData();
    const hosterIds = Object.keys(gnData);

    if (hosterIds.length === 0) {
      return message.reply('❌ No hosters on the leaderboard yet. Use `j?addhoster` first.');
    }

    const startedAt = Date.now();
    const endsAt = startedAt + DAYS * 24 * 60 * 60 * 1000;

    const baseline = {};
    for (const id of hosterIds) {
      baseline[id] = gnData[id];
    }

    saveQuota({
      active: true,
      startedAt,
      endsAt,
      startedBy: message.author.id,
      goal: GOAL,
      days: DAYS,
      baseline,
    });

    const endTimestamp = Math.floor(endsAt / 1000);

    await message.reply(
      `✅ Hoster quota started for **${hosterIds.length}** Hoster(s).\n` +
      `Goal: **${GOAL} GNs** in **${DAYS} days**.\n` +
      `Ends: <t:${endTimestamp}:F>`
    );

    for (const id of hosterIds) {
      try {
        const user = await message.client.users.fetch(id);
        await user.send(
          `📋 A new hosting quota has started!\n` +
          `You need **${GOAL} GN(s)** within the next **${DAYS} days**.\n` +
          `Ends: <t:${endTimestamp}:F>`
        );
      } catch (err) {
        console.log(`Could not DM user ${id}: ${err.message}`);
      }
    }
  },
};
