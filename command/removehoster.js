const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { loadData, saveData } = require('../utils/gamenights');

module.exports = {
  data: {
    name: 'removehoster',
  },
  execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?removehoster @user`');
    }

    const data = loadData();

    if (data[user.id] === undefined) {
      const notFoundEmbed = new EmbedBuilder()
        .setColor('#E74C3C')
        .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
        .setTitle('❌ Not Found')
        .setDescription(`${user} is not currently on the hoster leaderboard.`)
        .setTimestamp();
      return message.reply({ embeds: [notFoundEmbed] });
    }

    const finalCount = data[user.id];
    delete data[user.id];
    saveData(data);

    const embed = new EmbedBuilder()
      .setColor('#E67E22')
      .setAuthor({ name: `${user.username} • Removed`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setTitle('🗑️ Hoster Removed')
      .setDescription(`${user} has been removed from the hoster leaderboard and database.`)
      .addFields(
        { name: 'Final Gamenight Count', value: `${finalCount}`, inline: true },
        { name: 'Status', value: 'Deleted', inline: true },
      )
      .setFooter({ text: `Removed by ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  },
};
