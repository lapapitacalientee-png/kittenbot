const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const { addWarn } = require('../utils/warns');
const { getWarnLogChannel } = require('../utils/warnLogs');

module.exports = {
  data: {
    name: 'warn',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(' ');

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?warn @user <reason>`');
    }
    if (!reason) {
      return message.reply('❌ You must provide a reason. Usage: `j?warn @user <reason>`');
    }

    const activeWarns = addWarn(user.id, reason);
    message.reply(`⚠️ ${user.username} has been warned. Reason: **${reason}**. Active warns: **${activeWarns.length}**`);

    const warnLogChannelId = getWarnLogChannel(message.guild.id);
    if (warnLogChannelId) {
      const logChannel = message.guild.channels.cache.get(warnLogChannelId);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#E74C3C')
          .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setTitle('⚠️ Warn Issued')
          .addFields(
            { name: 'User', value: `<@${user.id}>`, inline: true },
            { name: 'Issued By', value: `<@${message.author.id}>`, inline: true },
            { name: 'Active Warns', value: `${activeWarns.length}`, inline: true },
            { name: 'Reason', value: reason, inline: false },
          )
          .setTimestamp();
        logChannel.send({ embeds: [logEmbed] }).catch(() => {});
      }
    }
  },
};
