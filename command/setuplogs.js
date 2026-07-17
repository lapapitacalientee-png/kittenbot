const { PermissionsBitField } = require('discord.js');
const { setLogChannel } = require('../utils/logs');

module.exports = {
  data: {
    name: 'setuplogs',
  },
  execute(message) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const channel = message.mentions.channels.first();

    if (!channel) {
      return message.reply('❌ You must mention a channel. Usage: `j?setuplogs #channel`');
    }

    setLogChannel(message.guild.id, channel.id);
    message.reply(`✅ Command logs will now be sent to ${channel}.`);
  },
};
