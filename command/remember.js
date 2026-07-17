const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { loadData } = require('../utils/gamenights');
const { loadQuota } = require('../utils/quota');
const { getBreak } = require('../utils/breaks');

module.exports = {
  data: {
    name: 'remember',
  },
  async execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const quota = loadQuota();
    if (!quota.active) {
      return message.reply('❌ There is no active quota right now.');
    }

    const gnData = loadData();
    const endTimestamp = Math.floor(quota.endsAt / 1000);

    const results = Object.keys(quota.baseline).map((id) => {
      const before = quota.baseline[id] || 0;
      const after = gnData[id] || 0;
      const gained = Math.max(0, after - before);
      return { id, gained };
    });

    const notCompleted = results.filter((r) => r.gained < quota.goal);

    if (notCompleted.length === 0) {
      const doneEmbed = new EmbedBuilder()
        .setColor('#2ECC71')
        .setTitle('✅ Nothing to Remind')
        .setDescription('Every hoster has already completed the active quota.')
        .setTimestamp();
      return message.reply({ embeds: [doneEmbed] });
    }

    let sent = 0;
    let failed = 0;

    for (const r of notCompleted) {
      const remaining = quota.goal - r.gained;
      const onBreak = getBreak(r.id) !== null;

      try {
        const user = await message.client.users.fetch(r.id);
        const dmEmbed = new EmbedBuilder()
          .setColor('#E74C3C')
          .setTitle('⚠️ Quota Reminder')
          .setDescription(
            `You still need **${remaining} more GN(s)** to complete your current quota.\n` +
            `If it's not completed in time, you may receive a **warn**.`
          )
          .addFields(
            { name: 'Progress', value: `${r.gained}/${quota.goal} GN`, inline: true },
            { name: 'Deadline', value: `<t:${endTimestamp}:R>`, inline: true },
          )
          .setFooter({ text: onBreak ? 'Note: you are currently marked as on break' : 'Get hosting!' })
          .setTimestamp();

        await user.send({ embeds: [dmEmbed] });
        sent++;
      } catch (err) {
        failed++;
      }
    }

    const summaryEmbed = new EmbedBuilder()
      .setColor('#E67E22')
      .setTitle('📨 Quota Reminders Sent')
      .setDescription(`Reminded hosters who haven't completed the active quota yet.`)
      .addFields(
        { name: 'DMs Sent', value: `${sent}`, inline: true },
        { name: 'Failed (DMs closed)', value: `${failed}`, inline: true },
        { name: 'Quota Deadline', value: `<t:${endTimestamp}:R>`, inline: true },
      )
      .setFooter({ text: `Sent by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    message.reply({ embeds: [summaryEmbed] });
  },
};
