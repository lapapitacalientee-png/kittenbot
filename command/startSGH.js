const { PermissionsBitField } = require('discord.js');
const { loadData } = require('../utils/gamenights');
const { loadQuotaSGH, saveQuotaSGH } = require('../utils/quotaSGH');

const GOAL = 7;
const DAYS = 14;
const ROLE_NAME = 'Senior Gamenight Hoster';

module.exports = {
  data: {
    name: 'startsgh',
  },
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const existing = loadQuotaSGH();
    if (existing.active) {
      return message.reply('❌ An SGH quota is already active. Use `j?quotaendSGH` to end it first.');
    }

    const role = message.guild.roles.cache.find((r) => r.name.toLowerCase() === ROLE_NAME.toLowerCase());
    if (!role) {
      return message.reply(`❌ Could not find a role named "${ROLE_NAME}" in this server.`);
    }

    await message.guild.members.fetch();
    const gnData = loadData();

    const hosterIds = Object.keys(gnData).filter((id) => {
      const member = message.guild.members.cache.get(id);
      return member && member.roles.cache.has(role.id);
    });

    if (hosterIds.length === 0) {
      return message.reply(`❌ No hosters on the leaderboard currently have the ${role.name} role.`);
    }

    const startedAt = Date.now();
    const endsAt = startedAt + DAYS * 24 * 60 * 60 * 1000;

    const baseline = {};
    for (const id of hosterIds) baseline[id] = gnData[id];

    saveQuotaSGH({
      active: true,
      type: 'SGH',
      startedAt,
      endsAt,
      startedBy: message.author.id,
      goal: GOAL,
      days: DAYS,
      baseline,
    });

    const endTimestamp = Math.floor(endsAt / 1000);

    await message.reply(
      `✅ SGH quota started for **${hosterIds.length}** ${role.name}(s).\n` +
      `Goal: **${GOAL} GNs** in **${DAYS} days**.\n` +
      `Ends: <t:${endTimestamp}:F>`
    );

    for (const id of hosterIds) {
      try {
        const user = await message.client.users.fetch(id);
        await user.send(
          `📋 A new SGH hosting quota has started!\n` +
          `You need **${GOAL} GN(s)** within the next **${DAYS} days**.\n` +
          `Ends: <t:${endTimestamp}:F>`
        );
      } catch (err) {
        console.log(`Could not DM user ${id}: ${err.message}`);
      }
    }
  },
};
