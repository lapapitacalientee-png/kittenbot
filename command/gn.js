const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { addGamenights } = require('../utils/gamenights');
const { recordHost } = require('../utils/hostActivity');
const { loadQuota } = require('../utils/quota');
const { loadQuotaSGH } = require('../utils/quotaSGH');

async function checkQuotaCompletion(client, channel, userId, quota, label) {
  if (!quota.active || quota.baseline[userId] === undefined) return;

  const before = quota.baseline[userId] || 0;
  const gnData = require('../utils/gamenights').loadData();
  const after = gnData[userId] || 0;
  const gainedNow = Math.max(0, after - before);

  const gainedBeforeThisGn = gainedNow - 1; // this command just added at least 1

  if (gainedBeforeThisGn < quota.goal && gainedNow >= quota.goal) {
    try {
      const user = await client.users.fetch(userId);
      const embed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle(`🎉 ${label} Quota Completed!`)
        .setDescription(`You've hit your goal of **${quota.goal} GN(s)**! Great work keeping up with your quota.`)
        .setTimestamp();
      await user.send({ embeds: [embed] });
    } catch (err) {
      console.log(`Could not DM quota completion to ${userId}: ${err.message}`);
    }

    const channelEmbed = new EmbedBuilder()
      .setColor('#2ECC71')
      .setDescription(`🎉 <@${userId}> just completed their **${label} quota**! (${gainedNow}/${quota.goal} GN)`);
    channel.send({ embeds: [channelEmbed] }).catch(() => {});
  }
}

module.exports = {
  data: {
    name: 'gn',
  },
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const amount = parseInt(args[1], 10);

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?gn @user number`');
    }
    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ You must provide a valid number. Usage: `j?gn @user number`');
    }

    const total = addGamenights(user.id, amount);
    recordHost(user.id);

    message.reply(`✅ Added ${amount} gamenight(s) to ${user.username}. Total: **${total}**`);
    message.channel.send(`💡 If you attended this gamenight, remember you can rate it with \`j?rate @${user.username} <0-10>\`!`);

    const mainQuota = loadQuota();
    await checkQuotaCompletion(message.client, message.channel, user.id, mainQuota, mainQuota.type || 'Hoster');

    const sghQuota = loadQuotaSGH();
    await checkQuotaCompletion(message.client, message.channel, user.id, sghQuota, 'SGH');
  },
};
