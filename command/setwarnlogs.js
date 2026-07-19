const { PermissionsBitField } = require('discord.js');
const { setWarnLogChannel } = require('../utils/warnLogs');

module.exports = {
  data: {
    name: 'setwarnlogs',
  },
  execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const channel = message.mentions.channels.first();

    if (!channel) {
      return message.reply('❌ You must mention a channel. Usage: `j?setwarnlogs #channel`');
    }

    setWarnLogChannel(message.guild.id, channel.id);
    message.reply(`✅ Warn logs will now be sent to ${channel}.`);
  },
};
