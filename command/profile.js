const { EmbedBuilder } = require('discord.js');
const { loadData } = require('../utils/gamenights');
const { getBreak } = require('../utils/breaks');

module.exports = {
  data: {
    name: 'profile',
  },
  execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    if (!member) {
      return message.reply('❌ Could not find that user in this server.');
    }

    const data = loadData();
    const gamenights = data[user.id] || 0;

    const highestRole = member.roles.highest.name === '@everyone'
      ? 'No role'
      : member.roles.highest.name;

    const breakEndsAt = getBreak(user.id);
    const breakStatus = breakEndsAt
      ? `🟡 On break until <t:${Math.floor(breakEndsAt / 1000)}:F> (<t:${Math.floor(breakEndsAt / 1000)}:R>)`
      : '🟢 Not on break';

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || '#5865F2')
      .setTitle(`${user.username}'s Profile`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
        { name: 'Rank', value: highestRole, inline: true },
        { name: 'Gamenights', value: `${gamenights}`, inline: true },
        { name: 'Break Status', value: breakStatus, inline: false },
      )
      .setFooter({ text: `User ID: ${user.id}` });

    message.reply({ embeds: [embed] });
  },
};
