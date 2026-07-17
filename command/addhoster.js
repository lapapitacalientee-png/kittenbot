const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { loadData, saveData } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'addhoster',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?addhoster @user`');
    }

    const data = loadData();
    if (data[user.id] !== undefined) {
      const alreadyEmbed = new EmbedBuilder()
        .setColor('#E67E22')
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTitle('ℹ️ Already Listed')
        .setDescription(`${user} is already on the hoster leaderboard with **${data[user.id]} GN**.`)
        .setTimestamp();
      return message.reply({ embeds: [alreadyEmbed] });
    }

    data[user.id] = 0;
    saveData(data);

    const memberCount = Object.keys(data).length;

    const embed = new EmbedBuilder()
      .setColor('#3498DB')
      .setAuthor({ name: `${user.username} • Welcome Aboard`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTitle('🎉 New Hoster Added')
      .setDescription(
        `${user} has officially joined the hoster leaderboard!\n` +
        `Time to start hosting and racking up those GNs. 🚀`
      )
      .addFields(
        { name: '🎮 Starting GNs', value: '`0`', inline: true },
        { name: '👥 Total Hosters', value: `${memberCount}`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '📋 Next Steps', value: 'Use `j?profile` anytime to track progress, ratings, and quota status.', inline: false },
      )
      .setFooter({ text: `Added by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
