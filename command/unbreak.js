const { PermissionsBitField } = require('discord.js');
const { removeBreak } = require('../utils/breaks');

module.exports = {
  data: {
    name: 'unbreak',
  },
  execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply('❌ You do not have permission to use this command.');
    }

    const user = message.mentions.users.first();

    if (!user) {
      return message.reply('❌ You must mention a user. Usage: `j?unbreak @user`');
    }

    removeBreak(user.id);
    message.reply(`✅ ${user.username} is no longer on break.`);
  },
};
